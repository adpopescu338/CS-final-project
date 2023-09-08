import { renderSignup } from './template';
import { sendMail } from '../sendMail';

type SendEmailArgs = {
  to: string;
  name: string;
  otp: string;
};

export const sendSignupEmail = async ({ to, name, otp }: SendEmailArgs): Promise<void> => {
  const html = renderSignup({ name, otp });
  console.log('html', html);
  return sendMail({
    to,
    subject: 'Welcome to the app!',
    html,
  });
};
