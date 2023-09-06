import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';

export type SignUpProps = {
  name: string;
};

const Signup = ({ name }: SignUpProps) => {
  return (
    <Html lang="en">
      <h1>Hi {name}</h1>
      <button>Click me</button>
    </Html>
  );
};

export const renderSignup = (props: SignUpProps) => render(<Signup {...props} />);
