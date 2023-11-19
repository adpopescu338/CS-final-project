import { NextApiRequest } from 'next';
import { NextAuthUser } from '../next-auth';

export type AuthedRequest = NextApiRequest & {
  user: NextAuthUser;
};
