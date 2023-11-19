import { DatabaseStatus, Prisma } from '@prisma/client';
import { decrypt, getDbManager } from 'lib/utils';
import { sendDbLockedEmail } from 'lib/emails';
import { client } from 'prisma/client';
import { MAX_GIGA_SIZE_PER_DATABASE } from 'lib/constants';
import { getServiceInternalAddress } from 'lib/getServiceInternalAddress';

const dbCheckSizeSelector = {
  where: {
    status: DatabaseStatus.Active,
  },
  include: {
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
      this.updateDbSize();
    }, 1000 * 60 * 2);

    setInterval(() => {
      this.checkExceedingSize();
    }, 1000 * 60 * 3);
  }

  async updateDbSize() {
    const databases = await client.database.findMany(dbCheckSizeSelector);
    await Promise.all(
      databases.map(async (db) => {
        const dbManager = getDbManager(db.type);
        const size = await dbManager.getWholeDbSize({ host: getServiceInternalAddress(db.type) });
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
      host: getServiceInternalAddress(db.type),
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
