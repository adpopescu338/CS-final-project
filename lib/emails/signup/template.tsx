import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';

export type SignUpProps = {
  name: string;
  otp: string;
};

const Signup = ({ name, otp }: SignUpProps) => {
  return (
    <Html lang="en">
      <h1>Hi {name}</h1>
      <h2>Here's your token: {otp}</h2>
    </Html>
  );
};

export const renderTemplate = (props: SignUpProps) => render(<Signup {...props} />);
