import { Client } from 'pg';
import { UserCreatedDetails, UserDetails } from '../DBManager';
import { POSTGRES_PORT } from 'lib/constants';
import { getDatabaseHost } from 'lib/getDatabaseHost';

export const createDbAndUser = async (
  client: Client,
  { username, password, database }: UserDetails
): Promise<UserCreatedDetails> => {
  return new Promise((resolve, reject) => {
    // Create a new database

    client.query(`CREATE DATABASE ${database}`, (err) => {
      if (err) {
        console.error('Error creating postgres database', err);
        return reject(err);
      }

      console.log('Database created!');

      const createUserQuery = `CREATE USER ${username} WITH PASSWORD '${password}'`;

      // Create a new user
      client.query(createUserQuery, (err) => {
        if (err) {
          // revert changes
          console.log(`Error creating user with query "${createUserQuery}"`, err);
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

        const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${username}`;
        // Grant read/write access to the user for the database
        client.query(grantPrivilegesQuery, (err) => {
          if (err) {
            // revert changes
            console.log(`Error granting privileges with query "${grantPrivilegesQuery}"`, err);
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

          const publicHost = getDatabaseHost('postgresql', true);

          resolve({
            username,
            password,
            database,
            connectionUrl: `postgres://${username}:${password}@${publicHost}:${POSTGRES_PORT}/${database}`,
            port: POSTGRES_PORT,
            host: publicHost,
          });
        });
      });
    });
  });
};
