import nodemailer from 'nodemailer';

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = ({ to, subject, html }: SendEmailArgs) => {
  const user = process.env.EMAIL_ADDRESS;
  const pass = process.env.EMAIL_PASSWORD;
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: user,
      pass: pass,
    },
  });

  // Email options
  const mailOptions = {
    from: `Easydb <${user}>`, // sender address
    to,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(undefined);
      }
    });
  });
};
