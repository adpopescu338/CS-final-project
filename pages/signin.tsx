import * as React from 'react';
import { useRouter } from 'next/router';
import { req } from 'lib/Req';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import swal from 'sweetalert';
import { signIn } from 'next-auth/react';

const Signin = () => {
  const { push } = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await signIn(
        'credentials',
        {
          redirect: false,
          callbackUrl: '/dashboard',
        },
        {
          email: values.email,
          password: values.password,
        }
      );
    } catch (err: any) {
      swal(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        marginTop: '50px',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={values.email}
          onChange={(event) => {
            setValues((v) => ({ ...v, email: event.target.value }));
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => {
            setValues((v) => ({ ...v, password: event.target.value }));
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>
    </Container>
  );
};

export default Signin;
