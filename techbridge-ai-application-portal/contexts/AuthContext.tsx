/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

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
const STORAGE_KEY = 'techbridge_ai_application_portal_user';

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredUser());

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setIsAuthenticated(true);
      setUser(userOrUsername);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userOrUsername));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return { success: data.success, message: data.message };
    } catch {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
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
