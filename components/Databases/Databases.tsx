import React, { useEffect } from 'react';
import { req } from 'lib/Req';
import swal from 'sweetalert';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { queryKeys } from 'lib/constants/query-keys';
import { Box, Button, CircularProgress, Grid, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import LinearProgress from '@mui/material/LinearProgress';
import { MAX_GIGA_SIZE_PER_DATABASE } from 'lib/constants';
import { DBMS } from '@prisma/client';
import Image from 'next/image';

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

  if (!databases.length) {
    return <Box>You have no databases</Box>;
  }

  return (
    <Grid container direction="column" gap={2} paddingBottom={10}>
      {databases.map((db) => (
        <Database key={db.id} db={db} />
      ))}
    </Grid>
  );
};

const DbBox = styled(Box)`
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  .db-item-actions-container {
    height: 0;
    transition: height 0.3s ease-in-out;
    overflow: hidden;
  }
  &:hover {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    transform: scale(1.03);
    .db-item-actions-container {
      height: 40px;
    }
  }
`;

const Database: React.FC<{
  db: IDatabase;
}> = ({ db }) => {
  const { mutate, isLoading } = useMutation(req.deleteDb);
  const queryClient = useQueryClient();

  const handleDelete = async (dbId: string) => {
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'This action is irreversible',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Delete'],
    });

    if (!confirm) return;
    mutate(dbId, {
      onSuccess: () => {
        swal('Database deleted');
        queryClient.invalidateQueries(queryKeys.databases);
      },
      onError: (err: any) => {
        swal('Something went wrong', err.message, 'error');
      },
    });
  };

  return (
    <Grid item>
      <DbBox>
        <Grid container justifyContent="space-between">
          <Grid item>
            <DbLogo type={db.type} />
          </Grid>
          <Grid item>
            <Typography variant="h6">{db.name}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {new Date(db.createdAt).toUTCString().split(' GMT')[0]}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid item>
            <LinearProgress variant="determinate" value={db.size / MAX_GIGA_SIZE_PER_DATABASE} />
            Size: {db.size.toFixed(2)}/{MAX_GIGA_SIZE_PER_DATABASE * 1000} MB
          </Grid>
          <Grid item>
            <Typography variant="caption">{db.status}</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-around" className="db-item-actions-container">
          <Grid item>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(db.id)}
              disabled={isLoading}
            >
              Delete
              {isLoading && <CircularProgress size={20} />}
            </Button>
          </Grid>
          <Grid item>
            {db.type === 'mongodb' ? (
              <Tooltip title="Coming soon" arrow placement="top">
                {
                  <Button variant="outlined" color="primary" size="small">
                    Inspect
                  </Button>
                }
              </Tooltip>
            ) : (
              <a
                href={`/api/admin/inspect?id=${db.id}`}
                target="_blank"
                rel="noopener noreferrer"
                content="application/json"
              >
                <Button variant="outlined" color="primary" size="small" disabled={isLoading}>
                  Inspect
                </Button>
              </a>
            )}
          </Grid>
        </Grid>
      </DbBox>
    </Grid>
  );
};

const DbLogo: React.FC<{
  type: DBMS;
}> = ({ type }) => {
  const height = 70;
  const width = type === 'mongodb' ? 60 : type === 'postgresql' ? 112 : 70;
  const src = `/${type}-logo.png`;

  return <Image src={src} alt={type + '-logo'} height={height} width={width} />;
};
