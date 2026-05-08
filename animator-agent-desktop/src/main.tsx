import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AnimatorProvider } from './context/AnimatorContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimatorProvider>
      <App />
    </AnimatorProvider>
  </StrictMode>,
);
