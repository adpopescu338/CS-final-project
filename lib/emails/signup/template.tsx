import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';

export type TemplateProps = {
  name: string;
  otp: string;
};

const Template = ({ name, otp }: TemplateProps) => {
  return (
    <Html lang="en">
      <h1>Hi {name}</h1>
      <h2>Here&apos;s your token: {otp}</h2>
    </Html>
  );
};

export const renderTemplate = (props: TemplateProps) => render(<Template {...props} />);
