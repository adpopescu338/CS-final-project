import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';

import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import { asyncHandler, validate } from 'libs/middleware';

type ReqPayload = {
  body: {
    refreshToken: string;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    refreshToken: yup.string().required(),
  }),
});

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

const main = async (req: Request, res: Response) => {
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
    expiresIn: '1d',
  });

  const { id: newRefreshToken } = await client.refreshToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      // 7 days
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).send({
    message: 'User logged in successfully',
    data: {
      refreshToken: newRefreshToken,
      user: sessionUser,
    },
  });
};

export const validateReq = validate(schema);
export const handler = asyncHandler(main);
