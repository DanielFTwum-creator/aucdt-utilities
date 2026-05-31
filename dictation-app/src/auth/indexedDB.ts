/**
 * IndexedDB utility for secure storage of user sessions and tokens
 * Pattern: Standard across all TUC AI tools apps
 */

const DB_NAME = 'tuc-ai-lab';
const DB_VERSION = 1;
const USER_STORE = 'user_session';
const TOKEN_STORE = 'auth_tokens';

interface UserSession {
  id: string;
  username: string;
  email: string;
  timestamp: number;
}

interface AuthToken {
  type: string; // 'id_token', 'access_token'
  value: string;
  expiresAt: number;
}

let db: IDBDatabase | null = null;

export const initDB = async (): Promise<IDBDatabase> => {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(USER_STORE)) {
        database.createObjectStore(USER_STORE);
      }
      if (!database.objectStoreNames.contains(TOKEN_STORE)) {
        database.createObjectStore(TOKEN_STORE);
      }
    };
  });
};

export const setUserSession = async (user: UserSession): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction([USER_STORE], 'readwrite');
    const store = tx.objectStore(USER_STORE);
    const request = store.put(user, 'current');

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getUserSession = async (): Promise<UserSession | null> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction([USER_STORE], 'readonly');
    const store = tx.objectStore(USER_STORE);
    const request = store.get('current');

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

export const clearUserSession = async (): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction([USER_STORE, TOKEN_STORE], 'readwrite');

    const userStore = tx.objectStore(USER_STORE);
    userStore.delete('current');

    const tokenStore = tx.objectStore(TOKEN_STORE);
    tokenStore.clear();

    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
  });
};

export const setAuthToken = async (type: string, token: string, expiresInSeconds: number): Promise<void> => {
  const database = await initDB();
  const expiresAt = Date.now() + (expiresInSeconds * 1000);

  return new Promise((resolve, reject) => {
    const tx = database.transaction([TOKEN_STORE], 'readwrite');
    const store = tx.objectStore(TOKEN_STORE);
    const request = store.put({ type, value: token, expiresAt }, type);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getAuthToken = async (type: string): Promise<string | null> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction([TOKEN_STORE], 'readonly');
    const store = tx.objectStore(TOKEN_STORE);
    const request = store.get(type);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const token = request.result as AuthToken | undefined;
      if (!token) {
        resolve(null);
        return;
      }
      // Check if expired
      if (token.expiresAt < Date.now()) {
        resolve(null);
        return;
      }
      resolve(token.value);
    };
  });
};

export const clearAuthTokens = async (): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction([TOKEN_STORE], 'readwrite');
    const store = tx.objectStore(TOKEN_STORE);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
