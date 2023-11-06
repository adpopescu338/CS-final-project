import { Client } from 'pg';

export const lockDatabase = async (db: Client, database: string) => {
  console.log('Postgres lock', database);
  const result = await db.query(
    `ALTER DATABASE ${database} SET default_transaction_read_only to ON;`
  );
  console.log('Postgres lock result', result);
  if (!result) {
    throw new Error('Failed to lock database');
  }
};
