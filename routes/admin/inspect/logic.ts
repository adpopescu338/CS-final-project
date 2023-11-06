import { Response } from 'express';
import { AuthedRequest, DBMS } from 'libs/types';
import { client } from 'prisma/client';
import { ReqPayload } from './schemas';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { decrypt } from 'libs/utils';

export const logic = async (req: AuthedRequest, res: Response) => {
  const { id } = req.params as ReqPayload['params'];
  const db = await client.database.findUnique({
    where: {
      id,
    },
    include: {
      pod: true,
    },
  });

  if (!db) {
    throw new BeError('Database not found', ErrorCodes.NotFound);
  }

  if (!db.pod.publicIp) {
    throw new BeError('Database is not ready yet', ErrorCodes.NotFound);
  }

  const url = new URLSearchParams({
    [getAdminerDriver(db.type)]: '',
    server: db.pod.publicIp,
    username: decrypt(db.encryptedUsername),
    db: db.name,
  });

  res.redirect('/admin?' + url.toString());
};

const getAdminerDriver = (db: DBMS) => {
  switch (db) {
    case DBMS.postgresql:
      return 'pgsql';
    case DBMS.mysql:
      return 'server';
    case DBMS.mongodb:
      return 'mongo';
    default:
      throw new BeError('Invalid DBMS', ErrorCodes.InternalServerError);
  }
};
