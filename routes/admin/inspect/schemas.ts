import * as yup from 'yup';

export type ReqPayload = {
  params: {
    id: string;
  };
};

export const schema: yup.Schema<ReqPayload> = yup.object().shape({
  params: yup.object().shape({
    id: yup.string().required(),
  }),
});

export const path = 'admin/inspect/:id';
export const method = 'get';
