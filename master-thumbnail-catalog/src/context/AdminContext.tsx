import React, { createContext, useContext, useState } from 'react';

interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  user: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  logs: AuditLogEntry[];
  logAction: (action: string, details: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const logAction = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date(),
      user: 'admin' // Simplified for this phase
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const login = (password: string) => {
    // Hardcoded password for Phase 2 demonstration
    if (password === 'admin123') {
      setIsAuthenticated(true);
      logAction('LOGIN', 'Admin logged in successfully');
      return true;
    }
    logAction('LOGIN_FAILED', 'Failed login attempt');
    return false;
  };

  const logout = () => {
    logAction('LOGOUT', 'Admin logged out');
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, logs, logAction }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
