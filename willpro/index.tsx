import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
  <React.StrictMode>
    <AuthGate onLogout={() => window.location.href = '/'}><App /></AuthGate>
  </React.StrictMode>
);
}