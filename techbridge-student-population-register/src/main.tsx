import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './ThemeContext';
import { AuditProvider } from './AuditContext';
import './index.css';
import { AuthGate } from './AuthGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuditProvider>
          <AuthGate><App /></AuthGate>
        </AuditProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

document.getElementById('tuc-splash-styles')?.remove();
