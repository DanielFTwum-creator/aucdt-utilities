const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface HealthRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  age: number;
  blood_type: string;
  medical_history: string;
  allergies: string;
  last_checkup_date: string;
  created_at: string;
}

export const healthRecordsApi = {
  list: () => request<HealthRecord[]>('/health-records'),
  create: (data: Omit<HealthRecord, 'id' | 'created_at'>) =>
    request<{ id: string }>('/health-records', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<HealthRecord, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/health-records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/health-records/${id}`, { method: 'DELETE' }),
};

export interface Appointment {
  id: string;
  health_record_id: string;
  appointment_date: string;
  doctor_name: string;
  department: string;
  reason_for_visit: string;
  status: string;
  notes: string;
  created_at: string;
}

export const appointmentsApi = {
  list: () => request<Appointment[]>('/appointments'),
  create: (data: Omit<Appointment, 'id' | 'created_at'>) =>
    request<{ id: string }>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<Appointment, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/appointments/${id}`, { method: 'DELETE' }),
};
