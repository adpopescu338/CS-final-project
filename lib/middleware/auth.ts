import jwt from 'jsonwebtoken';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';

export const auth = (req, res, next) => {
  // check if there's a valid token in the request

  const token = req.headers.authorization;

  if (!token) {
    throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
  }

  // check if the token is valid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload;
    return next();
  } catch (err) {
    throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
  }
};
