import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { SessionUser } from 'libs/types';

export const extractUserFromCookies = (req: Request): SessionUser | null => {
  const token = req.cookies.token;

  if (!token) return null;

  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  console.log('verified jwt payload ====== ', payload);
  return payload as SessionUser;
};

export const auth = (req, res, next) => {
  // check if there's a valid token in the request

  const token = req.headers.authorization;

  if (!token) {
    throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
  }

  // check if the token is valid
  try {
    req.user = extractUserFromCookies(req);
    return next();
  } catch (err) {
    throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
  }
};
