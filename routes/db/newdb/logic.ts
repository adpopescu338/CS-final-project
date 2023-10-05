import { Response } from 'express';
import { AuthedRequest, DBMS, SessionUser } from 'libs/types';
import { mongoManager, mysqlManager, postgresManager } from 'databases';
import { v4 as uuid } from 'uuid';
import { client } from 'prisma/client';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';

import { sendDbCreatedEmail } from 'libs/emails';
import { encrypt } from 'libs/utils';
import { ReqPayload, Result } from './schemas';
import { checkIfUserCanCreateDb, getPodDetails, revert } from './utils';
import { getDbManager } from 'libs/utils/getDbManager';

const createDbAndUser = async (
  dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager,
  dbType: DBMS,
  user: SessionUser,
  body: ReqPayload['body'],
  shouldCreateUser: boolean
) => {
  const { name, email, id } = user;
  const { databaseName } = body;

  const newUser = {
    username: email.replace('@', '_').replace('.', '_'),
    password: uuid().slice(0, 8),
    database: `${name}_${databaseName}_${uuid().slice(0, 8)}`,
  };

  const { pod, isNew } = await getPodDetails(dbType);

  const internalConnectionDetails = {
    host: pod.internalAddress,
  };

  const userConnectionDetails =
    shouldCreateUser || isNew
      ? await dbManager.createDbAndUser(newUser, internalConnectionDetails)
      : await dbManager.createDbForExistingUser(newUser, internalConnectionDetails);

  console.log('user created successfully', userConnectionDetails);

  const success = await dbManager.checkUserCreation({
    user: userConnectionDetails.username,
    password: userConnectionDetails.password,
    database: userConnectionDetails.database,
    host: userConnectionDetails.host,
  });

  if (!success) {
    console.log('user creation failed: unable to connect. Reverting');
    await revert(
      dbManager,
      newUser.username,
      newUser.database,

      internalConnectionDetails.host
    );
    throw new BeError('Failed to create user and database', ErrorCodes.InternalServerError);
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
};

export const logic = async (req: AuthedRequest, res: Response) => {
  const { type } = req.params as ReqPayload['params'];
  const { user } = req;

  const { shouldCreateUser } = await checkIfUserCanCreateDb(user.id);
  const dbManager = getDbManager(type);

  await createDbAndUser(dbManager, type, user, req.body, shouldCreateUser);

  const result: Result = {
    message: 'User created successfully. You will receive an email with your credentials shortly',
  };

  res.status(200).send(result);
};
