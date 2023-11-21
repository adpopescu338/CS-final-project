import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

const envVariableKeys = await new Promise((resolve, reject) => {
  const child = spawn(`aws ssm describe-parameters --query "Parameters[*].Name"`, {
    shell: true,
  });
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (data) => {
    child.kill();
    resolve(JSON.parse(data));
  });

  child.stderr.on('data', (data) => {
    child.kill();
    reject(data);
  });

  child.on('close', (code) => {
    if (code) {
      reject(`child process exited with code ${code}`);
    }
  });
});

let envVariables = await Promise.all(
  envVariableKeys.map((key) => {
    return new Promise((resolve, reject) => {
      const child = spawn(
        `aws ssm get-parameter --name ${key} --with-decryption --query "Parameter.Value"`,
        {
          shell: true,
        }
      );
      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      child.stdout.on('data', (data) => {
        child.kill();
        resolve({
          [key]: JSON.parse(data),
        });
      });

      child.stderr.on('data', (data) => {
        child.kill();
        reject(data);
      });

      child.on('close', (code) => {
        if (code) {
          reject(`child process exited with code ${code}`);
        }
      });
    });
  })
);

envVariables = envVariables.reduce(
  (acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  },
  {
    DATABASE_URL: `postgres://postgres:${envVariables.POSTGRES_PASSWORD}@postgres:5432`,
  }
);

writeFileSync(
  '.env',
  Object.keys(envVariables)
    .map((key) => `${key}=${envVariables[key]}`)
    .join('\n')
);

spawn('docker-compose', ['up'], {
  shell: true,
  stdio: 'inherit',
  env: {
    ...process.env,
    ...envVariables,
  },
});
