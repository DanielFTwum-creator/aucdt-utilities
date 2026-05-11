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

// Mentors
export const getMentors = () => request<Mentor[]>('/mentors');
export const getMentor = (id: string) => request<Mentor>(`/mentors/${id}`);
export const createMentor = (data: Partial<Mentor>) =>
  request<Mentor>('/mentors', { method: 'POST', body: JSON.stringify(data) });
export const updateMentor = (id: string, data: Partial<Mentor>) =>
  request<Mentor>(`/mentors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMentor = (id: string) =>
  request<{ message: string }>(`/mentors/${id}`, { method: 'DELETE' });

// Mentees
export const getMentees = () => request<Mentee[]>('/mentees');
export const getMentee = (id: string) => request<Mentee>(`/mentees/${id}`);
export const createMentee = (data: Partial<Mentee>) =>
  request<Mentee>('/mentees', { method: 'POST', body: JSON.stringify(data) });
export const updateMentee = (id: string, data: Partial<Mentee>) =>
  request<Mentee>(`/mentees/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMentee = (id: string) =>
  request<{ message: string }>(`/mentees/${id}`, { method: 'DELETE' });

export interface Mentor {
  id: string;
  mentor_name: string;
  expertise_area: string;
  years_experience: number | null;
  bio: string | null;
  availability: string | null;
  max_mentees: number | null;
  current_mentees: number;
  rating: number | null;
  created_at: string;
}

export interface Mentee {
  id: string;
  mentor_id: string;
  mentee_name: string;
  learning_goals: string | null;
  matching_date: string | null;
  progress_score: number;
  meeting_frequency: string | null;
  program_status: string;
  created_at: string;
}
