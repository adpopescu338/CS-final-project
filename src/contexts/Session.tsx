import * as React from 'react';
import { ClientSession } from 'src/types/ClientSession';
import { req } from 'src/fe-lib/Req';

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
  const [timeoutId, setTimeoutId] = React.useState<ReturnType<typeof setTimeout> | null>(null);

  const getMe = () => {
    setSession({ user: null, status: 'loading' });

    req.me().then(({ data, status }) => {
      if (status === 'authenticated') {
        setSession({ user: data, status });
        if (!timeoutId) {
          const tmId = setTimeout(getMe, 1000 * 60 * 5);
          setTimeoutId(tmId);
        }
      } else {
        setSession({ user: null, status });
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getMe, []);

  return <Context.Provider value={{ session, setSession }}>{children}</Context.Provider>;
};

export const useSession = () => {
  const { session } = React.useContext(Context);
  return session;
};
