import { DBMS, DatabaseStatus } from '@prisma/client';
import { mongoManager, mysqlManager, postgresManager } from 'databases';
import { client } from 'prisma/client';
import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';

export const revert = async (
  dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager,
  username: string,
  database: string,
  host: string
) => {
  await Promise.all([
    dbManager.deleteUser(username, { host }),
    dbManager.deleteDatabase(database, { host }),
  ]);
};

export const checkIfUserCanCreateDb = async (userId: string, type: DBMS) => {
  const databases = await client.database.findMany({
    where: {
      userId,
      type,
      status: {
        not: DatabaseStatus.Deleted,
      },
    },
  });

  if (!databases?.length) {
    // user doesn't exist in the db yet, so we need to create it
    return {
      shouldCreateUser: true,
    };
  }

  throw new BeError(`You already have a ${type} database. `, ErrorCodes.Forbidden);
};
