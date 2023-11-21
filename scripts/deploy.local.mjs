import { config } from 'dotenv';
import { spawn } from 'child_process';

config({
  path: '.env.local',
});

const { MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD } = process.env;
console.log({ MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD });
const missingVariables = [MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD].filter(
  (variable) => !variable
);

if (missingVariables.length) {
  throw new Error(`Missing environment variables: ${missingVariables}`);
}

spawn('docker-compose', ['up', 'postgres', 'mongodb', 'mysql'], {
  stdio: 'inherit',
  env: process.env,
});
