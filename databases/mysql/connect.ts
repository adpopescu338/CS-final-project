import mysql, { Connection } from 'mysql2';
import { ConnectionDetails, InternalConnectionDetails } from '../DBManager';
import { MYSQL_PORT } from 'lib/constants';

const connectionsMap = new Map();

const getDefaultConnectionDetails = (
  details: ConnectionDetails | InternalConnectionDetails
): ConnectionDetails => ({
  password: process.env.MYSQL_PASSWORD as string,
  user: 'root',
  port: MYSQL_PORT,
  ...details,
  host: details.host,
});

export const connect = (
  connectionDetails: ConnectionDetails | InternalConnectionDetails
): Promise<Connection> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);
  const connectionKey = JSON.stringify(connectionDetails);

  if (connectionsMap.has(connectionKey)) {
    console.log('Connection already exists!');
    return connectionsMap.get(connectionKey);
  }
  console.log(
    `Creating new connection to mysql for user ${connectionDetails.user}!`,
    connectionDetails
  );

  const connection = mysql.createConnection(connectionDetails);

  connection.on('end', (error) => {
    console.log('Connection ended!', error);
    connectionsMap.delete(connectionKey);
  });

  return new Promise((resolve, reject) => {
    // Connect to MySQL
    connection.connect((err) => {
      if (err) reject(err);
      else {
        console.log('Connected to MySQL server!');
        connectionsMap.set(connectionKey, connection);
        resolve(connection);
      }
    });
  });
};
