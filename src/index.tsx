import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, Signup, NotFound } from './pages';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);
