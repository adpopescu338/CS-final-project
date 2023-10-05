import { Schema } from 'yup';

export type EndpointDetails = {
  logic: (req: any, res: any, next: any) => void;
  schema?: Schema;
  withAuth?: boolean;
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
};
