export interface AuditLog {
    timestamp: string;
    action: string;
}

export const getAuditLogs = (): AuditLog[] => {
    try {
        const logs = localStorage.getItem('techbridge_auditLog');
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error("Failed to parse audit logs:", error);
        return [];
    }
};

export const logAction = (action: string) => {
    const logs = getAuditLogs();
    const newLog = { timestamp: new Date().toISOString(), action };
    logs.push(newLog);
    localStorage.setItem('techbridge_auditLog', JSON.stringify(logs));
};
