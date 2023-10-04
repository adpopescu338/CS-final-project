import sendgrid, { ResponseError } from '@sendgrid/mail';

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};
export const sendMail = (args: SendEmailArgs): Promise<void> => {
  if (process.env.DISABLE_EMAILS === 'true') {
    console.log('Emails disabled, not sending');
    return Promise.resolve();
  }
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

  return new Promise((resolve, reject) => {
    sendgrid.send(
      {
        from: process.env.SENDGRID_FROM_EMAIL as string,
        ...args,
      },
      false,
      (err) => {
        if (err) {
          if (err instanceof ResponseError) {
            console.log(
              JSON.stringify(
                {
                  body: err.response.body,
                  headers: err.response.headers,
                },
                null,
                2
              )
            );
          } else {
            console.log(err);
          }

          reject(err);
        } else {
          resolve(undefined);
        }
      }
    );
  });
};
