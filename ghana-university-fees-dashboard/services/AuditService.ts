const LOG_KEY = 'tuc_fees_audit_logs';

export interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

const AuditService = {
    log: (action: string, details: string, type: AuditLog['type'] = 'INFO') => {
        const logs = AuditService.getLogs();
        const newLog: AuditLog = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            action,
            details,
            type
        };
        logs.unshift(newLog);
        // Keep only last 100 logs
        localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 100)));
        console.log(`[FEES_AUDIT] ${action}: ${details}`);
    },

    getLogs: (): AuditLog[] => {
        const saved = localStorage.getItem(LOG_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    clearLogs: () => {
        localStorage.removeItem(LOG_KEY);
        AuditService.log('LOGS_CLEARED', 'Institutional fees audit trail purged by admin', 'WARNING');
    }
};

export default AuditService;
