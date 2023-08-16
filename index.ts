import { config } from 'dotenv';
import { mongoManager, mysqlManager, postgresManager, DatabaseType } from './databases';
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
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match any routes above, send back the React index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const newDatabase = 'test';

const createUser =
  (dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager) =>
  async (req, res) => {
    const newUser = req.body;
    const user = await dbManager.createDbAndUser({
      username: newUser.username,
      password: newUser.password,
      database: newDatabase,
    });

    const success = await dbManager.checkUserCreation({
      user: newUser.username,
      password: newUser.password,
      database: newDatabase,
    });

    if (success) return res.status(200).send(user);

    await Promise.all([
      dbManager.deleteUser(newUser.username),
      dbManager.deleteDatabase(newDatabase),
    ]);

    return res.status(500).send({
      message: 'Failed to create user',
    });
  };

app.post('/newdb/:type', (req, res) => {
  const { type } = req.params;

  if (type === DatabaseType.mongo) return createUser(mongoManager)(req, res);
  if (type === DatabaseType.mysql) return createUser(mysqlManager)(req, res);
  if (type === DatabaseType.postgres) return createUser(postgresManager)(req, res);

  return res.status(400).send({
    message: `Invalid database type "${type}"`,
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001!');
});
