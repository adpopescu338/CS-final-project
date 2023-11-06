import { MongoClient } from 'mongodb';

export const lockDatabase = async (db: MongoClient, username: string, database: string) => {
  console.log('Mongo lock', username, database);
  const result = await db.db(database).command({
    updateUser: username,
    roles: [{ role: 'read', db: database }],
  });
  console.log('Mongo lock result', result);
  if (!result.ok) {
    throw new Error('Failed to lock database');
  }
};
