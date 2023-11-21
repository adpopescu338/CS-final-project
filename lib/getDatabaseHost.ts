import { DBMS } from '@prisma/client';

export const getDatabaseHost = (type: DBMS, publicHost = false) => {
  if (process.env.LOCAL === 'true') {
    return '127.0.0.1';
  }

  const publicAddress = (process.env.PUBLIC_URL as string).split('//')[1].split(':')[0];

  switch (type) {
    case DBMS.mysql:
      return publicHost ? publicAddress : 'mysql';
    case DBMS.postgresql:
      return publicHost ? publicAddress : 'postgres';
    case DBMS.mongodb:
      return publicHost ? publicAddress : 'mongodb';
    default:
      throw new Error('Unknown DBMS type');
  }
};
