import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * This script is used to write an .env file for the prisma client to use.
 */

config();

const databaseName = 'internal_db';

const databaseUrl = `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${databaseName}`;

writeFileSync(join(process.cwd(), './prisma/.env'), `DATABASE_URL=${databaseUrl}\n`);
