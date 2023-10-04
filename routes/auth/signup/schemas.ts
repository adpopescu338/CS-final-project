import * as yup from 'yup';
import { User } from '@prisma/client';

export type ReqPayload = {
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

export type Result = {
  message: string;
  data: Pick<User, 'id' | 'email' | 'name' | 'createdAt'>;
};
