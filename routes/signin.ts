import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { asyncHandler } from 'libs/middleware';
import { SessionUser } from 'libs/types';
import jwt from 'jsonwebtoken';

export const schema = yup.object().shape({
  body: yup.object().shape({
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

const getUserFromDb = async (email: string, password: string) => {
  return {
    id: '1',
    email,
    name: '',
    password,
  };
};

export const main = async (req: Request, res: Response) => {
  const { password, email } = req.body;

  // TODO: Perform actual db lookup here
  const user = await getUserFromDb(email, password);

  if (!user) throw new BeError('User not found', ErrorCodes.NotFound);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1d',
    }
  );

  res.cookie('authorization', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });

  res.status(200).send({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    } as SessionUser,
  });
};

export const handler = asyncHandler(main);
