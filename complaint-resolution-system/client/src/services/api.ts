const BASE = '/api';

export interface Complaint {
  id: string;
  complainant_name: string;
  contact_email: string;
  complaint_category: string;
  complaint_description: string;
  severity_level: string;
  complaint_date: string;
  status: string;
  created_at: string;
}

export interface Resolution {
  id: string;
  complaint_id: string;
  assigned_officer: string;
  resolution_plan: string;
  resolution_date: string;
  outcome: string;
  satisfaction_rating: number | null;
  resolution_notes: string;
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

// Complaints
export const getComplaints = () =>
  request<Complaint[]>(`${BASE}/complaints`);

export const createComplaint = (data: Omit<Complaint, 'id' | 'created_at'>) =>
  request<Complaint>(`${BASE}/complaints`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateComplaint = (id: string, data: Omit<Complaint, 'id' | 'created_at'>) =>
  request<Complaint>(`${BASE}/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteComplaint = (id: string) =>
  request<{ success: boolean }>(`${BASE}/complaints/${id}`, { method: 'DELETE' });

// Resolutions
export const getResolutions = () =>
  request<Resolution[]>(`${BASE}/resolutions`);

export const createResolution = (data: Omit<Resolution, 'id' | 'created_at'>) =>
  request<Resolution>(`${BASE}/resolutions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateResolution = (id: string, data: Omit<Resolution, 'id' | 'created_at'>) =>
  request<Resolution>(`${BASE}/resolutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteResolution = (id: string) =>
  request<{ success: boolean }>(`${BASE}/resolutions/${id}`, { method: 'DELETE' });
