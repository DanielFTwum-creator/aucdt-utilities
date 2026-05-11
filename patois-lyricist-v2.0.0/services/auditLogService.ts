
export interface AuditEntry {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: Record<string, any>;
    metadata: {
        userAgent: string;
        resolution: string;
        timezone: string;
        language: string;
    };
}

const LOG_KEY = 'patoisLyricistAuditLog';
const MAX_LOG_ENTRIES = 500;

export const getLogs = (): AuditEntry[] => {
    try {
        const logs = localStorage.getItem(LOG_KEY);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error("Failed to parse audit logs", error);
        return [];
    }
};

export const logAction = (user: string, action: string, details: Record<string, any>): void => {
    const logs = getLogs();
    const newEntry: AuditEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        user,
        action,
        details,
        metadata: {
            userAgent: navigator.userAgent,
            resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        }
    };
    logs.push(newEntry);
    const trimmedLogs = logs.slice(-MAX_LOG_ENTRIES);
    try {
        localStorage.setItem(LOG_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
        console.error("Failed to save audit log", error);
    }
};

export const exportLogsToCSV = () => {
    const logs = getLogs();
    if (logs.length === 0) return;

    const headers = ["ID", "Timestamp", "User", "Action", "Details", "User Agent", "Resolution", "Timezone", "Language"];
    const rows = logs.map(log => [
        log.id,
        log.timestamp,
        log.user,
        log.action,
        JSON.stringify(log.details).replace(/"/g, '""'),
        log.metadata.userAgent.replace(/"/g, '""'),
        log.metadata.resolution,
        log.metadata.timezone,
        log.metadata.language
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_log_SOC2_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
