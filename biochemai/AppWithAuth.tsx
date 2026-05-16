import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginView } from './components/LoginView';
import App from './App';

/**
 * MARKAI.md Pattern: AppWithAuth wrapper
 *
 * This wrapper checks authentication state BEFORE rendering component hooks.
 * This prevents "Hook changed order" errors and ensures consistent auth flow.
 *
 * Flow: AppWithAuth → (isAuthenticated ? App : LoginView)
 */
export const AppWithAuth: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0a0f1e',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // If authenticated, render the main app
  return <App />;
};
