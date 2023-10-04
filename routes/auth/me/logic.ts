import { Request, Response } from 'express';
import { Result } from './schemas';
import { extractUserFromCookies } from 'libs/middleware/auth';
import { SessionUser } from 'libs/types';

export const logic = (req: Request, res: Response) => {
  let user: SessionUser | null = null;

  try {
    const extractedUser = extractUserFromCookies(req);
    if (!extractedUser) throw new Error('Unauthenticated');
    user = extractedUser as SessionUser;
  } catch (err) {
    const result: Result = {
      message: 'Unauthenticated',
      data: null,
      status: 'unauthenticated',
    };

    return res.send(result);
  }

  const result: Result = {
    message: 'Authenticated',
    data: user as SessionUser,
    status: 'authenticated',
  };

  return res.send(result);
};
