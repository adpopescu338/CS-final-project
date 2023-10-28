import React, { useEffect } from 'react';
import { req } from 'src/lib/Req';
import swal from 'sweetalert';
import { useQuery } from 'react-query';
import { queryKeys } from 'src/lib/constants';
import { Box, CircularProgress, Typography } from '@mui/material';

type IDatabase = Awaited<ReturnType<typeof req.getDatabases>>[number];

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

const DatabasesList: React.FC<{
  databases: IDatabase[];
  loading: boolean;
}> = ({ databases, loading }) => {
  if (loading) {
    return <CircularProgress />;
  }
  console.log({ databases });
  if (!databases.length) {
    return <Box>You have no databases</Box>;
  }

  return databases.map((db) => <Database key={db.id} db={db} />);
};

const Database: React.FC<{
  db: IDatabase;
}> = ({ db }) => {
  return (
    <Box>
      <Typography variant="h6">{db.name}</Typography>
      <Typography variant="body2"> {db.type}</Typography>
    </Box>
  );
};
