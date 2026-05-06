const BASE = '/api';

export interface AlumniProfile {
  id: string;
  alumni_name: string;
  graduation_year: number | null;
  current_job_title: string;
  company: string;
  location: string;
  bio: string;
  profile_verified: boolean;
  created_at: string;
}

export interface AlumniConnection {
  id: string;
  alumni_id_1: string;
  alumni_id_2: string;
  connection_date: string;
  connection_strength: string;
  shared_interests: string;
  created_at: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json() as Promise<T>;
}

// Alumni Profiles
export const getAlumniProfiles = () =>
  request<AlumniProfile[]>(`${BASE}/alumni-profiles`);

export const createAlumniProfile = (data: Omit<AlumniProfile, 'id' | 'created_at'>) =>
  request<AlumniProfile>(`${BASE}/alumni-profiles`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAlumniProfile = (id: string, data: Omit<AlumniProfile, 'id' | 'created_at'>) =>
  request<AlumniProfile>(`${BASE}/alumni-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteAlumniProfile = (id: string) =>
  request<{ success: boolean }>(`${BASE}/alumni-profiles/${id}`, { method: 'DELETE' });

// Alumni Connections
export const getAlumniConnections = () =>
  request<AlumniConnection[]>(`${BASE}/alumni-connections`);

export const createAlumniConnection = (data: Omit<AlumniConnection, 'id' | 'created_at'>) =>
  request<AlumniConnection>(`${BASE}/alumni-connections`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAlumniConnection = (id: string, data: Omit<AlumniConnection, 'id' | 'created_at'>) =>
  request<AlumniConnection>(`${BASE}/alumni-connections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteAlumniConnection = (id: string) =>
  request<{ success: boolean }>(`${BASE}/alumni-connections/${id}`, { method: 'DELETE' });
