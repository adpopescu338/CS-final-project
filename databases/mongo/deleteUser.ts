import { MongoClient } from 'mongodb';

export const deleteUser = async (
  db: MongoClient,
  username: string,
  database: string
): Promise<void> => {
  const result = await db.db(database).command({
    dropUser: username,
  });

  if (!result.ok) {
    console.error(`Failed to delete user ${username}`, result);
    throw new Error('Failed to delete user');
  }

  console.log(`Successfully deleted user ${username}`, result);
};
