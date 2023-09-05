import { MongoClient } from 'mongodb';
import { UserDetails, UserCreatedDetails } from '../DBManager';
import { MONGO_PORT } from 'libs/constants/backend';

export const createDbAndUser = async (
  db: MongoClient,
  { username, password, database }: UserDetails
): Promise<UserCreatedDetails> => {
  const result = await db.db(database).command({
    createUser: username,
    pwd: password,
    roles: [{ role: 'readWrite', db: database }],
  });

  if (!result.ok) {
    throw new Error('Failed to create user');
  }

  return {
    connectionUrl: `mongodb://${username}:${password}@${process.env.MONGO_HOST}:${MONGO_PORT}/${database}`,
    username,
    password,
    database,
  };
};
