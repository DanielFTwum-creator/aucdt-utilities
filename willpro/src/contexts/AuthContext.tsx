import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string; email?: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  setGoogleUser: (u: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const GOOGLE_SESSION_KEY = 'willpro_google_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 1. Check for user data in URL (from OAuth callback)
    const urlUser = params.get('user');
    if (urlUser) {
      try {
        const u = JSON.parse(atob(urlUser)) as User;
        setUser(u);
        setIsAuthenticated(true);
        sessionStorage.setItem(GOOGLE_SESSION_KEY, JSON.stringify(u));
        // Hard redirect to reload without URL params
        window.location.href = '/willpro/';
        return;
      } catch (e) {
        console.error('Failed to parse user from URL:', e);
      }
    }

    // 2. Restore Google session from sessionStorage
    const storedGoogle = sessionStorage.getItem(GOOGLE_SESSION_KEY);
    if (storedGoogle) {
      try {
        const u = JSON.parse(storedGoogle) as User;
        setUser(u); setIsAuthenticated(true);
      } catch { sessionStorage.removeItem(GOOGLE_SESSION_KEY); }
    }

    // 3. Check for server-set cookie from OAuth callback (one-shot)
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('willpro_user='))
      ?.split('=')[1];
    if (cookieValue) {
      try {
        const u = JSON.parse(atob(decodeURIComponent(cookieValue))) as User;
        setUser(u); setIsAuthenticated(true);
        sessionStorage.setItem(GOOGLE_SESSION_KEY, JSON.stringify(u));
        document.cookie = 'willpro_user=; max-age=0; path=/willpro/';
        setIsLoading(false);
        return;
      } catch (e) { console.error('Failed to parse user cookie:', e); }
    }

    // Existing JWT path
    const token = AuthService.getToken();
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const setGoogleUser = (u: User) => {
    setUser(u);
    setIsAuthenticated(true);
    sessionStorage.setItem(GOOGLE_SESSION_KEY, JSON.stringify(u));
  };

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => {
    AuthService.logout();
    sessionStorage.removeItem(GOOGLE_SESSION_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, setGoogleUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
