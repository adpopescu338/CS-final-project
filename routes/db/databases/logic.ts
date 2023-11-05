import { Response } from 'express';
import { AuthedRequest } from 'libs/types';
import { client } from 'prisma/client';
import { select, Result } from './schemas';
import { DatabaseStatus } from '@prisma/client';

export const logic = async (req: AuthedRequest, res: Response) => {
  const data = await client.database.findMany({
    where: {
      userId: req.user.id,
      status: {
        not: DatabaseStatus.Deleted,
      },
    },
    ...select,
  });

  const result: Result = {
    data,
  };

  res.status(200).json(result);
};
