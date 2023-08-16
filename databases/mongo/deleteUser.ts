import { MongoClient } from 'mongodb';

export const deleteUser = async (db: MongoClient, username: string): Promise<void> => {
  const result = await db.db('users').collection('users').deleteOne({ username });

  if (!result.deletedCount) {
    throw new Error('Failed to delete user');
  }

  console.log(`Successfully deleted user ${username}`, result);
};
