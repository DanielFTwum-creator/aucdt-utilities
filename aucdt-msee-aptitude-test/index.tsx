import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './src/AuthGate';

// Single sign-on bridge: when the Google callback issues an exam session it drops
// a short-lived `msee_session` cookie. Move it into the sessionStorage keys useAuth
// reads BEFORE React mounts, so the exam session is live on first render and the
// old password login screen is never shown. Keys must match hooks/useAuth.ts.
(function bootstrapGoogleSession() {
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith('msee_session='));
    if (!match) return;
    const raw = decodeURIComponent(match.split('=').slice(1).join('='));
    const { accessToken, user } = JSON.parse(atob(raw));
    if (accessToken && user) {
      sessionStorage.setItem('msee_auth_token', accessToken);
      sessionStorage.setItem('msee_current_user', JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to bootstrap Google session:', e);
  } finally {
    document.cookie = 'msee_session=; max-age=0; path=/aucdt-msee-aptitude-test/';
  }
})();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element with id 'root' to mount to.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);