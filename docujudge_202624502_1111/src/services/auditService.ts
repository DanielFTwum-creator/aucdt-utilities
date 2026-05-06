export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  user?: string;
}

const STORAGE_KEY = 'docujudge-audit-logs';

export const auditService = {
  log: (action: string, details: string, user: string = 'system') => {
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
      details,
      user,
    };
    logs.unshift(newLog);
    // Keep only last 1000 logs
    if (logs.length > 1000) logs.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  getLogs: (): AuditLog[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
