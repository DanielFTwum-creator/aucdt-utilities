
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'TUC_Blueprint_DB';
const DB_VERSION = 1;

export interface ProjectState {
  id: string;
  projectName: string;
  timestamp: number;
  checkedItems: Record<string, boolean>;
  openPhase: number | null;
  activeTab: string;
}

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('history')) {
        db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
};

export const saveProjectSnapshot = async (state: ProjectState) => {
  const db = await initDB();
  return db.add('history', {
    ...state,
    timestamp: Date.now()
  });
};

export const getProjectHistory = async () => {
  const db = await initDB();
  return db.getAll('history');
};

export const saveLastState = async (state: Partial<ProjectState>) => {
  const db = await initDB();
  return db.put('settings', { key: 'last_state', value: state });
};

export const getLastState = async () => {
  const db = await initDB();
  const entry = await db.get('settings', 'last_state');
  return entry ? entry.value : null;
};
