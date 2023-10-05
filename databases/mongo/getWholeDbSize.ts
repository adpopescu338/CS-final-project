import { MongoClient } from 'mongodb';

export const getWholeDbSize = async (db: MongoClient) => {
  const result = await db.db().stats();
  // return storage size in megabytes
  return result.storageSize / 1024 / 1024;
};
