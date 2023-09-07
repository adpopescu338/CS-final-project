/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const client: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: getPrismaLogs(),
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = client;
}

export type LogLevel = 'info' | 'query' | 'warn' | 'error';

function getPrismaLogs(): LogLevel[] {
  switch (process.env.LOG_LEVEL) {
    case 'debug':
      return ['info', 'query', 'error', 'warn'];
    case 'info':
      return ['info', 'error', 'warn'];
    default:
      return ['error', 'warn'];
  }
}
