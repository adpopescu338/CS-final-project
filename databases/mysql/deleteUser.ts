import { Connection } from 'mysql2';

export const deleteUser = (connection: Connection, username: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.query(`DROP USER '${username}'@'%'`, (err, result) => {
      if (err) reject(err);
      else {
        console.log('User deleted!', result);
        resolve();
      }
    });
  });
