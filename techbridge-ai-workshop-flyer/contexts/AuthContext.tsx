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
    const stored = localStorage.getItem('techbridge_ai_workshop_flyer_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('techbridge_ai_workshop_flyer_user');
      }
    }
  }, []);

  const login = async (userOrUsername: User | string, password?: string) => {
    if (typeof userOrUsername === 'object') {
      setUser(userOrUsername);
      setIsAuthenticated(true);
      localStorage.setItem('techbridge_ai_workshop_flyer_user', JSON.stringify(userOrUsername));
    } else {
      if (password) {
        const userData: User = { id: 'user-' + Date.now(), username: userOrUsername, email: 'user@techbridge.edu.gh' };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('techbridge_ai_workshop_flyer_user', JSON.stringify(userData));
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('techbridge_ai_workshop_flyer_user');
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
