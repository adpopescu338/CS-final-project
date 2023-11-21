import nc from 'next-connect';
import { onErrorMiddleware } from './onErrorMiddleware';
import { validate } from './validate';
import { BeError } from '../BeError';
import { ErrorCodes } from '../constants';
import { Schema } from 'yup';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export const apiHandler = (authed?: boolean, schema?: Schema) =>
  nc({
    onError: onErrorMiddleware,
  })
    .use(async (req: NextApiRequest, res: NextApiResponse, next) => {
      const session = await getServerSession(req, res, authOptions);

      // @ts-expect-error - save user to req to make it available in the next middleware
      if (session?.user) req.user = session.user;
      if (authed && !session?.user) {
        throw new BeError('Unauthorized', ErrorCodes.Unauthorized);
      }

      if (authed === false && session?.user) {
        throw new BeError('Forbidden', ErrorCodes.Forbidden);
      }

      return next();
    })
    .use(validate(schema));
