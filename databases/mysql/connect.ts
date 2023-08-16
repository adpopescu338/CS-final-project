import mysql, { Connection } from 'mysql2';
import { ConnectionDetails } from '../DBManager';

const connectionsMap = new Map();

const getDefaultConnectionDetails = (details?: Partial<ConnectionDetails>): ConnectionDetails => ({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL root username
  password: process.env.MYSQL_PASSWORD as string,
  port: 3306,
  ...details,
});

export const connect = (connectionDetails?: ConnectionDetails): Promise<Connection> => {
  connectionDetails = getDefaultConnectionDetails(connectionDetails);
  const connectionKey = JSON.stringify(connectionDetails);

  if (connectionsMap.has(connectionKey)) {
    console.log('Connection already exists!');
    return connectionsMap.get(connectionKey);
  }
  // Replace the connection settings with your MySQL configuration
  const connection = mysql.createConnection({
    host: connectionDetails.host,
    user: connectionDetails.user,
    password: connectionDetails.password,
    port: connectionDetails.port,
  });

  connection.on('end', () => {
    console.log('Connection ended!');
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
