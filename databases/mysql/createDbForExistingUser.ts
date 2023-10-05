import { UserDetails, UserCreatedDetails } from '../DBManager';
import { Connection } from 'mysql2';
import { MYSQL_PORT } from 'libs/constants/backend';

export const createDbForExistingUser = async (
  connection: Connection,
  { username, password, database }: UserDetails
): Promise<UserCreatedDetails> => {
  return new Promise((resolve, reject) => {
    // Create a new database
    connection.query(`CREATE DATABASE ${database}`, (err) => {
      if (err) return reject(err);
      console.log(`Database for existing user ${username} created!`);

      // Grant read/write access to the user for the database
      connection.query(`GRANT ALL PRIVILEGES ON ${database}.* TO '${username}'@'%'`, (err) => {
        if (err) {
          // revert changes
          console.log('Error granting privileges', err);
          connection.query(`DROP DATABASE ${database}`, (err) => {
            if (err) reject(err);
            console.log('Database deleted!');
          });

          return reject(err);
        }
        console.log('Read/write access granted!');

        resolve({
          username,
          password,
          database,
          connectionUrl: `mysql://${username}:${password}@${process.env.MYSQL_PUBLIC_HOST}:${MYSQL_PORT}/${database}`,
          port: MYSQL_PORT,
          host: process.env.MYSQL_PUBLIC_HOST as string,
        });
      });
    });
  });
};
