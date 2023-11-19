import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import { client } from 'prisma/client';
import { hashPassword } from 'lib/utils';
import { v4 as uuid } from 'uuid';
import { sendSignupEmail } from 'lib/emails';
import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import { User } from '@prisma/client';

export type ReqPayload = {
  body: {
    name: string;
    password: string;
    email: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object({
  body: yup.object({
    name: yup.string().required(),
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

export type Result = {
  success: true;
  message: string;
  data: Pick<User, 'id' | 'email' | 'name' | 'createdAt'>;
};

export const logic = async (req: NextApiRequest, res: NextApiResponse) => {
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
    success: true,
    message: 'User created successfully. Please verify your email',
    data: newUser,
  };

  res.status(201).send(result);
};
