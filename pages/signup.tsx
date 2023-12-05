import React from 'react';
import { req } from 'lib/Req';
import TextField from '@mui/material/TextField';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import swal from 'sweetalert';
import { useSignin } from 'lib/utils/useSignin';
import { CircularProgress } from '@mui/material';

const Signup = () => {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    email: '',
    name: '',
    password: '',
    otp: '',
  });
  const signin = useSignin();

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
    setLoading(true);

    try {
      await req.signup(values);
      setStep(1);
    } catch (err: any) {
      swal(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await req.confirmOtp(values.otp);
      setStep(2);
      await signin(values.email, values.password);
    } catch (err: any) {
      swal(err.message);
    } finally {
      setLoading(false);
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
      <LoadingButton loading={loading}>Signup</LoadingButton>
    </Box>,
    <Box key="2" component="form" onSubmit={handleOtpSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Please enter the OTP sent to your email
      </Typography>
      <TextField label="OTP" {...getInputProps('otp')} />
      <LoadingButton loading={loading}>Verify</LoadingButton>
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

const LoadingButton: React.FC<
  {
    loading: boolean;
    children: string;
  } & ButtonProps
> = ({ loading, children, ...rest }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={loading}
      {...rest}
    >
      {children} {loading && <CircularProgress size={20} />}
    </Button>
  );
};

export default Signup;
