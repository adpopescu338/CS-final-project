import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { req } from 'src/lib/Req';

export const Signin = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await req.signin(values);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      Signin
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            onChange={(event) => {
              setValues((v) => ({ ...v, email: event.target.value }));
            }}
            type="email"
            required
            name="email"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            onChange={(event) => {
              setValues((v) => ({ ...v, password: event.target.value }));
            }}
            type="password"
            required
            name="password"
          />
        </div>
        <button type="submit">Signin</button>
      </form>
    </div>
  );
};
