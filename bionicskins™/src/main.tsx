import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppWithAuth } from './AppWithAuth';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/skins">
        <AppWithAuth />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
