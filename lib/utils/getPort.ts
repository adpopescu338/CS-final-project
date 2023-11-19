import { DBMS } from '@prisma/client';
import { MONGO_PORT, MYSQL_PORT, POSTGRES_PORT } from 'lib/constants';

export const getPort = (db: DBMS) => {
  switch (db) {
    case DBMS.mongodb:
      return MONGO_PORT;
    case DBMS.postgresql:
      return POSTGRES_PORT;
    case DBMS.mysql:
      return MYSQL_PORT;
    default:
      throw new Error('Invalid DBMS');
  }
};
