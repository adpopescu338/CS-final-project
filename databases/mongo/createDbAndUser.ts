import { MongoClient } from 'mongodb';
import { UserDetails, UserCreatedDetails } from '../DBManager';
import { MONGO_PORT } from 'lib/constants';
import { getDatabaseHost } from 'lib/getDatabaseHost';

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

  const publicHost = getDatabaseHost('mongodb', true);

  return {
    connectionUrl: `mongodb://${username}:${password}@${publicHost}:${MONGO_PORT}/${database}`,
    port: MONGO_PORT,
    host: publicHost,
    username,
    password,
    database,
  };
};
