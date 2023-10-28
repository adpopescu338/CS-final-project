import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { NewDb, Databases } from 'src/components/Databases';
import { authedPage } from 'src/lib/HOC';

export const Dashboard = authedPage(() => {
  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Create a New Database:
        </Typography>
        <NewDb />
      </Box>
      <Divider />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Your Databases:
        </Typography>
        <Databases />
      </Box>
    </Container>
  );
});
