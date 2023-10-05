import { DBMS } from '@prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { mongoManager, mysqlManager, postgresManager } from 'databases';

export const getDbManager = (dbType: DBMS) => {
  switch (dbType) {
    case DBMS.mongodb:
      return mongoManager;
    case DBMS.mysql:
      return mysqlManager;
    case DBMS.postgresql:
      return postgresManager;
    default:
      throw new BeError('Invalid DBMS', ErrorCodes.InternalServerError);
  }
};
