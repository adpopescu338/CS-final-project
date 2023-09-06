import { Request, Response } from 'express';
import * as yup from 'yup';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { asyncHandler } from 'libs/middleware';

export const schema = yup.object().shape({
  body: yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

export const main = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  console.log({
    username,
    password,
    email,
  });

  throw new BeError('Not implemented', ErrorCodes.InternalServerError);
};

export const handler = asyncHandler(main);
