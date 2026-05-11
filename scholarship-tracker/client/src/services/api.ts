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

// Scholarships
export const getScholarships = () => request<Scholarship[]>('/scholarships');
export const createScholarship = (data: Partial<Scholarship>) =>
  request<Scholarship>('/scholarships', { method: 'POST', body: JSON.stringify(data) });
export const updateScholarship = (id: string, data: Partial<Scholarship>) =>
  request<Scholarship>(`/scholarships/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteScholarship = (id: string) =>
  request<{ message: string }>(`/scholarships/${id}`, { method: 'DELETE' });

// Scholarship Applications
export const getApplications = () => request<ScholarshipApplication[]>('/scholarship-applications');
export const createApplication = (data: Partial<ScholarshipApplication>) =>
  request<ScholarshipApplication>('/scholarship-applications', { method: 'POST', body: JSON.stringify(data) });
export const updateApplication = (id: string, data: Partial<ScholarshipApplication>) =>
  request<ScholarshipApplication>(`/scholarship-applications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteApplication = (id: string) =>
  request<{ message: string }>(`/scholarship-applications/${id}`, { method: 'DELETE' });

export interface Scholarship {
  id: string;
  scholarship_name: string;
  award_amount: number;
  eligibility_criteria: string;
  deadline_date: string;
  provider: string;
  status: string;
  created_at: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarship_id: string;
  applicant_name: string;
  gpa: number;
  application_date: string;
  approval_status: string;
  amount_awarded: number;
  created_at: string;
}
