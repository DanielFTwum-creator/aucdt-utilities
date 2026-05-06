import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

interface AuditContextType {
  logs: AuditLog[];
  logAction: (action: string, details: string, user?: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tuc_population_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tuc_population_audit_logs', JSON.stringify(logs));
  }, [logs]);

  const logAction = (action: string, details: string, user: string = 'System') => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
      user,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AuditContext.Provider value={{ logs, logAction }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};
