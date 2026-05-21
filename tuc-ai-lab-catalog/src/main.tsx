import {createRoot} from 'react-dom/client';
import { AppWithAuth } from './components/AppWithAuth.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  </ThemeProvider>,
);
