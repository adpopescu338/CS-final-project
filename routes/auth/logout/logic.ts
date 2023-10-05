import { Request, Response } from 'express';
import { getTokenCookieOptions } from 'libs/utils';

export const logic = async (req: Request, res: Response) => {
  // remove cookie
  const cookieOptions = getTokenCookieOptions({
    maxAge: 0,
    expires: new Date(Date.now()),
  });
  res.clearCookie('token', cookieOptions);
  res.cookie('token', '', cookieOptions);

  // TODO: delete refresh token from db

  res.status(200).json({ success: true });
};
