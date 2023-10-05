import { Connection } from 'mysql2';

export const getWholeDbSize = async (db: Connection): Promise<number> =>
  new Promise((resolve, reject) => {
    db.query(
      'SELECT SUM(data_length + index_length) / 1024 / 1024 FROM information_schema.TABLES WHERE table_schema = ?',
      undefined,
      (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        // return result in megabytes
        resolve(result[0]['SUM(data_length + index_length) / 1024 / 1024']);
      }
    );
  });
