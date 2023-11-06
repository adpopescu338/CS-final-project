import { sendMail } from './sendMail';
import { EmailArgs } from './types';

export const buildSendMail = <TemplateProps>(
  renderTemplate: (args: TemplateProps) => string,
  subject: string
) => {
  return ({ to, ...props }: EmailArgs<TemplateProps>) => {
    const html = renderTemplate(props as TemplateProps);

    return sendMail({
      to,
      subject,
      html,
    });
  };
};
