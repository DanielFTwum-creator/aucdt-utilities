export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

const LOG_KEY = 'admin_audit_logs';

export const Logger = {
  log: (action: string, details: string, user: string = 'admin') => {
    const logs = Logger.getLogs();
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user
    };
    logs.unshift(newLog);
    // Keep only last 100 logs
    if (logs.length > 100) logs.pop();
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  },

  getLogs: (): LogEntry[] => {
    const stored = localStorage.getItem(LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  clearLogs: () => {
    localStorage.removeItem(LOG_KEY);
  }
};
