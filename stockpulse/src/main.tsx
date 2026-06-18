import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global fetch interceptor to support subfolder deployments (e.g. /stockpulse)
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    const base = seg && seg !== 'api' ? `/${seg}` : '';
    return originalFetch(`${base}${input}`, init);
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
