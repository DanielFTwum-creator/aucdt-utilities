const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Coaching Sessions
export const getCoachingSessions = () => request<CoachingSession[]>('/coaching-sessions');
export const createCoachingSession = (data: Partial<CoachingSession>) =>
  request<CoachingSession>('/coaching-sessions', { method: 'POST', body: JSON.stringify(data) });
export const updateCoachingSession = (id: string, data: Partial<CoachingSession>) =>
  request<CoachingSession>(`/coaching-sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCoachingSession = (id: string) =>
  request<{ message: string }>(`/coaching-sessions/${id}`, { method: 'DELETE' });

// Progress Tracking
export const getProgressRecords = () => request<ProgressRecord[]>('/progress-tracking');
export const createProgressRecord = (data: Partial<ProgressRecord>) =>
  request<ProgressRecord>('/progress-tracking', { method: 'POST', body: JSON.stringify(data) });
export const updateProgressRecord = (id: string, data: Partial<ProgressRecord>) =>
  request<ProgressRecord>(`/progress-tracking/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProgressRecord = (id: string) =>
  request<{ message: string }>(`/progress-tracking/${id}`, { method: 'DELETE' });

export interface CoachingSession {
  id: string;
  student_id: string;
  coach_name: string;
  session_date: string;
  session_topic: string;
  duration_minutes: number;
  focus_area: string;
  status: string;
  created_at: string;
}

export interface ProgressRecord {
  id: string;
  student_id: string;
  coaching_session_id: string;
  gpa: number;
  attendance_rate: number;
  assignment_completion: number;
  improvement_score: number;
  notes: string;
  created_at: string;
}
