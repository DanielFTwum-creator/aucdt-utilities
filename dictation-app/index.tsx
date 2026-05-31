import React from 'react';
import { createRoot } from 'react-dom/client';
import './src/styles/design-tokens.css';
import './index.css';
import { AuthProvider } from './src/auth/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthGate } from './AuthGate';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <AuthGate>
            <App />
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
