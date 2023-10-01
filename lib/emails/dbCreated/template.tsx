import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';
import { DBMS } from '@prisma/client';

export type DbCreatedProps = {
  password: string;
  port: number;
  host: string;
  username: string;
  database: string;
  connectionString: string;
  dbms: DBMS;
};

const DbCreated = ({
  password,
  port,
  host,
  username,
  database,
  connectionString,
  dbms,
}: DbCreatedProps) => {
  return (
    <Html lang="en">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>Database created!</h2>
        <p>Your {dbms} database is up and running!</p>
        <p>Password: {password}</p>
        <p>Port: {port}</p>
        <p>Host: {host}</p>
        <p>Username: {username}</p>
        <p>Database: {database}</p>
        {connectionString && <p>Connection string: {connectionString}</p>}
      </div>
    </Html>
  );
};

export const renderTemplate = (props: DbCreatedProps) => render(<DbCreated {...props} />);
