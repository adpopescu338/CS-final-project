import { Client } from 'pg';

export const deleteDatabase = (client: Client, database: string): Promise<void> =>
  new Promise((resolve, reject) => {
    client.query(`DROP DATABASE ${database} WITH (FORCE)`, (err, result) => {
      if (err) reject(err);
      else {
        console.log('Database deleted!', result);
        resolve();
      }
    });
  });
