import { Request, Response } from 'express';
import { mongoManager, mysqlManager, postgresManager, DatabaseType } from '../databases';
import * as yup from 'yup';

const getNewUser = (body: any) =>
  ({
    username: body.username + Math.random().toString(36).substring(7),
    password: body.password,
    database: 'db_' + body.username + Math.random().toString(36).substring(7),
  } as any);

const createUser =
  (dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager) =>
  async (req: Request, res: Response) => {
    const newUser = getNewUser(req.body);

    const user = await dbManager.createDbAndUser({
      username: newUser.username,
      password: newUser.password,
      database: newUser.database,
    });
    console.log('user', user);
    const success = await dbManager.checkUserCreation({
      user: newUser.username,
      password: newUser.password,
      database: newUser.database,
    });

    if (success) return res.status(200).send(user);

    await Promise.all([
      dbManager.deleteUser(newUser.username),
      dbManager.deleteDatabase(newUser.database),
    ]);

    return res.status(500).send({
      message: 'Failed to create user',
    });
  };

export const handler = (req, res) => {
  const { type } = req.params;

  if (type === DatabaseType.mongo) return createUser(mongoManager)(req, res);
  if (type === DatabaseType.mysql) return createUser(mysqlManager)(req, res);
  if (type === DatabaseType.postgres) return createUser(postgresManager)(req, res);
};

export const schema: yup.Schema = yup.object().shape({
  body: yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  }),
  params: yup.object().shape({
    type: yup.string().required(),
  }),
});
