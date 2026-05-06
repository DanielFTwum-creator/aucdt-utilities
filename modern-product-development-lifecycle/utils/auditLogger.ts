export interface AuditLog {
    timestamp: string;
    action: string;
}

const LOG_KEY = 'pdl-audit-log';

/**
 * Logs an administrative action to localStorage.
 * @param action - A description of the action performed.
 */
export const logAdminAction = (action: string): void => {
    try {
        const logs = getAdminLogs();
        const newLog: AuditLog = {
            timestamp: new Date().toISOString(),
            action,
        };
        logs.unshift(newLog); // Add new log to the beginning
        localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 100))); // Cap logs at 100 entries
    } catch (error) {
        console.error('Failed to write to audit log:', error);
    }
};

/**
 * Retrieves all admin logs from localStorage.
 * @returns An array of AuditLog objects.
 */
export const getAdminLogs = (): AuditLog[] => {
    try {
        const logsJson = localStorage.getItem(LOG_KEY);
        return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
        console.error('Failed to read from audit log:', error);
        return [];
    }
};
