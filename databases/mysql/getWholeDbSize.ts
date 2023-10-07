import { Connection } from 'mysql2';

export const getWholeDbSize = async (db: Connection): Promise<number> =>
  new Promise((resolve, reject) => {
    db.query(
      'SELECT SUM(data_length + index_length) / 1024 / 1024 AS total_size_in_MB FROM information_schema.TABLES;',
      undefined,
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log('mysql getWholeDbSize result', result);
        // return result in megabytes
        resolve(result[0]['total_size_in_MB']);
      }
    );
  });
