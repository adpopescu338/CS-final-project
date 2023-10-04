import { DBMS } from '@prisma/client';
import * as yup from 'yup';

export type ReqPayload = {
  body: {
    databaseName: string;
  };
  params: {
    type: DBMS;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  body: yup.object().shape({
    databaseName: yup.string().required(),
  }),
  params: yup.object().shape({
    type: yup.mixed<DBMS>().oneOf(Object.values(DBMS)).required(),
  }),
});

export type Result = {
  message: string;
};
