import { SessionUser } from 'libs/types';
import * as yup from 'yup';

export type ReqPayload = {
  body: {
    password: string;
    email: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    password: yup.string().required().min(8).matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/),
    email: yup.string().email().required(),
  }),
});

export type Result = {
  message: string;
  data: {
    refreshToken: string;
    user: SessionUser;
    expiresAt: Date;
  };
};
