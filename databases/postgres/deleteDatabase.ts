import { Client } from 'pg';

export const deleteDatabase = (client: Client, database: string): Promise<void> =>
  new Promise((resolve, reject) => {
    client.query(`DROP DATABASE ${database}`, (err, result) => {
      if (err) reject(err);
      else {
        console.log('Database deleted!', result);
        resolve();
      }
    });
  });
