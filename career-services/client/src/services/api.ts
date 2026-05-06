const BASE = '/api';

export interface JobPosting {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  salary_range: string;
  job_description: string;
  posting_date: string;
  deadline_date: string;
  status: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_posting_id: string;
  applicant_name: string;
  applicant_email: string;
  resume_url: string;
  application_date: string;
  application_status: string;
  interview_date: string;
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

// Job Postings
export const getJobPostings = () =>
  request<JobPosting[]>(`${BASE}/job-postings`);

export const createJobPosting = (data: Omit<JobPosting, 'id' | 'created_at'>) =>
  request<JobPosting>(`${BASE}/job-postings`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateJobPosting = (id: string, data: Omit<JobPosting, 'id' | 'created_at'>) =>
  request<JobPosting>(`${BASE}/job-postings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteJobPosting = (id: string) =>
  request<{ success: boolean }>(`${BASE}/job-postings/${id}`, { method: 'DELETE' });

// Job Applications
export const getJobApplications = () =>
  request<JobApplication[]>(`${BASE}/job-applications`);

export const createJobApplication = (data: Omit<JobApplication, 'id' | 'created_at'>) =>
  request<JobApplication>(`${BASE}/job-applications`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateJobApplication = (id: string, data: Omit<JobApplication, 'id' | 'created_at'>) =>
  request<JobApplication>(`${BASE}/job-applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteJobApplication = (id: string) =>
  request<{ success: boolean }>(`${BASE}/job-applications/${id}`, { method: 'DELETE' });
