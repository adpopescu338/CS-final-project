import { Request, Response } from 'express';
import { BeError } from 'libs/BeError';
import { ErrorCodes, REFRESH_TOKEN_EXPIRE_IN } from 'libs/constants';

import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import { ReqPayload, Result } from './schemas';
import { getTokenCookieOptions } from 'libs/utils';

export const logic = async (req: Request, res: Response) => {
  const { otp } = req.body as ReqPayload['body'];

  const user = await client.user.findUnique({
    where: {
      otp,
    },
  });

  if (!user) throw new BeError('Invalid OTP', ErrorCodes.NotFound);

  await client.user.update({
    where: {
      id: user.id,
    },
    data: {
      otp: null,
      emailVerified: true,
    },
  });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(sessionUser, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  const { id: refreshToken } = await client.refreshToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      // 7 days
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_IN),
    },
  });

  res.cookie('authorization', token, getTokenCookieOptions());

  const result: Result = {
    message: 'OTP verified successfully',
    data: {
      refreshToken,
      user: sessionUser,
    },
  };

  res.status(200).send(result);
};
