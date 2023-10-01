import { useRef } from 'react';
import styled from 'styled-components';
import React from 'react';
import { req } from 'src/lib/Req';

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
  const [emailRef, nameRef, passwordRef] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = {
      email: emailRef.current?.value as string,
      name: nameRef.current?.value as string,
      password: passwordRef.current?.value as string,
    };

    req.signup(values).then(console.log);
  };

  return (
    <Container>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input ref={emailRef} id="email" type="email" required />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input ref={nameRef} id="name" type="text" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input ref={passwordRef} id="password" type="password" required />
        </div>
        <button type="submit">Signup</button>
      </form>
    </Container>
  );
};
