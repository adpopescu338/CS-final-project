import { Client } from 'pg';
import { UserCreatedDetails, UserDetails } from '../DBManager';
import { POSTGRES_PORT } from 'lib/constants';

export const createDbAndUser = async (
  client: Client,
  { username, password, database }: UserDetails
): Promise<UserCreatedDetails> => {
  return new Promise((resolve, reject) => {
    // Create a new database

    client.query(`CREATE DATABASE ${database}`, (err) => {
      if (err) return reject(err);
      console.log('Database created!');

      // Create a new user
      client.query(`CREATE USER ${username} WITH PASSWORD '${password}'`, (err) => {
        if (err) {
          // revert changes
          console.log('Error creating user', err);
          client.query(`DROP DATABASE ${database}`, (err) => {
            if (err) {
              console.log('Error deleting database', err);
              return;
            }
            console.log('Database deleted!');
          });

          return reject(err);
        }
        console.log('User created!');

        // Grant read/write access to the user for the database
        client.query(`GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${username}`, (err) => {
          if (err) {
            // revert changes
            console.log('Error granting privileges', err);
            client.query(`DROP DATABASE ${database}`, (err) => {
              if (err) {
                console.log('Error deleting database', err);
                return;
              }
              console.log('Database deleted!');
            });

            client.query(`DROP USER ${username}`, (err) => {
              if (err) {
                console.log('Error deleting user', err);
                return;
              }
              console.log('User deleted!');
            });

            return reject(err);
          }
          console.log('Read/write access granted!');

          resolve({
            username,
            password,
            database,
            connectionUrl: `postgres://${username}:${password}@${process.env.POSTGRES_PUBLIC_HOST}:${POSTGRES_PORT}/${database}`,
            port: POSTGRES_PORT,
            host: process.env.POSTGRES_PUBLIC_HOST as string,
          });
        });
      });
    });
  });
};
