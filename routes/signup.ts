import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { asyncHandler } from 'libs/middleware';
import { client } from 'prisma/client';
import { hashPassword } from 'libs/utils';
import { v4 as uuid } from 'uuid';

type ReqPayload = {
  body: {
    name: string;
    password: string;
    email: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().required(),
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

export const main = async (req: Request, res: Response) => {
  const { name, password, email } = req.body as ReqPayload['body'];

  // check if user already exists
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (user)
    throw new BeError('User with this email already exists', ErrorCodes.ResourceAlreadyExists);

  // create user
  const newUser = await client.user.create({
    data: {
      name,
      password: await hashPassword(password),
      email,
      otp: uuid(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      otp: process.env.NODE_ENV === 'development',
    },
  });

  res.status(201).send({
    message: 'User created successfully',
    data: newUser,
  });
};

export const handler = asyncHandler(main);
