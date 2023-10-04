import { SessionUser } from 'libs/types/shared/SessionUser';

export type ClientSession =
  | {
      status: 'unauthenticated' | 'loading';
      user: null;
    }
  | {
      status: 'authenticated';
      user: SessionUser;
    };
