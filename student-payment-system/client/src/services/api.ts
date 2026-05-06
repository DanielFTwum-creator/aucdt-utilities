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

// Payments
export const getPayments = () => request<Payment[]>('/payments');
export const createPayment = (data: Partial<Payment>) =>
  request<Payment>('/payments', { method: 'POST', body: JSON.stringify(data) });
export const updatePayment = (id: string, data: Partial<Payment>) =>
  request<Payment>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePayment = (id: string) =>
  request<{ message: string }>(`/payments/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = () => request<Invoice[]>('/invoices');
export const createInvoice = (data: Partial<Invoice>) =>
  request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(data) });
export const updateInvoice = (id: string, data: Partial<Invoice>) =>
  request<Invoice>(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteInvoice = (id: string) =>
  request<{ message: string }>(`/invoices/${id}`, { method: 'DELETE' });

export interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  payment_date: string;
  semester: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  payment_id: string;
  invoice_number: string;
  student_id: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  invoice_status: string;
  created_at: string;
}
