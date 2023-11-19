import { AuthedRequest } from 'lib/types/AuthedRequest';
import { client } from 'prisma/client';
import { DatabaseStatus } from '@prisma/client';
import { getDbManager, decrypt } from 'lib/utils';
import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import { NextApiResponse } from 'next';
import * as yup from 'yup';
import { getServiceInternalAddress } from 'lib/getServiceInternalAddress';

export type Result = {
  success: true;
  message: string;
};

export type ReqPayload = {
  query: {
    id: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object({
  query: yup.object({
    id: yup.string().required(),
  }),
});

export const logic = async (req: AuthedRequest, res: NextApiResponse) => {
  const { id } = req.query as ReqPayload['query'];
  const db = await client.database.findUnique({
    where: {
      id,
    },
  });

  if (!db) {
    throw new BeError('Database not found', ErrorCodes.NotFound);
  }

  const dbManager = getDbManager(db.type);

  const connectionDetails = {
    host: getServiceInternalAddress(db.type),
  };

  await dbManager.deleteDatabase(db.name, connectionDetails);
  await dbManager.deleteUser(decrypt(db.encryptedUsername), connectionDetails);
  await client.database.update({
    where: {
      id,
    },
    data: {
      status: DatabaseStatus.Deleted,
    },
  });

  const result: Result = {
    success: true,
    message: 'Database deleted successfully',
  };

  res.status(200).json(result);
};
