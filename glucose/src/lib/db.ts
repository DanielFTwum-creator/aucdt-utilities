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
  const res = await fetch('/api/readings');
  if (!res.ok) return [];
  const allReadings = await res.json();
  console.log('[DB] getAllReadings returned', allReadings.length, 'readings');
  return allReadings;
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
};

export const deleteReading = async (id: string): Promise<void> => {
  const res = await fetch(`/api/readings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete reading');
  }
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
};

export const getProfile = async (): Promise<Profile | undefined> => {
  const res = await fetch('/api/profile');
  if (!res.ok) return undefined;
  const data = await res.json();
  return data || undefined;
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
};
