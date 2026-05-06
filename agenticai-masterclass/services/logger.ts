import { LogEntry } from '../types';

const LOGS_KEY = 'admin_audit_logs';

export const getLogs = (): LogEntry[] => {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to read logs", e);
    return [];
  }
};

export const logAction = (
  action: string, 
  details: string, 
  category: 'auth' | 'system' | 'user' = 'system',
  user: string = 'system'
) => {
  const entry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    category,
    user
  };
  
  const logs = getLogs();
  // Keep last 500 logs
  const updatedLogs = [entry, ...logs].slice(0, 500);
  
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error("Failed to save log", e);
  }
};

export const clearLogs = () => {
    localStorage.removeItem(LOGS_KEY);
    logAction('CLEAR_LOGS', 'Audit logs cleared by admin', 'system', 'admin');
}