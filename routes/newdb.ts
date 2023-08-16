import { Request, Response } from 'express';
import { mongoManager, mysqlManager, postgresManager, DatabaseType } from '../databases';

const newDatabase = 'test';

const createUser =
  (dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager) =>
  async (req: Request, res: Response) => {
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

export const handleCreateUser = (req, res) => {
  const { type } = req.params;

  if (type === DatabaseType.mongo) return createUser(mongoManager)(req, res);
  if (type === DatabaseType.mysql) return createUser(mysqlManager)(req, res);
  if (type === DatabaseType.postgres) return createUser(postgresManager)(req, res);

  return res.status(400).send({
    message: `Invalid database type "${type}"`,
  });
};
