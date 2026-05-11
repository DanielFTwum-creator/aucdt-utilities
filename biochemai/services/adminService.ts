import { AuditLogEntry } from '../types';
import { LOCAL_STORAGE_KEYS, DEFAULT_ADMIN_PASSWORD } from '../constants';

const getPassword = (): string => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.adminPassword) || DEFAULT_ADMIN_PASSWORD;
  } catch (e) {
    console.error("Failed to access localStorage", e);
    return DEFAULT_ADMIN_PASSWORD;
  }
};

const setPassword = (newPassword: string): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.adminPassword, newPassword);
  } catch (e) {
    console.error("Failed to access localStorage", e);
  }
};

export const getAuditLog = (): AuditLogEntry[] => {
    try {
        const logs = localStorage.getItem(LOCAL_STORAGE_KEYS.auditLog);
        return logs ? JSON.parse(logs) : [];
    } catch (e) {
        console.error("Failed to parse audit log from localStorage", e);
        return [];
    }
};

export const logAction = (action: string, details?: string): void => {
    try {
        const logs = getAuditLog();
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action,
            details,
        };
        logs.unshift(newLog); // Add to the top
        // Keep only the last 100 logs
        const trimmedLogs = logs.slice(0, 100);
        localStorage.setItem(LOCAL_STORAGE_KEYS.auditLog, JSON.stringify(trimmedLogs));
    } catch (e) {
        console.error("Failed to write to audit log in localStorage", e);
    }
};

export const getQuizQuestionCount = (): number => {
  try {
    const count = localStorage.getItem(LOCAL_STORAGE_KEYS.quizQuestionCount);
    return count ? parseInt(count, 10) : 5; // Default to 5
  } catch (e) {
    console.error("Failed to access localStorage", e);
    return 5;
  }
};

export const setQuizQuestionCount = (count: number): void => {
  try {
    if (count >= 1 && count <= 20) { // Basic validation
      localStorage.setItem(LOCAL_STORAGE_KEYS.quizQuestionCount, String(count));
      logAction('Quiz Settings Changed', `Default question count set to ${count}.`);
    }
  } catch (e) {
    console.error("Failed to access localStorage", e);
  }
};

export const verifyPassword = (password: string): boolean => {
    const isCorrect = password === getPassword();
    if (isCorrect) {
        logAction('Admin Login', 'Successful login.');
    } else {
        logAction('Admin Login Attempt', 'Failed login attempt.');
    }
    return isCorrect;
};

export const changePassword = (oldPass: string, newPass: string): { success: boolean, message: string } => {
    if (oldPass !== getPassword()) {
        logAction('Password Change Attempt', 'Failed: Incorrect old password.');
        return { success: false, message: "Incorrect old password." };
    }
    if (newPass.length < 8) {
        logAction('Password Change Attempt', 'Failed: New password too short.');
        return { success: false, message: "New password must be at least 8 characters." };
    }
    setPassword(newPass);
    logAction('Password Changed', 'Administrator password was successfully changed.');
    return { success: true, message: "Password changed successfully." };
};

// Initialize with a log if it's the first run
if (getAuditLog().length === 0) {
    logAction('System Initialized', 'First audit log entry created.');
}