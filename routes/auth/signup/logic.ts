import { Request, Response } from 'express';

import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { client } from 'prisma/client';
import { hashPassword } from 'libs/utils';
import { v4 as uuid } from 'uuid';
import { sendSignupEmail } from 'libs/emails';
import { ReqPayload, Result } from './schemas';

export const logic = async (req: Request, res: Response) => {
  const { name, password, email } = req.body as ReqPayload['body'];

  // check if user already exists
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });

  if (user)
    throw new BeError('User with this email already exists', ErrorCodes.ResourceAlreadyExists);

  const otp = uuid().slice(0, 6);
  // create user
  const newUser = await client.user.create({
    data: {
      name,
      password: await hashPassword(password),
      email,
      otp,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      otp: process.env.NODE_ENV === 'development',
    },
  });

  await sendSignupEmail({
    name: newUser.name,
    to: newUser.email,
    otp,
  });

  const result: Result = {
    message: 'User created successfully. Please verify your email',
    data: newUser,
  };

  res.status(201).send(result);
};
