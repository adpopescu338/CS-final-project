import React, { useEffect } from 'react';
import { req } from 'src/lib/Req';
import swal from 'sweetalert';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'src/lib/constants';
import { Box, CircularProgress } from '@mui/material';

const Wrapper = ({ children }) => <Box sx={{ mt: 3 }}>{children}</Box>;

export const Databases = () => {
  const { data = [], isLoading, error } = useQuery(queryKeys.databases, req.getDatabases);

  useEffect(() => {
    if (error) {
      swal((error as any).message ?? 'Something went wrong');
    }
  }, [error]);

  return (
    <Wrapper>
      <DatabasesList databases={data} loading={isLoading} />
    </Wrapper>
  );
};

const DatabasesList = ({ databases, loading }) => {
  if (!databases.length) {
    return <CircularProgress />;
  }

  return null;
};
