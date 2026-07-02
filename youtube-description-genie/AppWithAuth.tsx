import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginView } from './components/LoginView';

export const AppWithAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <>{children}</>;
};
