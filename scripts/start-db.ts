import { config } from 'dotenv';
import { spawn } from 'child_process';
import { POSTGRES_PORT } from 'libs/constants';
config();

const { MONGO_PASSWORD, MONGO_USERNAME, MYSQL_PASSWORD, POSTGRES_PASSWORD } = process.env;

const doneFlag = 'Minikube done!';

const cmd = `
minikube start

kubectl create secret generic apps-secrets \
--from-literal=MONGO_PASSWORD=${MONGO_PASSWORD} \
--from-literal=MONGO_USERNAME=${MONGO_USERNAME} \
--from-literal=MYSQL_PASSWORD=${MYSQL_PASSWORD} \
--from-literal=POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

kubectl apply -f deployment/ingress-controller
kubectl apply -f deployment/permissions

echo "You can connect to postgres using: postgres://postgres:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}"

echo "${doneFlag}"

minikube tunnel
`;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const startDeployment = async () => {
  console.log('Starting deployment...');
  await wait(5000);
  const { deploy } = await import('libs/k8');
  await deploy('postgresql', 'main');
};

const child = spawn(cmd, { shell: true });
child.stdout.setEncoding('utf-8');
child.stderr.setEncoding('utf-8');

child.stdout.on('data', (data) => {
  console.log(data);
  if (data.includes(doneFlag)) {
    startDeployment();
  }
});

child.stderr.on('data', (e) => {
  throw new Error(e);
});
child.on('error', console.log);
