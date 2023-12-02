import * as React from 'react';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';
import { DBMS } from '@prisma/client';

export type TemplateProps = {
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
}: TemplateProps) => {
  return (
    <Html lang="en">
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: 'none',
        }}
      >
        <tr>
          <td
            style={{
              padding: '10px',
              border: 'none',
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
          </td>
        </tr>
      </table>
    </Html>
  );
};

export const renderTemplate = (props: TemplateProps) => render(<DbCreated {...props} />);
