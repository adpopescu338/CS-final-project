import { Request, Response } from 'express';
import { BeError } from 'libs/BeError';
import { ErrorCodes, REFRESH_TOKEN_EXPIRE_IN, TOKEN_EXPIRE_IN } from 'libs/constants';
import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';
import { client } from 'prisma/client';
import bcrypt from 'bcryptjs';
import { ReqPayload, Result } from './schemas';

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

export const logic = async (req: Request, res: Response) => {
  const { password, email } = req.body as ReqPayload['body'];

  const user = await getUserFromDb(email, password);

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(sessionUser, process.env.JWT_SECRET as string, {
    expiresIn: `${TOKEN_EXPIRE_IN / 1000}s`,
  });

  const { id: refreshToken, expiresAt } = await client.refreshToken.create({
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

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + TOKEN_EXPIRE_IN),
  });

  const result: Result = {
    message: 'User logged in successfully',
    data: {
      refreshToken,
      user: sessionUser,
      expiresAt,
    },
  };

  res.status(200).send(result);
};
