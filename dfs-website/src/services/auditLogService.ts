export type AuditLogEntry = {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
};

export const auditLogService = {
  log: (action: string, details?: string) => {
    const logs: AuditLogEntry[] = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]");
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      timestamp: new Date().toISOString(),
      user: "Admin", // In a real app, this would be the logged-in user's email
      details,
    };
    localStorage.setItem("admin_audit_logs", JSON.stringify([newEntry, ...logs].slice(0, 100)));
  },
  getLogs: (): AuditLogEntry[] => {
    return JSON.parse(localStorage.getItem("admin_audit_logs") || "[]");
  },
  clearLogs: () => {
    localStorage.removeItem("admin_audit_logs");
  }
};
