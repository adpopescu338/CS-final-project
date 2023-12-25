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
  private UPDATE_DB_SIZE_INTERVAL = 1000 * 30;
  private started = false;
  public start() {
    if (this.started) {
      return;
    }
    this.started = true;
    console.log('Cron:: Starting cron');
    setInterval(this.updateDbSize.bind(this), this.UPDATE_DB_SIZE_INTERVAL);
  }

  public async checkNewDbSize(db: DbCheckSizeValue) {
    await this.updateSingleDbSize(db);
  }

  private async updateSingleDbSize(db: DbCheckSizeValue) {
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

    const data: Partial<Database> = {
      size,
    };

    const sizeIsExceeding = size > MAX_GIGA_SIZE_PER_DATABASE * 1024;

    if (sizeIsExceeding) {
      data.status = DatabaseStatus.Locked;
    }

    await Promise.all([
      sizeIsExceeding && this.lockDbForExceedingSize(db),
      client.database.update({
        where: {
          id: db.id,
        },
        data,
      }),
    ]);
  }

  private async updateDbSize() {
    console.log('Cron:: Updating db size');
    const databases = await client.database.findMany(dbCheckSizeSelector);
    await Promise.all(databases.map(this.updateSingleDbSize));
  }

  private async lockDbForExceedingSize(db: DbCheckSizeValue) {
    const dbManager = getDbManager(db.type);
    await dbManager.lockDatabase(decrypt(db.encryptedUsername), db.name, {
      host: getDatabaseHost(db.type),
    });

    await sendDbLockedEmail({
      to: db.user.email,
      database: db.name,
      dbms: db.type,
    });
  }
}

export const Cron = new CronClass();
