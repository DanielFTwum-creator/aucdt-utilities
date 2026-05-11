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

// Widgets
export const getWidgets = () => request<Widget[]>('/widgets');
export const createWidget = (data: Partial<Widget>) =>
  request<Widget>('/widgets', { method: 'POST', body: JSON.stringify(data) });
export const updateWidget = (id: string, data: Partial<Widget>) =>
  request<Widget>(`/widgets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteWidget = (id: string) =>
  request<{ message: string }>(`/widgets/${id}`, { method: 'DELETE' });

// Metrics
export const getMetrics = () => request<Metric[]>('/metrics');
export const createMetric = (data: Partial<Metric>) =>
  request<Metric>('/metrics', { method: 'POST', body: JSON.stringify(data) });
export const updateMetric = (id: string, data: Partial<Metric>) =>
  request<Metric>(`/metrics/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMetric = (id: string) =>
  request<{ message: string }>(`/metrics/${id}`, { method: 'DELETE' });

export interface Widget {
  id: string;
  title: string;
  widget_type: string;
  config: string;
  position: number;
  created_at: string;
}

export interface Metric {
  id: string;
  widget_id: string;
  metric_name: string;
  metric_value: number;
  timestamp: string;
}
