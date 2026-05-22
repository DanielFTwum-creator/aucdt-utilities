import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOAuthAppContext, getAppDashboardPath } from '../utils/appContext';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_KEY = 'email_drafter_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 1. Check for user data in URL (from OAuth callback)
    const urlUser = params.get('user');
    if (urlUser) {
      try {
        const userData = JSON.parse(atob(urlUser)) as User;
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        // Hard redirect to reload without URL params
        window.location.href = '/email-drafter/';
        return;
      } catch (e) {
        console.error('Failed to parse user from URL:', e);
      }
    }

    // 2. Restore from sessionStorage
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const u = JSON.parse(stored) as User;
        setUser(u);
        setIsAuthenticated(true);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    // 3. Check for server-set cookie from OAuth callback
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SESSION_KEY}=`))
      ?.split('=')[1];

    if (cookieValue) {
      try {
        const userJson = atob(decodeURIComponent(cookieValue));
        const userData = JSON.parse(userJson) as User;
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        document.cookie = `${SESSION_KEY}=; max-age=0; path=/email-drafter/`;
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
      }
    }

    // 4. Handle URL-based OAuth callback fallback (frontend exchange)
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const storedState = sessionStorage.getItem('oauth_state');
    const appContext = getOAuthAppContext();

    if (error) {
      console.error('OAuth error:', error);
    } else if (code && state && state === storedState) {
      sessionStorage.removeItem('oauth_state');
      const currentPath = window.location.pathname;
      const targetPath = getAppDashboardPath(appContext);
      if (!currentPath.includes(targetPath)) {
        window.location.href = targetPath + `?code=${code}&state=${state}`;
        return;
      }
      exchangeCodeForUser(code);
    }

    setIsLoading(false);
  }, []);

  const exchangeCodeForUser = async (code: string) => {
    const redirectUri = `${window.location.origin}/email-drafter/callback`;
    try {
      const response = await fetch('/api/auth/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri }),
      });
      if (response.ok) {
        const { user: userData } = await response.json();
        login(userData);
        // Strip code/state from URL
        window.history.replaceState({}, '', '/email-drafter/');
      }
    } catch (err) {
      console.error('OAuth exchange error:', err);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('oauth_state');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
