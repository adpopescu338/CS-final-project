import { MongoClient } from 'mongodb';

export const deleteDatabase = async (db: MongoClient, database: string): Promise<void> => {
  const result = await db.db(database).dropDatabase();

  if (!result) {
    throw new Error('Failed to delete database');
  }

  console.log(`Deleted database ${database}`, result);
};
