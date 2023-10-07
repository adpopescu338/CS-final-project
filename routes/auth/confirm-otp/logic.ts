import { Request, Response } from 'express';
import { BeError } from 'libs/BeError';
import { ErrorCodes } from 'libs/constants';
import { client } from 'prisma/client';
import { ReqPayload, Result } from './schemas';

export const logic = async (req: Request, res: Response) => {
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

  const result: Result = {
    message: 'OTP verified successfully',
  };

  res.status(200).send(result);
};
