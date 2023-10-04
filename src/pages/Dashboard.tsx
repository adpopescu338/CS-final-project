import React from 'react';
import { useSession } from 'src/contexts';

export const Dashboard = () => {
  const session = useSession();

  console.log(session);
  return <div>Dashboard</div>;
};
