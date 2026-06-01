import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => ReturnType<typeof AuthService.login>;
  logout: () => void;
  isLoading: boolean;
}

const AUTH_KEY = 'tuc_auth_omniextract';
const USER_KEY = 'omniextract_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY)
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate from server-set cookie after OAuth callback (one-shot)
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('omniextract_user='))
      ?.split('=')[1];
    if (cookieValue) {
      try {
        const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as User;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(userData);
        setIsAuthenticated(true);
        document.cookie = 'omniextract_user=; max-age=0; path=/omniextract/';
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const result = await AuthService.login(username, password);
    if (result.success) {
      const userData: User = {
        id: result.user?.id,
        username: result.user?.username,
        email: result.user?.username,
        role: result.user?.role,
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
