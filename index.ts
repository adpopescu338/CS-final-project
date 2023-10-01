import { config } from 'dotenv';
import { router } from './routes';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { errorHandler } from './lib/middleware';
import { setDbPublicIpAddress } from './lib/k8/setDbPublicIpAddress';
import { checkMandatoryEnvVariables } from './lib/checkMandatoryEnvVariables';

config();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '.client-dist')));

// The "catchall" handler: for any request that doesn't match any routes above, send back the React index.html file.
app.get('*', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.sendFile(path.join(__dirname, './.client-dist/index.html'));
});

const PORT = (process.env.PORT && Number(process.env.PORT)) || 3000;

app.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  await setDbPublicIpAddress();
  try {
    checkMandatoryEnvVariables();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
