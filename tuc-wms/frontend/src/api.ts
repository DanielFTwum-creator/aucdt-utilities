// Lightweight API client. The access JWT lives in memory only (NFR-SEC-008) —
// never localStorage/sessionStorage. On a 401 it tries one silent refresh
// (HttpOnly cookie) and retries the request once.

let accessToken: string | null = null;
let onAuthLost: (() => void) | null = null;

export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }
export function setOnAuthLost(cb: (() => void) | null) { onAuthLost = cb; }

// Fail fast on a stalled network/proxy so the UI never hangs forever.
const TIMEOUT_MS = 12000;
function timeoutSignal(): AbortSignal | undefined {
  try { return AbortSignal.timeout(TIMEOUT_MS); } catch { return undefined; }
}

async function refresh(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include', signal: timeoutSignal() });
  if (!res.ok) return false;
  const data = await res.json();
  accessToken = data.access_token;
  return true;
}

export async function api<T = any>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(path, { ...init, headers, credentials: 'include', signal: init.signal ?? timeoutSignal() });

  if (res.status === 401 && retry) {
    if (await refresh()) return api<T>(path, init, false);
    accessToken = null;
    onAuthLost?.();
    throw new Error('Session expired');
  }
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try { msg = JSON.parse(text).error || JSON.parse(text).message || text; } catch { /* keep text */ }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** POST helper — goes through the 401-retry/onAuthLost cycle. Use for authenticated endpoints. */
export const post = <T = any>(path: string, body?: unknown) =>
  api<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });

/** PUT helper (partial updates) — same 401-retry/onAuthLost cycle as post. */
export const put = <T = any>(path: string, body?: unknown) =>
  api<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });

/** DELETE helper — same 401-retry/onAuthLost cycle. */
export const del = <T = any>(path: string) =>
  api<T>(path, { method: 'DELETE' });

/**
 * Raw POST — NO 401-retry, NO onAuthLost. Use for public auth endpoints
 * (exchange, mfa/verify) where a 401 means "bad handoff token", not
 * "session expired".
 */
export async function rawPost<T = any>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(path, {
    method: 'POST',
    headers,
    credentials: 'include',
    signal: timeoutSignal(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).error || JSON.parse(text).message || text; } catch { /* keep text */ }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return JSON.parse(text);
}
