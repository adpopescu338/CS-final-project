import { DBMS } from '@prisma/client';

export const ApiRoutes = {
  hello: '/api/hello',
  signin: '/api/signin',
  signup: '/api/signup',
  confirmOtp: '/api/confirm-otp',
  refreshToken: '/api/refresh-token',
  newdb: (db: DBMS) => `/api/newdb/${db}`,
};
