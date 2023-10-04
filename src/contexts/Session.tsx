import * as React from 'react';
import { ClientSession } from 'src/types/ClientSession';
import { req } from 'src/lib/Req';

const defaultSessionValue: ClientSession = {
  user: null,
  status: 'loading',
};

const Context = React.createContext<{
  session: ClientSession;
  setSession: (session: ClientSession) => void;
}>({
  session: defaultSessionValue,
  setSession: () => {},
});

export const SessionProvider = ({ children }) => {
  const [session, setSession] = React.useState<ClientSession>(defaultSessionValue);

  req.setSession = setSession;

  React.useEffect(() => {
    req.me();
  }, []);

  return <Context.Provider value={{ session, setSession }}>{children}</Context.Provider>;
};

export const useSession = () => {
  const { session } = React.useContext(Context);
  return session;
};
