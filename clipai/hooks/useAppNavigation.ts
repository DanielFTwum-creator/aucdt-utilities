import { useState } from 'react';
import { Page, Theme, AuditLogEntry } from '../types';

export const useAppNavigation = () => {
    const [page, setPage] = useState<Page>('main');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
        const savedLog = sessionStorage.getItem('clipai-audit-log');
        return savedLog ? JSON.parse(savedLog) : [];
    });

    const logAdminAction = (action: string) => {
        setAuditLog(prev => {
            const newLog = [...prev, { timestamp: new Date().toISOString(), action }];
            sessionStorage.setItem('clipai-audit-log', JSON.stringify(newLog));
            return newLog;
        });
    };
    
    const handleLoginSuccess = () => {
        setIsAdminAuthenticated(true);
        setPage('adminPanel');
        logAdminAction('Admin logged in.');
    };

    const handleLogout = () => {
        logAdminAction('Admin logged out.');
        setIsAdminAuthenticated(false);
        setPage('main');
    };

    return {
        page,
        setPage,
        isAdminAuthenticated,
        auditLog,
        handleLoginSuccess,
        handleLogout,
        logAdminAction,
    };
};