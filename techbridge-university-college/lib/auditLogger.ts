export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

const STORAGE_KEY = 'aucdt_audit_logs';

export const logAction = (action: string, details: string, user: string = 'Admin') => {
  const newLog: AuditLogEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user,
  };

  const existingLogs = getLogs();
  const updatedLogs = [newLog, ...existingLogs];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error("Failed to save audit log", e);
  }
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
  logAction('CLEAR_LOGS', 'Audit logs cleared by administrator');
};