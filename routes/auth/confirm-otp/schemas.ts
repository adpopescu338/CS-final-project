import { SessionUser } from 'libs/types';
import * as yup from 'yup';

export type ReqPayload = {
  body: {
    otp: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    otp: yup.string().required(),
  }),
});

export type Result = {
  message: string;
  data: {
    refreshToken: string;
    user: SessionUser;
  };
};

export const path = 'confirm-otp';
