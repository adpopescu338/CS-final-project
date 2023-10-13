import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import { authedPage } from 'src/lib/HOC';

export const Settings = authedPage(() => {
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="h4">Settings</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">Coming soon...</Typography>
      </Grid>
    </Grid>
  );
});
