import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { asyncHandler } from 'libs/middleware';
import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import bcrypt from 'bcryptjs';

type ReqPayload = {
  body: {
    otp: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    otp: yup.string().required(),
  }),
});

export const main = async (req: Request, res: Response) => {
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

  // TODO: generate refresh token
  const refreshToken = '';

  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).send({
    message: 'OTP verified successfully',
    refreshToken,
    user: sessionUser,
  });
};

export const handler = asyncHandler(main);
