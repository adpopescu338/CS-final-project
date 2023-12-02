import 'styles/global.css';
import type { AppProps } from 'next/app';
import { Navbar, Footer } from 'components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider
        session={pageProps.session}
        baseUrl={process.env.NEXT_PUBLIC_URL}
        basePath="/api/auth"
      >
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
