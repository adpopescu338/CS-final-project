import { DatabaseStatus, Prisma } from '@prisma/client';
import { decrypt, getDbManager, getPort } from 'lib/utils';
import { sendDbCreatedEmail, sendDbLockedEmail } from 'libs/emails';
import { getServicePublicIp } from 'libs/k8/getServicePublicIp';
import { client } from 'prisma/client';
import { MAX_GIGA_SIZE_PER_DATABASE } from 'shared-constants';

const dbCheckSizeSelector = {
  where: {
    status: DatabaseStatus.Active,
  },
  include: {
    pod: {
      select: {
        internalAddress: true,
      },
    },
    user: {
      select: {
        email: true,
      },
    },
  },
};

type DbCheckSizeValue = Prisma.DatabaseGetPayload<typeof dbCheckSizeSelector>;

class CronClass {
  start() {
    setInterval(() => {
      this.checkMissingPodIp();
    }, 1000 * 60);

    setInterval(() => {
      this.updateDbSize();
    }, 1000 * 60 * 2);

    setInterval(() => {
      this.checkExceedingSize();
    }, 1000 * 60 * 3);
  }

  async checkMissingPodIp() {
    const pods = await client.pod.findMany({
      where: {
        publicIp: null,
      },
      include: {
        databases: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!pods.length) {
      console.log('Cron:: No missing pod ip');
      return;
    }

    await Promise.all(
      pods.map(async (pod) => {
        const publicIp = await getServicePublicIp(pod.serviceName);
        if (!publicIp) {
          console.log(`Cron:: No public ip for service ${pod.serviceName}`);
          return;
        }

        await client.pod.update({
          where: {
            id: pod.id,
          },
          data: {
            publicIp,
            databases: {
              updateMany: {
                where: {
                  id: {
                    in: pod.databases.map((db) => db.id),
                  },
                },
                data: {
                  status: DatabaseStatus.Active,
                },
              },
            },
          },
        });

        await Promise.all(
          pod.databases.map((db) => {
            return sendDbCreatedEmail({
              to: db.user.email,
              password: decrypt(db.encryptedPassword),
              username: decrypt(db.encryptedUsername),
              database: db.name,
              dbms: db.type,
              connectionString: decrypt(db.encryptedConnectionUrl),
              host: publicIp,
              port: getPort(db.type),
            });
          })
        );
      })
    );
  }

  async updateDbSize() {
    const databases = await client.database.findMany(dbCheckSizeSelector);
    await Promise.all(
      databases.map(async (db) => {
        const dbManager = getDbManager(db.type);
        const size = await dbManager.getWholeDbSize({ host: db.pod.internalAddress });
        if (!size || size === db.size) {
          console.log(`Cron:: No size change for ${db.name}`);
          return;
        }

        await client.database.update({
          where: {
            id: db.id,
          },
          data: {
            size,
          },
        });
      })
    );
  }

  async checkExceedingSize() {
    const databases = await client.database.findMany({
      ...dbCheckSizeSelector,
      where: {
        ...dbCheckSizeSelector.where,
        size: {
          gt: MAX_GIGA_SIZE_PER_DATABASE * 1024,
        },
      },
    });

    await Promise.all(
      databases.map(async (db) => {
        await this.lockDbForExceedingSize(db);
      })
    );
  }

  async lockDbForExceedingSize(db: DbCheckSizeValue) {
    const dbManager = getDbManager(db.type);
    await dbManager.lockDatabase(decrypt(db.encryptedUsername), db.name, {
      host: db.pod.internalAddress,
    });

    await Promise.all([
      client.database.update({
        where: {
          id: db.id,
        },
        data: {
          status: DatabaseStatus.Locked,
        },
      }),
      sendDbLockedEmail({
        to: db.user.email,
        database: db.name,
        dbms: db.type,
      }),
    ]);
  }
}

export const Cron = new CronClass();
