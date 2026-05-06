import { SystemLog } from '../types';
import { CURRENT_USER } from '../constants';

const STORAGE_KEY = 'tmcp-audit-logs';
const MAX_LOGS = 50;

class AuditService {
  private logs: SystemLog[] = [];
  private listeners: ((logs: SystemLog[]) => void)[] = [];

  constructor() {
    this.loadLogs();
    // Initial boot log
    this.log('INFO', 'System Service Started', 'System');
  }

  private loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load audit logs', e);
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      // Keep only last N logs to prevent storage overflow
      const trimmedLogs = this.logs.slice(0, MAX_LOGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (e) {
      console.warn('Failed to save audit logs', e);
    }
  }

  log(level: 'INFO' | 'WARN' | 'ERROR', message: string, user: string = CURRENT_USER.name) {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      user
    };
    this.logs.unshift(newLog); // Prepend
    this.saveLogs();
    this.notify();
  }

  getLogs(): SystemLog[] {
    return this.logs;
  }

  subscribe(listener: (logs: SystemLog[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.logs));
  }
  
  clearLogs() {
      this.logs = [];
      this.saveLogs();
      this.notify();
  }
}

export const auditService = new AuditService();