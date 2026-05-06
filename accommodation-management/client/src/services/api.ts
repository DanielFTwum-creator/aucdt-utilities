const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Hostels
export interface Hostel {
  id: string;
  hostel_name: string;
  location: string;
  total_rooms: number;
  occupied_rooms: number;
  gender_type: string;
  warden_name: string;
  status: string;
  created_at: string;
}

export const hostelsApi = {
  list: () => request<Hostel[]>('/hostels'),
  create: (data: Omit<Hostel, 'id' | 'created_at'>) =>
    request<{ id: string }>('/hostels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<Hostel, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/hostels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/hostels/${id}`, { method: 'DELETE' }),
};

// Room Assignments
export interface RoomAssignment {
  id: string;
  hostel_id: string;
  room_number: string;
  student_id: string;
  student_name: string;
  check_in_date: string;
  check_out_date: string;
  room_condition: string;
  assignment_status: string;
  created_at: string;
}

export const assignmentsApi = {
  list: () => request<RoomAssignment[]>('/room-assignments'),
  create: (data: Omit<RoomAssignment, 'id' | 'created_at'>) =>
    request<{ id: string }>('/room-assignments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<RoomAssignment, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/room-assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/room-assignments/${id}`, { method: 'DELETE' }),
};
