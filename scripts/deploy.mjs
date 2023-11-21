import { config } from 'dotenv';
import { spawn } from 'child_process';
import { checkMandatoryEnvVariables } from './checkMandatoryEnvVariables.mjs';

config({
  path: '.env',
});

checkMandatoryEnvVariables();

const argv = process.argv.slice(2);
const local = argv.includes('--local');

const { MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD } = process.env;
const missingVariables = [MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD].filter(
  (variable) => !variable
);

if (missingVariables.length) {
  throw new Error(`Missing environment variables: ${missingVariables}`);
}

spawn(
  'docker-compose',
  // on local, only start the databases
  // the next app will be started with `yarn dev`
  local ? ['up', 'postgres', 'mongodb', 'mysql'] : ['up'],
  {
    stdio: 'inherit',
    env: process.env,
  }
);
