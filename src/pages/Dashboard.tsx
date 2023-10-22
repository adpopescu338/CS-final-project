import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { NewDb } from 'src/components/Databases/NewDb';
import { authedPage } from 'src/lib/HOC';

export const Dashboard = authedPage(() => {
  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4" align="center">
          Dashboard
        </Typography>
      </Box>
      <Divider />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Create a New Database:
        </Typography>
        <NewDb />
      </Box>
    </Container>
  );
});
