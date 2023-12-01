import React from 'react';
import { req } from 'lib/Req';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import swal from 'sweetalert';
import { signin } from 'lib/utils';

const Signup = () => {
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
      swal(err.message);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      await req.confirmOtp(values.otp);
      setStep(2);
      await signin(values.email, values.password);
    } catch (err) {
      swal(err.message);
    }
  };

  const steps = [
    <Box
      key="1"
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
    <Box key="2" component="form" onSubmit={handleOtpSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Please enter the OTP sent to your email
      </Typography>
      <TextField label="OTP" {...getInputProps('otp')} />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Verify
      </Button>
    </Box>,
    <Box key="3" sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Signup successful. Welcome!
      </Typography>
    </Box>,
  ];

  return (
    <Container component="main" maxWidth="xs">
      {steps[step]}
    </Container>
  );
};

export default Signup;
