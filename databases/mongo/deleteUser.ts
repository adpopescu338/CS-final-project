import { MongoClient } from 'mongodb';

export const deleteUser = async (db: MongoClient, username: string): Promise<void> => {
  const result = await db.db('users').collection('users').deleteOne({ username });

  if (!result.deletedCount) {
    console.error(`Failed to delete user ${username}`, result);
    throw new Error('Failed to delete user');
  }

  console.log(`Successfully deleted user ${username}`, result);
};
