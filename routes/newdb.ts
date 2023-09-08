import { Response } from 'express';
import { AuthedRequest } from 'libs/types';
import { mongoManager, mysqlManager, postgresManager, DatabaseType } from '../databases';
import * as yup from 'yup';
import { asyncHandler, validate } from 'libs/middleware';
import { v4 as uuid } from 'uuid';
import { client } from 'prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes, MAX_DATABASES_PER_USER, MAX_DATABASES_ACC_SIZE } from 'libs/constants';

const createDbAndUser =
  (dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager) =>
  async (req: AuthedRequest, res: Response) => {
    const { name, email, id } = req.user;
    const { database } = req.body;

    const newUser = {
      username: `${name}_${email}`,
      password: uuid().slice(0, 8),
      database: `${name}_${database}_${uuid().slice(0, 8)}`,
    };

    const dbDetails = await dbManager.createDbAndUser(newUser);

    const success = await dbManager.checkUserCreation({
      user: newUser.username,
      password: newUser.password,
      database: newUser.database,
    });

    if (success) {
      await client.database.create({
        data: {
          name: newUser.database,
          userId: id,
        },
      });
      return res.status(200).send({
        message: 'User created successfully',
        data: dbDetails,
      });
    }

    await Promise.all([
      dbManager.deleteUser(newUser.username),
      dbManager.deleteDatabase(newUser.database),
    ]);

    return res.status(500).send({
      message: 'Failed to create user',
    });
  };

const checkIfUserCanCreateDb = async (userId: string) => {
  const databases = await client.database.findMany({
    where: {
      userId,
    },
  });

  if (!databases?.length) return;

  if (databases.length > MAX_DATABASES_PER_USER)
    throw new BeError('You have reached the maximum number of databases', ErrorCodes.Forbidden);

  const accumulatedSize = databases.reduce((acc, curr) => acc + curr.size, 0);

  if (accumulatedSize >= MAX_DATABASES_ACC_SIZE)
    throw new BeError(
      `You have reached the maximum size of ${MAX_DATABASES_ACC_SIZE} MB`,
      ErrorCodes.Forbidden
    );
};

const main = async (req: AuthedRequest, res: Response) => {
  const { type } = req.params;
  const { user } = req;

  await checkIfUserCanCreateDb(user.id);

  if (type === DatabaseType.mongo) return createDbAndUser(mongoManager)(req, res);
  if (type === DatabaseType.mysql) return createDbAndUser(mysqlManager)(req, res);
  if (type === DatabaseType.postgres) return createDbAndUser(postgresManager)(req, res);
};

const schema: yup.Schema = yup.object().shape({
  body: yup.object().shape({
    database: yup.string().required(),
  }),
  params: yup.object().shape({
    type: yup.string().required(),
  }),
});

export const validateReq = validate(schema);
export const handler = asyncHandler(main);
