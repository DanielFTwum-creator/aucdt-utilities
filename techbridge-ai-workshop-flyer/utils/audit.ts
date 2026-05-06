import { AuditLogEntry } from '../types';

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private listeners: (() => void)[] = [];

  log(action: string, details?: string) {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    this.logs.unshift(entry);
    // Keep only last 100 logs
    if (this.logs.length > 100) this.logs.pop();
    this.notify();
    console.log(`[AUDIT] ${action}:`, details || '');
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const auditLogger = new AuditLogger();