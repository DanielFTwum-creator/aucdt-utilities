import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { AppWithAuth } from './components/AppWithAuth.tsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppWithAuth />
  </AuthProvider>,
);
