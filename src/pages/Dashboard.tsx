import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { NewDb } from 'src/components/NewDb';

export const Dashboard = () => {
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
};
