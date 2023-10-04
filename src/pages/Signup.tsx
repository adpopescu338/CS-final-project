import styled from 'styled-components';
import React from 'react';
import { req } from 'src/lib/Req';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  form {
    display: flex;
    flex-direction: column;
    width: 300px;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;

    div {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;

      label {
        margin-bottom: 5px;
      }

      input {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    }

    button {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #fff;
      cursor: pointer;
    }
  }
`;

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
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [name]: event.target.value }));
    },
    value: values[name],
    required: true,
  });

  const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await req.signup(values);
      setStep(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    <form onSubmit={handleDetailsSubmit}>
      <h4>Please enter your details</h4>
      <div>
        <label htmlFor="email">Email</label>
        <input {...getInputProps('email')} />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input {...getInputProps('name')} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input {...getInputProps('password')} type="password" />
      </div>
      <button type="submit">Signup</button>
    </form>,
    <form onSubmit={handleOtpSubmit}>
      <h4>Please enter the OTP sent to your email</h4>
      <div>
        <label htmlFor="otp">OTP</label>
        <input {...getInputProps('otp')} />
      </div>
      <button type="submit">Verify</button>
    </form>,
    <div>
      <h4>Signup successful. Welcome!</h4>
    </div>,
  ];

  return (
    <Container>
      {error && <div>{error}</div>}
      {steps[step]}
    </Container>
  );
};
