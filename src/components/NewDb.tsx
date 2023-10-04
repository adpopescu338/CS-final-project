import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Box, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DBMS } from '@prisma/client';
import { req } from 'src/lib/Req';

export const NewDb = () => {
  const [dbType, setDbType] = useState<DBMS | null>(null);
  const [databaseName, setDatabaseName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await req.createNewDb({ databaseName }, { type: dbType as DBMS });
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Autocomplete
        options={Object.values(DBMS)}
        value={dbType}
        onChange={(event, newValue) => setDbType(newValue)}
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
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
    </Box>
  );
};
