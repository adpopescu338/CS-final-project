import { AuthedRequest } from 'lib/types/AuthedRequest';
import { client } from 'prisma/client';
import { DatabaseStatus } from '@prisma/client';
import { NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { apiHandler } from 'lib/middleware';

export const select = Prisma.validator<Prisma.DatabaseFindManyArgs>()({
  select: {
    name: true,
    id: true,
    type: true,
    createdAt: true,
    size: true,
    status: true,
  },
});

export type Result = {
  success: true;
  data: Prisma.DatabaseGetPayload<typeof select>[];
};

/**
 * List databases
 */
export const logic = async (req: AuthedRequest, res: NextApiResponse) => {
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
    success: true,
    data,
  };

  res.status(200).json(result);
};

export default apiHandler(true).get(logic);
