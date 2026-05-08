import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AnimatorProvider } from './context/AnimatorContext.tsx';
import { AuditProvider } from './context/AuditLog.tsx';
import { ThemeProvider } from './context/ThemeProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuditProvider>
        <AnimatorProvider>
          <App />
        </AnimatorProvider>
      </AuditProvider>
    </ThemeProvider>
  </StrictMode>,
);
