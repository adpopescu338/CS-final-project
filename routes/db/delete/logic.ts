import { Response } from 'express';
import { AuthedRequest } from 'libs/types';
import { client } from 'prisma/client';
import { Result, ReqPayload } from './schemas';
import { DatabaseStatus } from '@prisma/client';
import { getDbManager, decrypt } from 'libs/utils';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';

export const logic = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as ReqPayload['params'];
  const db = await client.database.findUnique({
    where: {
      id,
    },
    include: {
      pod: {
        select: {
          internalAddress: true,
        },
      },
    },
  });

  if (!db) {
    throw new BeError('Database not found', ErrorCodes.NotFound);
  }

  const dbManager = getDbManager(db.type);

  const connectionDetails = {
    host: db.pod.internalAddress,
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
  };

  res.status(200).json(result);
};
