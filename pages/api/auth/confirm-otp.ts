import { BeError } from 'lib/BeError';
import { ErrorCodes } from 'lib/constants';
import { client } from 'prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'lib/middleware';
import * as yup from 'yup';

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

export type Result = {
  success: boolean;
  data: {
    message: string;
  };
};

const logic = async (req: NextApiRequest, res: NextApiResponse) => {
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
    success: true,
    data: {
      message: 'OTP verified successfully',
    },
  };

  res.status(200).send(result);
};

export default apiHandler(false, schema).post(logic);
