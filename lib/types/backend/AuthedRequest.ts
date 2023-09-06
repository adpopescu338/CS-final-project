import { Request } from 'express';
import { SessionUser } from '../shared/SessionUser';

export type AuthedRequest<
  Query = unknown,
  Params extends { [k: string]: string } = {},
  Body = unknown
> = Request & {
  user: SessionUser;
  query: Query;
  params: Params;
  body: Body;
};
