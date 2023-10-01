import { DbCreatedProps, renderTemplate } from './template';
import { sendMail } from '../sendMail';

type SendDbCreatedEmailArgs = {
  to: string;
} & DbCreatedProps;

export const sendDbCreatedEmail = async ({
  to,
  ...props
}: SendDbCreatedEmailArgs): Promise<void> => {
  const html = renderTemplate(props);

  return sendMail({
    to,
    subject: 'Database created',
    html,
  });
};
