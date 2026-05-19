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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tuc_ai_lab_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('tuc_ai_lab_user');
      }
    }

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const storedState = localStorage.getItem('oauth_state');

    if (error) {
      console.error('OAuth error:', error);
    } else if (code && state && state === storedState) {
      localStorage.removeItem('oauth_state');
      exchangeCodeForUser(code);
    }
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
      localStorage.setItem('tuc_ai_lab_user', JSON.stringify(userOrUsername));
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
        localStorage.setItem('tuc_ai_lab_user', JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('tuc_ai_lab_user');
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
