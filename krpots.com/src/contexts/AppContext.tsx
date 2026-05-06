import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'hc';
type AuditLog = { id: string; action: string; timestamp: string; user: string };

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  auditLogs: AuditLog[];
  logAction: (action: string, user?: string) => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
    
    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

    const authState = localStorage.getItem('isAdminAuthenticated');
    if (authState === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? '' : `theme-${theme}`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const logAction = (action: string, user: string = 'Admin') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString(),
      user
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('auditLogs', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (password: string) => {
    // Hardcoded password for demonstration. In a real app, this would be an API call.
    if (password === 'krpots2026') {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      logAction('Admin login successful');
      return true;
    }
    logAction('Admin login failed');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    logAction('Admin logout');
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, auditLogs, logAction, isAuthenticated, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
