import React from 'react';
import { useAuth } from './src/contexts/AuthContext';
import { LoginView } from './src/components/LoginView';
import App from './App';

export const AppWithAuth: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <App />;
};
