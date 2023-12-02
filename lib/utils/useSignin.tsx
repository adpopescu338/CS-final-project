import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import swal from 'sweetalert';

export const useSignin = () => {
  const { push } = useRouter();

  return async (email: string, password: string) => {
    try {
      await signIn('credentials', {
        redirect: false,
        username: email,
        password: password,
      });
      push('/dashboard');
    } catch (err: any) {
      swal(err.message);
    }
  };
};
