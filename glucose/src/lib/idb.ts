import { openDB, IDBPDatabase } from 'idb';
import type { ReadingRow, Profile } from './db';

const DB_NAME = 'glucose-backup';
const DB_VERSION = 1;

interface GlucoseDB {
  readings: {
    key: string;
    value: ReadingRow;
    indexes: { 'by-date': string };
  };
  profile: {
    key: string;
    value: Profile & { key: string };
  };
}

let dbPromise: Promise<IDBPDatabase<GlucoseDB>> | null = null;

function getDB(): Promise<IDBPDatabase<GlucoseDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GlucoseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('readings')) {
          const store = db.createObjectStore('readings', { keyPath: 'id' });
          store.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function idbGetAllReadings(): Promise<ReadingRow[]> {
  try {
    const db = await getDB();
    return await db.getAll('readings');
  } catch (e) {
    console.warn('[IDB] getAll failed:', e);
    return [];
  }
}

export async function idbUpsertReading(row: ReadingRow): Promise<void> {
  try {
    const db = await getDB();
    await db.put('readings', row);
  } catch (e) {
    console.warn('[IDB] upsert failed:', e);
  }
}

export async function idbDeleteReading(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('readings', id);
  } catch (e) {
    console.warn('[IDB] delete failed:', e);
  }
}

export async function idbBulkUpsert(rows: ReadingRow[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('readings', 'readwrite');
    await Promise.all([...rows.map(r => tx.store.put(r)), tx.done]);
  } catch (e) {
    console.warn('[IDB] bulk upsert failed:', e);
  }
}

export async function idbGetProfile(): Promise<Profile | undefined> {
  try {
    const db = await getDB();
    const row = await db.get('profile', 'main');
    if (!row) return undefined;
    const { key: _key, ...profile } = row;
    return profile as Profile;
  } catch (e) {
    console.warn('[IDB] getProfile failed:', e);
    return undefined;
  }
}

export async function idbSaveProfile(profile: Profile): Promise<void> {
  try {
    const db = await getDB();
    await db.put('profile', { key: 'main', ...profile });
  } catch (e) {
    console.warn('[IDB] saveProfile failed:', e);
  }
}

export async function idbReadingCount(): Promise<number> {
  try {
    const db = await getDB();
    return await db.count('readings');
  } catch (e) {
    return 0;
  }
}
