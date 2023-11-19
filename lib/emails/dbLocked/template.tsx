import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';
import { DBMS } from '@prisma/client';

export type TemplateProps = {
  database: string;
  dbms: DBMS;
};

const Template = ({ database, dbms }: TemplateProps) => {
  return (
    <Html lang="en">
      <div>
        <h3>Database Locked</h3>
        <p>
          Your {dbms} database <strong>{database}</strong> reached the maximum space allowed.
          There&apos;s nothing we can do about it at the moment. In future you&apos;ll be able to upgrade your
          database to a bigger one, but that feature is not available yet.
        </p>
      </div>
    </Html>
  );
};

export const renderTemplate = (props: TemplateProps) => render(<Template {...props} />);
