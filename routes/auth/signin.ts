import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { asyncHandler, validate } from 'libs/middleware';
import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import bcrypt from 'bcryptjs';

type ReqPayload = {
  body: {
    password: string;
    email: string;
  };
};

const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

const getUserFromDb = async (email: string, password: string) => {
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new BeError('User not found', ErrorCodes.NotFound);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new BeError('Invalid credentials', ErrorCodes.Unauthorized);

  if (!user.emailVerified) throw new BeError('Email not verified', ErrorCodes.Unauthorized);

  return user;
};

const main = async (req: Request, res: Response) => {
  const { password, email } = req.body as ReqPayload['body'];

  const user = await getUserFromDb(email, password);

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
    sameSite: 'none',
  });

  res.status(200).send({
    message: 'User logged in successfully',
    data: {
      refreshToken,
      user: sessionUser,
    },
  });
};

export const validateReq = validate(schema);
export const handler = asyncHandler(main);
