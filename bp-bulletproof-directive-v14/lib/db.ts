import { openDB } from 'idb';

const DB_NAME = 'ComplianceDashboardDB';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('auditLogs')) {
        db.createObjectStore('auditLogs', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('adminConfig')) {
        db.createObjectStore('adminConfig');
      }
    },
  });
};

export const addAuditLog = async (action: string, details: any) => {
  const db = await initDB();
  await db.add('auditLogs', { action, details, timestamp: new Date().toISOString() });
};

export const getAdminConfig = async (key: string) => {
  const db = await initDB();
  return db.get('adminConfig', key);
};

export const setAdminConfig = async (key: string, value: any) => {
  const db = await initDB();
  await db.put('adminConfig', value, key);
};
