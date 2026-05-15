import { openDB } from 'idb';

const DB_NAME = 'RopheSugarLogger_DB';
const DB_VERSION = 2;

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface ReadingRow {
  id: string;
  date: string;
  fasting: string;
  post_breakfast: string;
  pre_lunch: string;
  post_lunch: string;
  pre_dinner: string;
  post_dinner: string;
  createdAt: number;
  updatedAt: number;
}

export interface Profile {
  patientName: string;
  doctorName: string;
  updatedAt: number;
}

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('adminConfig')) {
        db.createObjectStore('adminConfig');
      }
      if (!db.objectStoreNames.contains('auditLogs')) {
        db.createObjectStore('auditLogs', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('readings')) {
        db.createObjectStore('readings', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile');
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

export const getAllReadings = async (): Promise<ReadingRow[]> => {
  const db = await initDB();
  return db.getAll('readings');
};

export const upsertReading = async (row: ReadingRow): Promise<void> => {
  const db = await initDB();
  await db.put('readings', row);
};

export const deleteReading = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('readings', id);
};

export const batchUpsertReadings = async (rows: ReadingRow[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('readings', 'readwrite');
  for (const row of rows) {
    tx.store.put(row);
  }
  await tx.done;
};

export const getProfile = async (): Promise<Profile | undefined> => {
  const db = await initDB();
  return db.get('profile', 'main');
};

export const saveProfile = async (data: Omit<Profile, 'updatedAt'>): Promise<void> => {
  const db = await initDB();
  await db.put('profile', { ...data, updatedAt: Date.now() }, 'main');
};
