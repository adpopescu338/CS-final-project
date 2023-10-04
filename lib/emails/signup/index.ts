import { renderTemplate } from './template';
import { sendMail } from '../sendMail';

type SendEmailArgs = {
  to: string;
  name: string;
  otp: string;
};

export const sendSignupEmail = async ({ to, name, otp }: SendEmailArgs): Promise<void> => {
  const html = renderTemplate({ name, otp });

  return sendMail({
    to,
    subject: 'Welcome to the app!',
    html,
  });
};
