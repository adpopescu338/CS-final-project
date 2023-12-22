import { Database, DatabaseStatus, Prisma } from '@prisma/client';
import { decrypt, getDbManager } from 'lib/utils';
import { sendDbLockedEmail } from 'lib/emails';
import { client } from 'prisma/client';
import { MAX_GIGA_SIZE_PER_DATABASE } from 'lib/constants';
import { getDatabaseHost } from 'lib/getDatabaseHost';

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
  private UPDATE_DB_SIZE_INTERVAL = 1000 * 60;
  private CHECK_EXCEEDING_SIZE_INTERVAL = 1000 * 60 * 1.5;
  private started = false;
  public start() {
    if (this.started) {
      return;
    }
    this.started = true;
    console.log('Cron:: Starting cron');
    setInterval(this.updateDbSize.bind(this), this.UPDATE_DB_SIZE_INTERVAL);
    setInterval(this.checkExceedingSize.bind(this), this.CHECK_EXCEEDING_SIZE_INTERVAL);
  }

  public async checkNewDbSize(db: Database) {
    await this.updateSingleDbSize(db);
  }

  private async updateSingleDbSize(db: Database) {
    const dbManager = getDbManager(db.type);
    const size = await dbManager.getWholeDbSize({
      host: getDatabaseHost(db.type),
      user: decrypt(db.encryptedUsername),
      password: decrypt(db.encryptedPassword),
      database: db.name,
    });
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
  }

  private async updateDbSize() {
    console.log('Cron:: Updating db size');
    const databases = await client.database.findMany(dbCheckSizeSelector);
    await Promise.all(databases.map(this.updateSingleDbSize));
  }

  private async checkExceedingSize() {
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

  private async lockDbForExceedingSize(db: DbCheckSizeValue) {
    const dbManager = getDbManager(db.type);
    await dbManager.lockDatabase(decrypt(db.encryptedUsername), db.name, {
      host: getDatabaseHost(db.type),
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
