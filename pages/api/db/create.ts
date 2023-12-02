import { AuthedRequest } from 'lib/types/AuthedRequest';
import { mongoManager, mysqlManager, postgresManager } from 'databases';
import { v4 as uuid } from 'uuid';
import { client } from 'prisma/client';
import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import { sendDbCreatedEmail } from 'lib/emails';
import { encrypt } from 'lib/utils';
import { checkIfUserCanCreateDb, revert } from 'lib/db-utils';
import { getDbManager } from 'lib/utils/getDbManager';
import { UserCreatedDetails } from 'databases/DBManager';
import { DBMS } from '@prisma/client';
import { NextAuthUser } from 'lib/next-auth';
import * as yup from 'yup';
import { apiHandler } from 'lib/middleware';
import { NextApiResponse } from 'next';
import { getDatabaseHost } from 'lib/getDatabaseHost';

export type ReqPayload = {
  body: {
    databaseName: string;
    type: DBMS;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object({
  body: yup.object({
    databaseName: yup.string().required(),
    type: yup.mixed<DBMS>().oneOf(Object.values(DBMS)).required(),
  }),
});

export type Result = {
  success: true;
  message: string;
};

const createDbAndUser = async (
  dbManager: typeof mongoManager | typeof mysqlManager | typeof postgresManager,
  dbType: DBMS,
  user: NextAuthUser,
  body: ReqPayload['body']
) => {
  const { name, email, id } = user;
  const { databaseName } = body;

  const newUser = {
    username: email
      .replaceAll('@', '_')
      .replaceAll('.', '_')
      .replaceAll('+', '_')
      .replaceAll('-', '_'),
    password: uuid().slice(0, 8),
    database: `${name}_${databaseName}_${uuid().slice(0, 8)}`,
  };

  const internalConnectionDetails = {
    host: getDatabaseHost(dbType),
  };

  let userConnectionDetails: UserCreatedDetails;
  try {
    userConnectionDetails = await dbManager.createDbAndUser(newUser, internalConnectionDetails);
    console.log('user created successfully', userConnectionDetails);

    const success = await dbManager.checkUserCreation({
      user: userConnectionDetails.username,
      password: userConnectionDetails.password,
      database: userConnectionDetails.database,
      // userConnectionDetails.host will be the public URL
      // we should use the internal network
      // so only the connection with username and password will be verified
      host: internalConnectionDetails.host, 
    });
    if (!success) throw new Error('User creation failed');
  } catch (error) {
    console.log('user creation failed: ', error.message);
    console.log('reverting changes');
    await revert(
      dbManager,
      newUser.username,
      newUser.database,

      internalConnectionDetails.host
    );
    throw new BeError('Failed to create user and database', ErrorCodes.InternalServerError);
  }

  await client.database.create({
    data: {
      status: 'Active',
      type: dbType,
      name: newUser.database,
      encryptedPassword: encrypt(userConnectionDetails.password),
      encryptedConnectionUrl: encrypt(userConnectionDetails.connectionUrl),
      encryptedUsername: encrypt(userConnectionDetails.username),
      user: {
        connect: {
          id,
        },
      },
    },
    select: { id: true },
  });

  await sendDbCreatedEmail({
    to: email,
    database: userConnectionDetails.database,
    dbms: dbType,
    host: process.env.PUBLIC_URL as string,
    username: userConnectionDetails.username,
    password: userConnectionDetails.password,
    port: userConnectionDetails.port,
    connectionString: userConnectionDetails.connectionUrl,
  });
};

export const logic = async (req: AuthedRequest, res: NextApiResponse) => {
  const { type } = req.body as ReqPayload['body'];
  const { user } = req;

  await checkIfUserCanCreateDb(user.id, type);
  const dbManager = getDbManager(type);

  await createDbAndUser(dbManager, type, user, req.body);

  const result: Result = {
    success: true,
    message: 'User created successfully. You will receive an email with your credentials shortly',
  };

  res.status(200).send(result);
};

export default apiHandler(true, schema).post(logic);
