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

// Questions
export const getQuestions = () => request<Question[]>('/questions');
export const createQuestion = (data: Partial<Question>) =>
  request<Question>('/questions', { method: 'POST', body: JSON.stringify(data) });
export const updateQuestion = (id: string, data: Partial<Question>) =>
  request<Question>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteQuestion = (id: string) =>
  request<{ message: string }>(`/questions/${id}`, { method: 'DELETE' });

// Answers
export const getAnswers = () => request<Answer[]>('/answers');
export const createAnswer = (data: Partial<Answer>) =>
  request<Answer>('/answers', { method: 'POST', body: JSON.stringify(data) });
export const updateAnswer = (id: string, data: Partial<Answer>) =>
  request<Answer>(`/answers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAnswer = (id: string) =>
  request<{ message: string }>(`/answers/${id}`, { method: 'DELETE' });

export interface Question {
  id: string;
  test_section: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface Answer {
  id: string;
  question_id: string;
  student_id: string;
  answer_text: string;
  is_correct: boolean;
  score: number;
  submitted_at: string;
}
