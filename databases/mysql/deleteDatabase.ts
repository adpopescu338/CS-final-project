import { Connection } from 'mysql2';

export const deleteDatabase = (connection: Connection, database: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.query(`DROP DATABASE ${database}`, (err, result) => {
      if (err) reject(err);
      console.log('Database deleted!', result);
      resolve();
    });
  });
