import nc from 'next-connect';
import { onErrorMiddleware } from './onErrorMiddleware';
import { validate } from './validate';
import { getServerSession } from 'next-auth';
import { BeError } from '../BeError';
import { ErrorCodes } from '../constants';
import { Schema } from 'yup';

export const apiHandler = (authed?: boolean, schema?: Schema) =>
  nc({
    onError: onErrorMiddleware,
  })
    .use(async (req, res, next) => {
      const user = await getServerSession(req);
      // @ts-expect-error - save user to req to make it available in the next middleware
      if (user) req.user = user;

      if (authed && !user) {
        throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
      }

      if (authed === false && user) {
        throw new BeError('Forbidden', ErrorCodes.Forbidden);
      }

      return next();
    })
    .use(validate(schema));
