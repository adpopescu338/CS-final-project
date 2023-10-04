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
    otp: string;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    otp: yup.string().required(),
  }),
});

const main = async (req: Request, res: Response) => {
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).send({
    message: 'OTP verified successfully',
    data: {
      refreshToken,
      user: sessionUser,
    },
  });
};

export const validateReq = validate(schema);
export const handler = asyncHandler(main);
