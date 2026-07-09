import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { PatoisWmsLogin } from './components/PatoisWmsLogin';
import { WmsMfaModal } from './components/WmsMfaModal';
import App from './App';

// Gate: while the WMS session resolves, show a splash; if a login or MFA challenge
// is pending, show the sign-in screen (with the TOTP modal over it); once a WMS
// session is adopted, render the app. App.tsx consumes useAuth() for identity and
// logout exactly as before — only the auth source changed.
export const AppWithAuth: React.FC = () => {
  const { isAuthenticated, isLoading, wmsMfaTicket } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0d1a0d 0%, #1a0a0a 40%, #1a1a0a 70%, #0d1a0d 100%)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase' }}
      >
        Connecting…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <PatoisWmsLogin />
        {wmsMfaTicket && <WmsMfaModal />}
      </>
    );
  }

  return <App />;
};
