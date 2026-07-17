import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './src/AuthGate';

// Single sign-on bridge: the Google callback drops an 8h `msee_session` cookie.
// Copy it into the sessionStorage keys useAuth reads BEFORE React mounts, so the
// exam session is live on first render and the old password login screen never
// shows. The cookie is kept (not deleted), so a new tab or reload re-hydrates the
// session from it rather than stranding the user on a login screen. Keys must
// match hooks/useAuth.ts.
(function bootstrapGoogleSession() {
  try {
    if (sessionStorage.getItem('msee_auth_token')) return;
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