import React from 'react';
import { req } from 'src/lib/Req';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

export const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState({
    email: '',
    name: '',
    password: '',
    otp: '',
  });

  const getInputProps = (name: string) => ({
    name,
    variant: 'outlined' as const,
    margin: 'normal' as const,
    required: true,
    fullWidth: true,
    onChange: (event) => {
      setValues((v) => ({ ...v, [name]: event.target.value }));
    },
    value: values[name],
  });

  const handleDetailsSubmit = async (event) => {
    event.preventDefault();
    try {
      await req.signup(values);
      setStep(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      await req.confirmOtp(values.otp);
      setStep(2);
      await req.signin(values);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const steps = [
    <Box
      component="form"
      onSubmit={handleDetailsSubmit}
      sx={{ mt: 3 }}
      style={{
        marginTop: '50px',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Please enter your details
      </Typography>
      <TextField label="Email" {...getInputProps('email')} />
      <TextField label="Name" {...getInputProps('name')} />
      <TextField label="Password" {...getInputProps('password')} type="password" />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Signup
      </Button>
    </Box>,
    <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Please enter the OTP sent to your email
      </Typography>
      <TextField label="OTP" {...getInputProps('otp')} />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Verify
      </Button>
    </Box>,
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Signup successful. Welcome!
      </Typography>
    </Box>,
  ];

  return (
    <Container component="main" maxWidth="xs">
      {error && <Alert severity="error">{error}</Alert>}
      {steps[step]}
    </Container>
  );
};
