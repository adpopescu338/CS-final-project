import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, Signup, NotFound, Dashboard, Signin, Settings } from './pages';
import { SessionProvider } from './contexts';
import { Navbar } from './components';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <React.StrictMode>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.StrictMode>
      </BrowserRouter>
    </QueryClientProvider>
  </SessionProvider>
);
