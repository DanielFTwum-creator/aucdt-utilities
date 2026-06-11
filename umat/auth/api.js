// Lightweight API client for the WMS SSO backend (TUC-ICT-SDD-2026-001).
// The access JWT lives in memory only — never localStorage/sessionStorage.
// On a 401 it tries one silent refresh (HttpOnly cookie) and retries once.
//
// UMAT is a separate host from WMS, so every call is prefixed with the WMS
// auth host. Override via VITE_AUTH_BASE for local dev.

const AUTH_BASE = import.meta.env?.VITE_AUTH_BASE ?? 'https://wms.techbridge.edu.gh';
const url = (path) => (path.startsWith('http') ? path : AUTH_BASE + path);

let accessToken = null;
let onAuthLost = null;

export function setAccessToken(token) { accessToken = token; }
export function getAccessToken() { return accessToken; }
export function setOnAuthLost(cb) { onAuthLost = cb; }

// Fail fast on a stalled network/proxy so the UI never hangs forever.
const TIMEOUT_MS = 12000;
function timeoutSignal() {
  try { return AbortSignal.timeout(TIMEOUT_MS); } catch { return undefined; }
}

async function refresh() {
  const res = await fetch(url('/api/auth/refresh'), { method: 'POST', credentials: 'include', signal: timeoutSignal() });
  if (!res.ok) return false;
  const data = await res.json();
  accessToken = data.access_token;
  return true;
}

export async function api(path, init = {}, retry = true) {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(url(path), { ...init, headers, credentials: 'include', signal: init.signal ?? timeoutSignal() });

  if (res.status === 401 && retry) {
    if (await refresh()) return api(path, init, false);
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
  if (res.status === 204) return undefined;
  return res.json();
}

/** POST helper — goes through the 401-retry/onAuthLost cycle. Use for authenticated endpoints. */
export const post = (path, body) =>
  api(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });

/**
 * Raw POST — NO 401-retry, NO onAuthLost. Use for public auth endpoints
 * (exchange, mfa/verify) where a 401 means "bad handoff token", not "session expired".
 */
export async function rawPost(path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(url(path), {
    method: 'POST',
    headers,
    credentials: 'include',
    signal: timeoutSignal(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).error || JSON.parse(text).message || text; } catch { /* keep text */ }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return JSON.parse(text);
}

/** The WMS auth host base (for full-page OAuth navigation). */
export const authBase = AUTH_BASE;
