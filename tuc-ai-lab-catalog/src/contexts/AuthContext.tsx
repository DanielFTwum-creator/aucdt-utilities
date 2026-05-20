import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession, setUserSession, clearUserSession } from '../utils/indexedDB';
import { getOAuthAppContext, getAppDashboardPath } from '../utils/appContext';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userOrUsername: User | string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      // Restore user session from IndexedDB
      const stored = await getUserSession();
      if (stored) {
        setUser(stored as User);
        setIsAuthenticated(true);
      }

      // Check for server-set cookie from OAuth callback
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('ai_lab_user='))
        ?.split('=')[1];

      if (cookieValue) {
        try {
          const userJson = atob(decodeURIComponent(cookieValue));
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsAuthenticated(true);
          // Clear the cookie after reading
          document.cookie = 'ai_lab_user=; max-age=0; path=/ai-lab/';
          return;
        } catch (e) {
          console.error('Failed to parse user cookie:', e);
        }
      }

      // Handle URL-based OAuth callback (legacy, from Peace Vinyl pattern)
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const storedState = sessionStorage.getItem('oauth_state');
      const appContext = getOAuthAppContext();

      if (error) {
        console.error('OAuth error:', error);
      } else if (code && state && state === storedState) {
        sessionStorage.removeItem('oauth_state');
        // Redirect to correct app dashboard if needed
        const currentPath = window.location.pathname;
        const targetPath = getAppDashboardPath(appContext);
        if (!currentPath.includes(targetPath)) {
          window.location.href = targetPath + `?code=${code}&state=${state}`;
          return;
        }
        exchangeCodeForUser(code);
      }
    };

    restoreSession();
  }, []);

  const exchangeCodeForUser = async (code: string) => {
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;
    try {
      const response = await fetch('/api/auth/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri }),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        login(userData);
      }
    } catch (err) {
      console.error('OAuth exchange error:', err);
    }
  };

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      await setUserSession({
        id: userOrUsername.id,
        username: userOrUsername.username,
        email: userOrUsername.email,
        timestamp: Date.now(),
      });
      return { success: true };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userOrUsername, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem('tuc_ai_lab_user', JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        await setUserSession({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          timestamp: Date.now(),
        });
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await clearUserSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
