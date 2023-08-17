import { config } from 'dotenv';
import { router } from './routes';
import express from 'express';
import cors from 'cors';
import path from 'path';

config();

const app = express();
app.use(cors());

app.get('/hello', (req, res) => {
  res.send({
    message: 'Hello Worlds!',
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './client/build')));

// The "catchall" handler: for any request that doesn't match any routes above, send back the React index.html file.
app.get('*', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.use('/api', router);

const PORT = (process.env.PORT && Number(process.env.PORT)) || 3000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
