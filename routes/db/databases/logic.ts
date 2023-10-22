import { Response } from 'express';
import { AuthedRequest, DBMS } from 'libs/types';
import { client } from 'prisma/client';
import { select, Result } from './schemas';
import { DatabaseStatus } from '@prisma/client';

export const logic = async (req: AuthedRequest, res: Response) => {
  // const data = await client.database.findMany({
  //   where: {
  //     userId: req.user.id,
  //   },
  //   ...select,
  // });

  const data = [
    {
      name: 'my db 1',
      id: '1',
      type: DBMS.mongodb,
      createdAt: new Date('2023-10-14T21:33:16.671Z'),
      size: 200,
      status: DatabaseStatus.Active,
    },
    {
      name: 'my db 2',
      id: '2',
      type: DBMS.mysql,
      createdAt: new Date('2023-10-14T21:33:16.671Z'),
      size: 130,
      status: DatabaseStatus.Stopped,
    },
    {
      name: 'my db 3',
      id: '3',
      type: DBMS.postgresql,
      createdAt: new Date('2023-10-14T21:33:16.671Z'),
      size: 110,
      status: DatabaseStatus.Active,
    },
  ];

  const result: Result = {
    data,
  };

  res.status(200).json(result);
};
