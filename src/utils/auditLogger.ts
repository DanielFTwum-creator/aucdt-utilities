export interface AuditLog {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
  category: 'auth' | 'config' | 'security' | 'system'
  severity: 'info' | 'warning' | 'critical'
}

class AuditLogger {
  private logs: AuditLog[] = []
  private readonly STORAGE_KEY = 'audit_logs'
  private readonly MAX_LOGS = 1000

  constructor() {
    this.loadLogs()
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.logs = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error)
      this.logs = []
    }
  }

  private saveLogs() {
    try {
      // Keep only the most recent logs
      if (this.logs.length > this.MAX_LOGS) {
        this.logs = this.logs.slice(-this.MAX_LOGS)
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs))
    } catch (error) {
      console.error('Failed to save audit logs:', error)
    }
  }

  log(
    action: string,
    details: string,
    category: AuditLog['category'] = 'system',
    severity: AuditLog['severity'] = 'info'
  ) {
    const log: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      user: 'admin', // In a real app, this would come from auth context
      details,
      category,
      severity
    }

    this.logs.push(log)
    this.saveLogs()

    // Also log to console for development
    console.log(`[AUDIT ${severity.toUpperCase()}] ${action}:`, details)

    return log
  }

  getLogs(filter?: {
    category?: AuditLog['category']
    severity?: AuditLog['severity']
    limit?: number
  }): AuditLog[] {
    let filtered = [...this.logs]

    if (filter?.category) {
      filtered = filtered.filter(log => log.category === filter.category)
    }

    if (filter?.severity) {
      filtered = filtered.filter(log => log.severity === filter.severity)
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit)
    }

    return filtered.reverse() // Most recent first
  }

  clearLogs() {
    this.log('clear_logs', 'All audit logs cleared', 'system', 'warning')
    const lastLog = this.logs[this.logs.length - 1]
    this.logs = [lastLog] // Keep the clear action itself
    this.saveLogs()
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const auditLogger = new AuditLogger()
