import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Theme, AuditLog, AppContextState, TabId } from '../types';

const AppContext = createContext<AppContextState | undefined>(undefined);

const ADMIN_PASSWORD = 'admin123'; 

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as Theme) || 'light';
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'high-contrast');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const addAuditLog = (action: string) => {
        const newLog: AuditLog = {
            timestamp: new Date().toISOString(),
            action,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    };
    
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        addAuditLog(`Theme changed to ${newTheme}`);
    }

    const login = (password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            addAuditLog('Admin login successful.');
            return true;
        }
        addAuditLog('Admin login failed.');
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        addAuditLog('Admin logged out.');
        setActiveTab('overview');
    };

    const value: AppContextState = {
        theme,
        setTheme,
        isAuthenticated,
        login,
        logout,
        auditLogs,
        addAuditLog,
        activeTab,
        setActiveTab
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextState => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
