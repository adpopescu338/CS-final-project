import pg from 'pg';
import { ConnectionDetails } from '../DBManager';
import { POSTGRES_PORT } from 'libs/constants/backend';

const getDefaultConnectionDetails = (details?: Partial<ConnectionDetails>): ConnectionDetails => ({
  host: process.env.POSTGRES_HOST as string,
  password: process.env.POSTGRES_PASSWORD as string,
  user: 'postgres',
  port: POSTGRES_PORT,
  ...details,
});

const connectionsMap = new Map();

export const connect = (connectionDetails?: ConnectionDetails): Promise<pg.Client> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);

  const connectionKey = JSON.stringify(connectionDetails);

  if (connectionsMap.has(connectionKey)) {
    console.log('Connection already exists!');
    return connectionsMap.get(connectionKey);
  }

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
