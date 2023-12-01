import { signIn } from 'next-auth/react';

export const signin = (email: string, password: string) => {
  return signIn('credentials', {
    redirect: true,
    callbackUrl: `${process.env.PUBLIC_URL}/dashboard`,
    username: email,
    password: password,
  });
};
