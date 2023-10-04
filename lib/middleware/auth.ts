import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { SessionUser } from 'libs/types';

export const extractUserFromCookies = (req: Request): SessionUser | null => {
  const token = req.cookies.token;
  if (!token) return null;

  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  return payload as SessionUser;
};

export const auth = (req, res, next) => {
  try {
    req.user = extractUserFromCookies(req);
    return next();
  } catch (err) {
    throw new BeError('You are not logged in', ErrorCodes.Unauthorized);
  }
};
