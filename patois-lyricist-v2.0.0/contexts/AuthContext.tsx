import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userOrEmail: User | string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'patois_lyricist_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Check URL for user param (OAuth callback fallback)
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(atob(userParam));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        // Hard redirect to clear URL parameters
        window.location.href = window.location.pathname;
        return;
      } catch (e) {
        console.error("Failed to parse user from URL", e);
      }
    }

    // 2. Check Cookie (set by backend on successful OAuth)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const cookieUser = getCookie('patois_user');
    if (cookieUser) {
      try {
        const userData = JSON.parse(atob(decodeURIComponent(cookieUser)));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
      } catch (e) {
        console.error("Failed to parse user from cookie", e);
      }
    } else {
      // 3. Fallback to SessionStorage
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    }
    
    setIsInitializing(false);
  }, []);

  const login = (userOrEmail: User | string) => {
    const userData = typeof userOrEmail === 'string' ? { email: userOrEmail } : userOrEmail;
    setUser(userData);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call backend logout to clear cookie
      const basePath = window.location.pathname.replace(/\/$/, '') || '';
      await fetch(`${basePath}/api/auth/logout`, { method: 'POST' });
    } catch (e) {
      console.error("Backend logout failed", e);
    }
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
    // Also remove document cookie manually just in case
    document.cookie = 'patois_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-amber-50">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
