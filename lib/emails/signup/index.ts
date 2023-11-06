import { TemplateProps, renderTemplate } from './template';
import { buildSendMail } from '../buildSendMail';

export const sendEmail = buildSendMail<TemplateProps>(renderTemplate, 'Database created');
