import { DBMS } from '@prisma/client';

export const getServiceInternalAddress = (type: DBMS) => {
  // Check env to see if we're in a k8s cluster
  if (process.env.LOCAL === 'true') {
    return '127.0.0.1';
  }

  switch (type) {
    case DBMS.mysql:
      return 'mysql';
    case DBMS.postgresql:
      return 'postgres';
    case DBMS.mongodb:
      return 'mongodb';
    default:
      throw new Error('Unknown DBMS type');
  }
};
