import { AuthedRequest } from 'lib/types/AuthedRequest';
import { client } from 'prisma/client';
import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import { decrypt, getPort } from 'lib/utils';
import * as yup from 'yup';
import { DBMS } from '@prisma/client';
import { apiHandler } from 'lib/middleware';
import { NextApiResponse } from 'next';
import { getDatabaseHost } from 'lib/getDatabaseHost';

export type ReqPayload = {
  query: {
    id: string;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object().shape({
  query: yup.object().shape({
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

  const port = getPort(db.type);
  const server = getDatabaseHost(db.type, true) + ':' + port;

  const params = new URLSearchParams({
    [getAdminerDriver(db.type)]: server,
    username: decrypt(db.encryptedUsername),
    db: db.name,
  });

  const url = `/admin?` + params.toString();
  console.log('redirecting to', url);

  res.redirect(url);
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

export default apiHandler(true, schema).get(logic);
