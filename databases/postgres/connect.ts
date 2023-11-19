import pg from 'pg';
import { ConnectionDetails, InternalConnectionDetails } from '../DBManager';
import { POSTGRES_PORT } from 'lib/constants';

const getDefaultConnectionDetails = (
  details: ConnectionDetails | InternalConnectionDetails
): ConnectionDetails => ({
  password: process.env.POSTGRES_PASSWORD as string,
  user: 'postgres',
  port: POSTGRES_PORT,
  ...details,
  host: details.host,
});

const connectionsMap = new Map();

export const connect = (
  connectionDetails: ConnectionDetails | InternalConnectionDetails
): Promise<pg.Client> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);

  const connectionKey = JSON.stringify(connectionDetails);

  if (connectionsMap.has(connectionKey)) {
    console.log('Connection already exists!');
    return connectionsMap.get(connectionKey);
  }
  console.log(`Creating new connection to postgres for user ${connectionDetails.user}!`);
  const client = new pg.Client(connectionDetails);

  // This will replace the 'end' event listener for the MySQL connection
  client.on('end', () => {
    console.log('Connection ended!');
    connectionsMap.delete(connectionKey);
  });

  return new Promise((resolve, reject) => {
    // Connect to PostgreSQL
    client.connect((err) => {
      if (err) reject(err);
      else {
        console.log('Connected to PostgreSQL server!');
        connectionsMap.set(connectionKey, client);
        resolve(client);
      }
    });
  });
};
