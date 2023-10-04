import { Request, Response } from 'express';
import { BeError } from 'libs/BeError';
import { ErrorCodes, REFRESH_TOKEN_EXPIRE_IN, TOKEN_EXPIRE_IN } from 'libs/constants';

import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import { ReqPayload, Result } from './schemas';

const getUserFromDbByToken = async (refreshToken: string) => {
  const token = await client.refreshToken.findUnique({
    where: {
      id: refreshToken,
    },
    include: {
      user: true,
    },
  });

  if (!token) throw new BeError('Invalid refresh token', ErrorCodes.Unauthorized);

  if (new Date() > token?.expiresAt)
    throw new BeError('Invalid refresh token', ErrorCodes.Unauthorized);

  return token.user;
};

export const logic = async (req: Request, res: Response) => {
  const { refreshToken } = req.body as ReqPayload['body'];

  const user = await getUserFromDbByToken(refreshToken);

  await client.refreshToken.delete({
    where: {
      id: refreshToken,
    },
  });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(sessionUser, process.env.JWT_SECRET as string, {
    expiresIn: `${TOKEN_EXPIRE_IN / 1000}s`,
  });

  const { id: newRefreshToken, expiresAt } = await client.refreshToken.create({
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

  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: TOKEN_EXPIRE_IN,
  });

  const result: Result = {
    message: 'User logged in successfully',
    data: {
      refreshToken: newRefreshToken,
      user: sessionUser,
      expiresAt,
    },
  };

  res.status(200).send(result);
};
