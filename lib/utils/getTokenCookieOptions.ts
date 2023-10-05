import { CookieOptions } from 'express';
import { TOKEN_EXPIRE_IN } from 'libs/constants';

export const getTokenCookieOptions = (options?: CookieOptions) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: new Date(Date.now() + TOKEN_EXPIRE_IN),
  ...options,
});
