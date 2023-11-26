const { config } = require('dotenv');
const { spawn } = require('child_process');
const { checkMandatoryEnvVariables } = require('./checkMandatoryEnvVariables.js');
const { unlinkSync } = require('fs');

const argv = process.argv.slice(2);
const local = argv.includes('--local');

const ENV_FILE = local ? '.env.local' : '.TEMP_ENV_FILE';

let decryptionKey;

if (!local) {
  const passwordArgIndex = argv.findIndex((arg) => arg === '--password');
  if (passwordArgIndex === -1) {
    throw new Error('Missing --password argument');
  }

  decryptionKey = argv[passwordArgIndex + 1];

  if (!decryptionKey) {
    throw new Error('Missing decryption key');
  }
}

const configVariables = async () => {
  if (decryptionKey) {
    // decrypt .env.gpg to .env
    await new Promise((resolve, reject) => {
      const decrypt = spawn('gpg', [
        '--decrypt',
        '--batch',
        '--passphrase',
        decryptionKey,
        '.env.gpg',
      ]);
      decrypt.stderr.setEncoding('utf8');
      const write = spawn('tee', [ENV_FILE]);
      decrypt.stderr.pipe(process.stderr);
      decrypt.stdout.pipe(write.stdin);
      decrypt.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`gpg exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }

  config({
    path: ENV_FILE,
  });
};

const deploy = async () => {
  await configVariables();

  checkMandatoryEnvVariables();

  const { MONGO_USERNAME, MONGO_PASSWORD, MYSQL_PASSWORD, POSTGRES_PASSWORD } = process.env;
  const missingVariables = [
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MYSQL_PASSWORD,
    POSTGRES_PASSWORD,
  ].filter((variable) => !variable);

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

  if (!local) {
    // remove temp env file
    unlinkSync(ENV_FILE);
  }
};

deploy();
