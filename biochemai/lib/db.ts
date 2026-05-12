import { openDB } from 'idb';
import { AuditLogEntry } from '../types';

const DB_NAME = 'BioChemAI_DB';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('adminConfig')) {
        db.createObjectStore('adminConfig');
      }
      if (!db.objectStoreNames.contains('auditLogs')) {
        db.createObjectStore('auditLogs', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const getAdminConfig = async (key: string) => {
  const db = await initDB();
  return db.get('adminConfig', key);
};

export const setAdminConfig = async (key: string, value: any) => {
  const db = await initDB();
  await db.put('adminConfig', value, key);
};

export const addAuditLog = async (action: string, details?: string) => {
  const db = await initDB();
  const entry: AuditLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    details: details || '',
  };
  await db.add('auditLogs', entry);
};

export const getAuditLog = async (): Promise<AuditLogEntry[]> => {
  const db = await initDB();
  const allLogs = await db.getAll('auditLogs');
  return allLogs.reverse();
};

export const getQuizQuestionCount = async (): Promise<number> => {
  const count = await getAdminConfig('quizQuestionCount');
  return count ?? 5;
};

export const setQuizQuestionCount = async (count: number): Promise<void> => {
  if (count >= 1 && count <= 20) {
    await setAdminConfig('quizQuestionCount', count);
    await addAuditLog('Quiz Settings Changed', `Default question count set to ${count}.`);
  }
};
