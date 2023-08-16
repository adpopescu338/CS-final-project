import { Client } from 'pg';

export const deleteUser = (client: Client, username: string): Promise<void> =>
  new Promise((resolve, reject) => {
    client.query(`DROP USER ${username}`, (err, result) => {
      if (err) reject(err);
      else {
        console.log('User deleted!', result);
        resolve();
      }
    });
  });
