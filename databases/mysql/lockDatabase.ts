import { Connection } from 'mysql2';

export const lockDatabase = (connection: Connection, database: string): Promise<void> =>
  new Promise((resolve, reject) => {
    connection.query(`ALTER DATABASE ${database} READ ONLY = 1;`, (err, result) => {
      if (err) {
        console.log('Error locking database', err);
        return reject(err);
      }

      console.log('User locked!', result);
      resolve();
    });
  });
