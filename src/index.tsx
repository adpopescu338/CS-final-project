import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, Signup, NotFound, Dashboard, Signin } from './pages';
import { SessionProvider } from './contexts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <SessionProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
  </SessionProvider>
);
