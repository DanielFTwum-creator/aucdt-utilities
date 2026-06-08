/**
 * IndexedDB-backed persistence with a synchronous in-memory cache.
 *
 * Why this shape: the app reads persisted data synchronously in many places
 * (audit log, step codes, theme). IndexedDB is async, so we hydrate the whole
 * key set into an in-memory cache once at startup (initStore), then serve reads
 * synchronously from the cache and write through to IndexedDB asynchronously.
 *
 * Migration: on first run the existing localStorage values are imported into
 * IndexedDB (one-time), so no user data is lost moving off localStorage.
 * If IndexedDB is unavailable, we transparently fall back to localStorage.
 */

const DB_NAME = 'tsapro';
const DB_VERSION = 1;
const STORE = 'kv';

// Keys previously held in localStorage that must be migrated/persisted.
const MIGRATION_KEYS = ['tuc-salary-step-codes', 'tuc-salary-theme', 'tuc-salary-audit-log'];

let cache: Record<string, unknown> = {};
let db: IDBDatabase | null = null;
let usingFallback = false;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function readAll(database: IDBDatabase): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const out: Record<string, unknown> = {};
    const tx = database.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) { out[cursor.key as string] = cursor.value; cursor.continue(); }
      else resolve(out);
    };
    req.onerror = () => reject(req.error);
  });
}

function idbPut(key: string, value: unknown): void {
  if (!db) return;
  try { db.transaction(STORE, 'readwrite').objectStore(STORE).put(value, key); }
  catch (e) { console.error('persistentStore: put failed', e); }
}

function idbDelete(key: string): void {
  if (!db) return;
  try { db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key); }
  catch (e) { console.error('persistentStore: delete failed', e); }
}

/** Hydrate the cache and run the one-time localStorage → IndexedDB migration. Call once before render. */
export async function initStore(): Promise<void> {
  try {
    db = await open();
    cache = await readAll(db);
    // One-time import: any legacy localStorage value not yet in IndexedDB is migrated.
    for (const key of MIGRATION_KEYS) {
      if (cache[key] === undefined) {
        const raw = window.localStorage.getItem(key);
        if (raw != null) {
          let parsed: unknown;
          try { parsed = JSON.parse(raw); } catch { parsed = raw; }
          cache[key] = parsed;
          idbPut(key, parsed);
        }
      }
    }
  } catch (e) {
    console.error('persistentStore: IndexedDB unavailable, falling back to localStorage', e);
    usingFallback = true;
  }
}

export function getItem<T>(key: string, fallback: T): T {
  if (usingFallback) {
    try { const raw = window.localStorage.getItem(key); return raw != null ? (JSON.parse(raw) as T) : fallback; }
    catch { return fallback; }
  }
  return (cache[key] === undefined ? fallback : (cache[key] as T));
}

export function setItem<T>(key: string, value: T): void {
  if (usingFallback) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
    return;
  }
  cache[key] = value;
  idbPut(key, value);
}

export function removeItem(key: string): void {
  if (usingFallback) {
    try { window.localStorage.removeItem(key); } catch (e) { console.error(e); }
    return;
  }
  delete cache[key];
  idbDelete(key);
}
