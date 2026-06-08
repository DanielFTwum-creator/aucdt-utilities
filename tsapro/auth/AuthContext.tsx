import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, post, rawPost, setAccessToken, setOnAuthLost } from './api';

export interface WmsUser {
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
  mfaEnrolled?: boolean;
}

interface AuthState {
  user: WmsUser | null;
  loading: boolean;                       // true while the initial silent-refresh runs
  setSession: (accessToken: string, user: WmsUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WmsUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => { setAccessToken(null); setUser(null); }, []);

  const setSession = useCallback((accessToken: string, u: WmsUser) => {
    setAccessToken(accessToken);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try { await post('/api/auth/logout'); } catch { /* ignore */ }
    clear();
  }, [clear]);

  // On load, attempt a silent refresh (HttpOnly cookie) to restore the session.
  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
      setOnAuthLost(clear);               // arm mid-flight session-loss handler only after startup
    };
    const timer = setTimeout(() => { setAccessToken(null); finish(); }, 10000);
    (async () => {
      try {
        const data = await rawPost<{ access_token: string; user: WmsUser }>('/api/auth/refresh');
        setAccessToken(data.access_token);
        const me = await api<WmsUser & { mfaEnrolled?: boolean }>('/api/me');
        setUser({ email: me.email, name: me.name, role: me.role, photoUrl: me.photoUrl, mfaEnrolled: me.mfaEnrolled });
      } catch {
        // Expected on /auth/callback (no cookie yet). Don't clear() — CallbackPage may
        // have already called setSession() concurrently.
        setAccessToken(null);
      } finally {
        clearTimeout(timer);
        finish();
      }
    })();
    return () => clearTimeout(timer);
  }, [clear]);

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
