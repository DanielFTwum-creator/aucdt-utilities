const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  total_copies: number;
  available_copies: number;
  category: string;
  created_at: string;
}

export const booksApi = {
  list: () => request<Book[]>('/books'),
  create: (data: Omit<Book, 'id' | 'created_at'>) =>
    request<{ id: string }>('/books', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<Book, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/books/${id}`, { method: 'DELETE' }),
};

export interface Checkout {
  id: string;
  book_id: string;
  borrower_id: string;
  checkout_date: string;
  due_date: string;
  return_date: string;
  status: string;
  late_fee: number;
  created_at: string;
}

export const checkoutsApi = {
  list: () => request<Checkout[]>('/checkouts'),
  create: (data: Omit<Checkout, 'id' | 'created_at'>) =>
    request<{ id: string }>('/checkouts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Omit<Checkout, 'id' | 'created_at'>) =>
    request<{ updated: boolean }>(`/checkouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ deleted: boolean }>(`/checkouts/${id}`, { method: 'DELETE' }),
};
