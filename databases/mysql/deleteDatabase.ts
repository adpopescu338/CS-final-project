import { Connection } from 'mysql2';

export const deleteDatabase = (connection: Connection, database: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.query(`ALTER DATABASE ${database} READ ONLY = 0;`, (err, result) => {
      if (err) {
        console.log('mysql: deleteDatabase -> Database unlock error', err);
        reject(err);
      }
      console.log('Database unlocked to allow deletion', result);

      connection.query(`DROP DATABASE ${database}`, (err, result) => {
        if (err) reject(err);
        console.log('Database deleted!', result);
        resolve();
      });
    });
  });
