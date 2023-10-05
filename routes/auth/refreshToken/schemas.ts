import { SessionUser } from 'libs/types';
import * as yup from 'yup';

export type ReqPayload = {
  body: {
    refreshToken: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    refreshToken: yup.string().required(),
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

export const path = 'refresh-token';
