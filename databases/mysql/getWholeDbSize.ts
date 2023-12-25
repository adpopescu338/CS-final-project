import { Connection } from 'mysql2';

export const getWholeDbSize = async (db: Connection): Promise<number> => {
  const dbName = db.config.database;
  console.log('mysql getWholeDbSize dbName', dbName);
  // set stats_expiry to 0 to prevent caching
  return new Promise((resolve, reject) => {
    db.query('SET SESSION information_schema_stats_expiry = 0;', undefined, (err) => {
      if (err) {
        console.log('mysql getWholeDbSize error during stats_expiry update', err);
        reject(err);
      }
      db.query(
        'SELECT SUM(data_length + index_length) / 1024 / 1024 AS total_size_in_MB FROM information_schema.TABLES;',
        undefined,
        (err, result) => {
          if (err) {
            reject(err);
          }
          console.log('mysql getWholeDbSize result', result);
          // return result in megabytes
          resolve(Number(result[0]['total_size_in_MB']));
        }
      );
    });
  });
};
