const BASE_URL = '/api';
const TOKEN_KEY = 'send_platform_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorised');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                      => request<T>(path),
  post:   <T>(path: string, body?: unknown)      => request<T>(path, { method: 'POST',  body: body ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body?: unknown)      => request<T>(path, { method: 'PUT',   body: body ? JSON.stringify(body) : undefined }),
  patch:  <T>(path: string, body?: unknown)      => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string)                      => request<T>(path, { method: 'DELETE' }),
};
