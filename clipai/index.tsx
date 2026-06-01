import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthGate } from './src/AuthGate';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './AppWithAuth';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </AuthGate>
  </React.StrictMode>
);
