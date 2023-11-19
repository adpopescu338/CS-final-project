import { MongoClient } from 'mongodb';
import { ConnectionDetails, InternalConnectionDetails } from '../DBManager';
import { MONGO_PORT } from 'lib/constants';

const getDefaultConnectionDetails = (
  details: ConnectionDetails | InternalConnectionDetails
): ConnectionDetails => ({
  user: process.env.MONGO_USERNAME as string,
  password: process.env.MONGO_PASSWORD as string,
  port: MONGO_PORT,
  ...details,
  host: details.host,
});

const connectionsMap = new Map();

export const connect = async (
  connectionDetails: ConnectionDetails | InternalConnectionDetails
): Promise<MongoClient> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);
  const key = JSON.stringify(connectionDetails);
  if (connectionsMap.has(key)) {
    console.log('Using cached connection');
    return connectionsMap.get(key);
  }
  console.log(`Creating new connection to mongo for user ${connectionDetails.user}!`);
  const auth = `${connectionDetails.user}:${connectionDetails.password}@`;
  const dbName = connectionDetails.database || '';
  const connectionString = `mongodb://${auth}${connectionDetails.host}:${connectionDetails.port}/${dbName}`;

  const connection = await MongoClient.connect(connectionString);

  connection.on('close', () => {
    console.log('Connection closed!');
    connectionsMap.delete(key);
  });

  connection.on('error', (err) => {
    console.log('Connection error!', err);
    connectionsMap.delete(key);
  });

  connectionsMap.set(key, connection);
  return connection;
};
