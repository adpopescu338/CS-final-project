import { renderSignup } from './template';
import { sendMail } from '../sendMail';

type SendEmailArgs = {
  to: string;
  name: string;
};

export const sendSignupEmail = async ({ to, name }: SendEmailArgs): Promise<void> => {
  const html = renderSignup({ name });
  console.log('html', html);
  return sendMail({
    to,
    subject: 'Welcome to the app!',
    html,
  });
};
