
import React from 'react';
import ReactDOM from 'react-dom/client';
// Local Tailwind + self-hosted fonts (Pattern 32) — no cdn.tailwindcss.com, no fonts.gstatic.com.
import './index.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-900.css';
import '@fontsource/rokkitt/latin-700.css';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './AppWithAuth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  </React.StrictMode>
);