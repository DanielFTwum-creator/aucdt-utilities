import React, { useEffect, useState, createContext, useContext } from 'react';
import { FormLoginView } from './components/FormLoginView';

const AUTH_KEY = 'tuc_auth_youtube-genie';
const USER_KEY = 'youtube-genie_user';

const AuthContext = createContext<{ handleLogout: () => void } | null>(null);

export function useLogout() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useLogout must be used inside AuthGate');
  return ctx.handleLogout;
}

interface User { id?: string; name?: string; email: string; }

export function AuthGate({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY)
  );
  const [, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored) as User; } catch { localStorage.removeItem(USER_KEY); return null; }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const cookieValue = document.cookie.split('; ')
      .find(row => row.startsWith('youtube-genie_user='))?.split('=')[1];

    if (cookieValue) {
      try {
        const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as User;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(userData);
        setAuthed(true);
        document.cookie = 'youtube-genie_user=; max-age=0; path=/youtube-genie/';
      } catch (e) { console.error('Failed to parse user cookie:', e); }
    }

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const oauthDesc  = params.get('desc');
    if (oauthError) {
      console.error('[AuthGate] OAuth error from server:', oauthError, oauthDesc ?? '');
      setError(`Google login failed: ${oauthError}${oauthDesc ? ` — ${oauthDesc}` : ''}`);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    onLogout?.();
  };

  if (authed) return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError('Google login is not configured.'); return; }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/youtube-genie/callback`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    const p = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
    });
    console.log('[AuthGate] Starting Google OAuth');
    console.log('[AuthGate]   client_id prefix :', clientId.slice(0, 20) + '…');
    console.log('[AuthGate]   redirect_uri      :', redirectUri);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
  };

  return (
    <FormLoginView
      appName="YouTube Description Genie"
      appSubtitle="AI-powered YouTube content for TUC"
      onGoogleLogin={handleGoogleLogin}
      error={error}
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
    />
  );
}
