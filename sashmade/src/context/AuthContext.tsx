import React, { createContext, useContext, useState } from 'react';

interface User {
  username: string; // Used for standard user or the person's name
  email?: string;
  picture?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: 'admin' | 'user', email?: string, picture?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (
    username: string, 
    role: 'admin' | 'user', 
    email?: string, 
    picture?: string
  ) => {
    const newUser = { username, role, email, picture };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Log login action (Mock Audit)
    const auditLog = JSON.parse(localStorage.getItem('audit_log') || '[]');
    auditLog.push({
      timestamp: new Date().toISOString(),
      action: 'LOGIN',
      actor: username,
      details: 'User logged in'
    });
    localStorage.setItem('audit_log', JSON.stringify(auditLog));
  };

  const logout = () => {
    // Log logout action
    if (user) {
        const auditLog = JSON.parse(localStorage.getItem('audit_log') || '[]');
        auditLog.push({
          timestamp: new Date().toISOString(),
          action: 'LOGOUT',
          actor: user.username,
          details: 'User logged out'
        });
        localStorage.setItem('audit_log', JSON.stringify(auditLog));
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
