import { SessionUser } from 'libs/types';

export type Result =
  | {
      message: string;
      data: SessionUser;
      status: 'authenticated';
    }
  | {
      message: string;
      data: null;
      status: 'unauthenticated';
    };

export const path = 'me';
