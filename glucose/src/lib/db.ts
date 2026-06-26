import {
  idbGetAllReadings,
  idbUpsertReading,
  idbDeleteReading,
  idbBulkUpsert,
  idbGetProfile,
  idbSaveProfile,
} from './idb';

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
  doctorPhone: string;
  doctorCountry: string;
  updatedAt: number;
}

export const getAdminConfig = async (key: string) => {
  const res = await fetch(`/api/config/${key}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return data.value;
};

export const setAdminConfig = async (key: string, value: any) => {
  await fetch(`/api/config/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
};

export const addAuditLog = async (action: string, details?: string) => {
  await fetch('/api/audit-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, details }),
  });
};

export const getAuditLog = async (): Promise<AuditLogEntry[]> => {
  const res = await fetch('/api/audit-logs');
  if (!res.ok) return [];
  const logs = await res.json();
  return logs;
};

export const getAllReadings = async (): Promise<ReadingRow[]> => {
  try {
    const res = await fetch('/api/readings');
    if (!res.ok) throw new Error(`API ${res.status}`);
    const allReadings: ReadingRow[] = await res.json();
    console.log('[DB] getAllReadings returned', allReadings.length, 'readings from API');
    // Mirror to IndexedDB on every successful load (keeps backup fresh)
    idbBulkUpsert(allReadings).catch(() => {});
    return allReadings;
  } catch (err) {
    console.warn('[DB] API unreachable, falling back to IndexedDB:', err);
    const cached = await idbGetAllReadings();
    console.log('[DB] IndexedDB fallback returned', cached.length, 'readings');
    return cached;
  }
};

export const upsertReading = async (row: ReadingRow): Promise<void> => {
  console.log('[DB] Upserting reading:', row.id, 'date:', row.date, 'fasting:', row.fasting);
  const res = await fetch('/api/readings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error('Failed to upsert reading');
  }
  // Mirror to IndexedDB after confirmed server write
  idbUpsertReading(row).catch(() => {});
};

export const deleteReading = async (id: string): Promise<void> => {
  const res = await fetch(`/api/readings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete reading');
  }
  // Mirror deletion to IndexedDB
  idbDeleteReading(id).catch(() => {});
};

export const batchUpsertReadings = async (rows: ReadingRow[]): Promise<void> => {
  console.log('[DB] batchUpsertReadings starting with', rows.length, 'rows');
  const res = await fetch('/api/readings/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ readings: rows }),
  });
  if (!res.ok) {
    let errMsg = 'Failed to batch upsert readings';
    try {
      const data = await res.json();
      if (data && data.error) {
        errMsg = `Batch upsert failed: ${data.error}`;
      }
    } catch (e) {}
    throw new Error(errMsg);
  }
  // Mirror to IndexedDB after confirmed server write
  idbBulkUpsert(rows).catch(() => {});
};

export const getProfile = async (): Promise<Profile | undefined> => {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const profile = data || undefined;
    if (profile) idbSaveProfile(profile).catch(() => {});
    return profile;
  } catch (err) {
    console.warn('[DB] Profile API unreachable, falling back to IndexedDB:', err);
    return idbGetProfile();
  }
};

export const saveProfile = async (data: Omit<Profile, 'updatedAt'>): Promise<void> => {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to save profile');
  }
  const withTimestamp: Profile = { ...data, updatedAt: Date.now() };
  idbSaveProfile(withTimestamp).catch(() => {});
};
