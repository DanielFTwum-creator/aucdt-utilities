import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userOrUsername: User | string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('techbridge_ai_application_portal_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('techbridge_ai_application_portal_user');
      }
    }
  }, []);

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setUser(userOrUsername);
      setIsAuthenticated(true);
      localStorage.setItem('techbridge_ai_application_portal_user', JSON.stringify(userOrUsername));
    } else {
      const hashPassword = async (pwd: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(pwd);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      if (password) {
        const envHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
        const inputHash = await hashPassword(password);
        if (inputHash === envHash) {
          const userData: User = { id: 'admin-001', username: userOrUsername, email: 'admin@techbridge.edu.gh' };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('techbridge_ai_application_portal_user', JSON.stringify(userData));
        } else {
          throw new Error('Invalid credentials');
        }
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('techbridge_ai_application_portal_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
