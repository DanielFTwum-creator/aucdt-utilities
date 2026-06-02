import React, { createContext, useContext, useState, useEffect } from 'react';

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = () => {
      const params = new URLSearchParams(window.location.search);

      // 1. Check for user data in URL (from OAuth callback)
      const urlUser = params.get('user');
      if (urlUser) {
        try {
          const userData = JSON.parse(atob(urlUser)) as User;
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('techbridge_ai_blueprint_user', JSON.stringify(userData));
          // Hard redirect to reload the app with auth in localStorage
          window.location.href = '/blueprint/';
          return;
        } catch (e) {
          console.error('[Auth] Failed to parse user from URL:', e);
        }
      }

      // 2. Check for server-set cookie from OAuth callback (one-shot)
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('blueprint_user='))
        ?.split('=')[1];
      if (cookieValue) {
        try {
          const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as User;
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('techbridge_ai_blueprint_user', JSON.stringify(userData));
          document.cookie = 'blueprint_user=; max-age=0; path=/blueprint/';
          // Clean URL after OAuth callback
          if (window.location.search.includes('code=')) {
            window.history.replaceState({}, '', '/blueprint/');
          }
          return;
        } catch (e) {
          console.error('[Auth] Failed to parse user cookie:', e);
        }
      }

      // 3. Restore from localStorage
      const stored = localStorage.getItem('techbridge_ai_blueprint_user');
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('techbridge_ai_blueprint_user');
        }
      }

      // 4. Check for OAuth errors
      const oauthError = params.get('error');
      if (oauthError) {
        console.error('[Auth] OAuth error:', oauthError);
      }
    };

    initAuth();
  }, []);

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem('techbridge_ai_blueprint_user', JSON.stringify(userOrUsername));
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
        localStorage.setItem('techbridge_ai_blueprint_user', JSON.stringify(data.user));
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
        localStorage.setItem('techbridge_ai_blueprint_user', JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    // Clear state first so AppWithAuth re-renders to LoginView before redirect
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('techbridge_ai_blueprint_user');
    // Clear cookie with all matching attributes to ensure immediate removal
    document.cookie = 'blueprint_user=; max-age=0; path=/blueprint/';
    document.cookie = 'blueprint_user=; max-age=0; path=/';
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    } finally {
      window.location.href = '/blueprint/';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
