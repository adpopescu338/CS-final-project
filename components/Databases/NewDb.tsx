import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import type { DBMS } from '@prisma/client';
import { req } from 'lib/Req';
import swal from 'sweetalert';
import { useQueryClient } from 'react-query';
import { queryKeys } from 'lib/constants/query-keys';

export const NewDb = () => {
  const [dbType, setDbType] = useState<DBMS>('mysql');
  const [databaseName, setDatabaseName] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const queryClient = useQueryClient();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await req.createNewDb({ databaseName, type: dbType });
      queryClient.invalidateQueries(queryKeys.databases);

      swal({
        title: 'Database created',
        text: response.message,
      });
    } catch (err) {
      swal({
        title: 'Something went wrong',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Autocomplete
        disableClearable
        options={['mysql', 'mongodb', 'postgresql']}
        value={dbType}
        onChange={(event, newValue) => newValue && setDbType(newValue as DBMS)}
        renderInput={(params) => (
          <TextField {...params} label="Choose DBMS" required variant="outlined" fullWidth />
        )}
      />
      <TextField
        label="Database Name"
        variant="outlined"
        fullWidth
        required
        margin="normal"
        value={databaseName}
        onChange={(e) => setDatabaseName(e.target.value)}
      />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Disclaimer: The provided database name will be part of the actual database name but may not
        be identical to avoid conflicts.
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        disabled={loading} // Disable button during loading
        startIcon={loading ? <CircularProgress size={20} /> : null} // Add spinner to the button when loading
      >
        Create Database
      </Button>
    </Box>
  );
};
