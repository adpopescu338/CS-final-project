import { MongoClient } from 'mongodb';
import { ConnectionDetails } from '../DBManager';

const getDefaultConnectionDetails = (details?: Partial<ConnectionDetails>): ConnectionDetails => ({
  user: process.env.MONGO_USERNAME as string,
  password: process.env.MONGO_PASSWORD as string,
  host: process.env.MONGO_HOST as string,
  port: 27017,
  ...details,
});

const connectionsMap = new Map();

export const connect = async (connectionDetails?: ConnectionDetails): Promise<MongoClient> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);
  const key = JSON.stringify(connectionDetails);
  if (connectionsMap.has(key)) {
    console.log('Using cached connection');
    return connectionsMap.get(key);
  }

  const auth = `${connectionDetails.user}:${connectionDetails.password}@`;
  const dbName = connectionDetails.database || '';
  const connectionString = `mongodb://${auth}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${dbName}`;

  const connection = await MongoClient.connect(connectionString);

  connection.on('close', () => {
    console.log('Connection closed!');
    connectionsMap.delete(key);
  });

  connectionsMap.set(key, connection);
  return connection;
};
