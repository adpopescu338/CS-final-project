import { Client } from 'pg';

export const getWholeDbSize = async (db: Client) => {
  const result = await db.query('SELECT pg_database_size(current_database())');
  // return storage size in megabytes
  return result.rows[0].pg_database_size / 1024 / 1024;
};
