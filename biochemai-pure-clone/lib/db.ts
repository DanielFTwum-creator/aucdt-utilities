import { openDB } from 'idb';
import { AuditLogEntry } from '../types';

const DB_NAME = 'BioChemAI_DB';
const DB_VERSION = 2;

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('adminConfig')) {
        db.createObjectStore('adminConfig');
      }
      if (!db.objectStoreNames.contains('auditLogs')) {
        db.createObjectStore('auditLogs', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('userSessions')) {
        const sessionStore = db.createObjectStore('userSessions', { keyPath: 'id' });
        sessionStore.createIndex('email', 'email', { unique: true });
        sessionStore.createIndex('expiresAt', 'expiresAt');
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

/**
 * User Session Management — IndexedDB persistence
 * Sessions expire after 7 days of inactivity
 */
export const saveUserSession = async (email: string, name?: string): Promise<UserSession> => {
  const db = await initDB();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session: UserSession = {
    id: `session-${Date.now()}`,
    email,
    name,
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await db.put('userSessions', session);
  await addAuditLog('User Session Created', `Session created for ${email}`);
  return session;
};

export const getUserSession = async (email: string): Promise<UserSession | undefined> => {
  const db = await initDB();
  const index = db.transaction('userSessions').store.index('email');
  const session = await index.get(email);

  if (session && new Date(session.expiresAt) > new Date()) {
    return session;
  }

  if (session) {
    await deleteUserSession(email);
  }
  return undefined;
};

export const updateUserSessionActivity = async (email: string): Promise<void> => {
  const db = await initDB();
  const session = await getUserSession(email);

  if (session) {
    session.lastActiveAt = new Date().toISOString();
    await db.put('userSessions', session);
  }
};

export const deleteUserSession = async (email: string): Promise<void> => {
  const db = await initDB();
  const index = db.transaction('userSessions').store.index('email');
  const session = await index.get(email);

  if (session) {
    await db.delete('userSessions', session.id);
    await addAuditLog('User Session Deleted', `Session removed for ${email}`);
  }
};

export const cleanupExpiredSessions = async (): Promise<number> => {
  const db = await initDB();
  const allSessions = await db.getAll('userSessions');
  const now = new Date();
  let cleanedCount = 0;

  for (const session of allSessions) {
    if (new Date(session.expiresAt) <= now) {
      await db.delete('userSessions', session.id);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    await addAuditLog('Session Cleanup', `${cleanedCount} expired sessions removed`);
  }

  return cleanedCount;
};

export const getAllUserSessions = async (): Promise<UserSession[]> => {
  const db = await initDB();
  const allSessions = await db.getAll('userSessions');
  return allSessions.filter(s => new Date(s.expiresAt) > new Date()).reverse();
};
