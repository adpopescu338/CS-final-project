import { Prisma } from '@prisma/client';

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
  data: Prisma.DatabaseGetPayload<typeof select>[];
};

export const path = 'dabases';
