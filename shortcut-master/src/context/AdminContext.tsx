import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  logs: AuditLog[];
  addLog: (action: string, details: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('admin_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('admin_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('admin_logs', JSON.stringify(logs));
  }, [logs]);

  const login = (password: string) => {
    // In a real app, this would be a server-side check.
    // Password for this demo is 'admin123'
    if (password === 'admin123') {
      setIsAuthenticated(true);
      addLog('Login', 'Admin user logged in successfully.');
      return true;
    }
    addLog('Failed Login', 'An attempt to login with an incorrect password was made.');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    addLog('Logout', 'Admin user logged out.');
  };

  const addLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Admin',
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, logs, addLog }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
