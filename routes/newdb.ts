import { Response } from 'express';
import { AuthedRequest, DBMS } from 'libs/types';
import { mongoManager, mysqlManager, postgresManager } from '../databases';
import * as yup from 'yup';
import { asyncHandler, validate } from 'libs/middleware';
import { v4 as uuid } from 'uuid';
import { client } from 'prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes, MAX_DATABASES_PER_USER, MAX_DATABASES_ACC_SIZE } from 'libs/constants';
import { getAvailableService, deploy } from 'libs/k8';
import { Pod } from '@prisma/client';
import { sendDbCreatedEmail } from 'libs/emails';
import { encrypt } from 'libs/utils';

const revert = async (
  dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager,
  username: string,
  database: string,
  host: string
) => {
  await Promise.all([
    dbManager.deleteUser(username, { host }),
    dbManager.deleteDatabase(database, { host }),
  ]);
};

const getPodDetails = async (dbType: DBMS): Promise<Pod> => {
  const availableService = await getAvailableService(dbType);

  if (availableService) {
    const podDetails = await client.pod.findUnique({
      where: {
        deploymentName: availableService.deploymentName,
      },
    });

    if (!podDetails) throw new BeError('Pod not found', ErrorCodes.InternalServerError);
    return podDetails;
  }

  const newDeploymentDetails = await deploy(dbType);

  return newDeploymentDetails;
};

const createDbAndUser =
  (dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager, dbType: DBMS) =>
  async (req: AuthedRequest, res: Response) => {
    const { name, email, id } = req.user;
    const { database } = req.body as ReqPayload['body'];

    const newUser = {
      username: `${name}_${email}`,
      password: uuid().slice(0, 8),
      database: `${name}_${database}_${uuid().slice(0, 8)}`,
    };

    const pod = await getPodDetails(dbType);

    const internalConnectionDetails = {
      host: pod.internalAddress,
    };

    const userConnectionDetails = await dbManager.createDbAndUser(
      newUser,
      internalConnectionDetails
    );

    const success = await dbManager.checkUserCreation({
      user: userConnectionDetails.username,
      password: userConnectionDetails.password,
      database: userConnectionDetails.database,
      host: userConnectionDetails.host,
    });

    if (!success) {
      await revert(
        dbManager,
        newUser.username,
        newUser.database,

        internalConnectionDetails.host
      );
      return res.status(500).send({
        message: 'Failed to create user and database',
      });
    }

    const { id: databaseId } = await client.database.create({
      data: {
        type: dbType,
        name: newUser.database,
        encryptedPassword: encrypt(userConnectionDetails.password),
        encryptedConnectionUrl: encrypt(userConnectionDetails.connectionUrl),
        encryptedUsername: encrypt(userConnectionDetails.username),
        pod: {
          connect: {
            id: pod.id,
          },
        },
        user: {
          connect: {
            id,
          },
        },
      },
      select: { id: true },
    });

    if (pod.publicIp) {
      await sendDbCreatedEmail({
        to: email,
        database: userConnectionDetails.database,
        dbms: dbType,
        host: pod.publicIp,
        username: userConnectionDetails.username,
        password: userConnectionDetails.password,
        port: userConnectionDetails.port,
        connectionString: userConnectionDetails.connectionUrl,
      });
    } else {
      await client.scheduledEmail.create({
        data: {
          to: email,
          podId: pod.id,
          databaseId,
        },
      });
    }

    res.status(200).send({
      message: 'User created successfully. You will receive an email with your credentials shortly',
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
  const { type } = req.params as ReqPayload['params'];
  const { user } = req;

  await checkIfUserCanCreateDb(user.id);

  if (type === DBMS.mongodb) return createDbAndUser(mongoManager, type)(req, res);
  if (type === DBMS.mysql) return createDbAndUser(mysqlManager, type)(req, res);
  if (type === DBMS.postgresql) return createDbAndUser(postgresManager, type)(req, res);
};

type ReqPayload = {
  body: {
    database: string;
  };
  params: {
    type: DBMS;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    database: yup.string().required(),
  }),
  params: yup.object().shape({
    type: yup.mixed<DBMS>().oneOf(Object.values(DBMS)).required(),
  }),
});

export const validateReq = validate(schema);
export const handler = asyncHandler(main);
