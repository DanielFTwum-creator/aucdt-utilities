// WMS SSO client for LEMS (hosted-in-WMS — TUC-ICT-SRS-2026-013).
// Both staff and students sign in with their @techbridge.edu.gh Workspace
// account; the access token lives in memory only (never localStorage).

const WMS_BASE = import.meta.env?.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';

export const wmsBase = WMS_BASE;

let accessToken = null;
export function getAccessToken() { return accessToken; }
export function setAccessToken(t) { accessToken = t; }

const TIMEOUT_MS = 12000;
function timeoutSignal() {
  try { return AbortSignal.timeout(TIMEOUT_MS); } catch { return undefined; }
}

async function post(path, body) {
  const res = await fetch(WMS_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    signal: timeoutSignal(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).error || JSON.parse(text).message || text; } catch { /* keep */ }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return JSON.parse(text);
}

/** Refresh-cookie session adoption. Returns {access_token, user} or null. */
export async function silentSession() {
  try {
    const r = await post('/api/auth/refresh');
    const me = await fetch(WMS_BASE + '/api/me', {
      headers: { Authorization: `Bearer ${r.access_token}` },
      credentials: 'include',
      signal: timeoutSignal(),
    });
    if (!me.ok) return null;
    return { access_token: r.access_token, user: await me.json() };
  } catch {
    return null;
  }
}

/** Refresh only — used by the API layer to retry a 401 once. Returns token or null. */
export async function refreshToken() {
  try {
    const r = await post('/api/auth/refresh');
    accessToken = r.access_token;
    return accessToken;
  } catch {
    return null;
  }
}

export const exchange = (code) => post('/api/auth/exchange', { code });
export const mfaVerify = (mfa_ticket, code) => post('/api/auth/mfa/verify', { mfa_ticket, code });
export const mfaEnrollBegin = (mfa_ticket) => post('/api/auth/mfa/enroll/begin', { mfa_ticket });
export const mfaEnrollConfirm = (mfa_ticket, secret, code) =>
  post('/api/auth/mfa/enroll/confirm', { mfa_ticket, secret, code });

/** Clears the fleet-wide refresh cookie (signs out of all WMS-SSO apps). */
export const wmsLogout = () => post('/api/auth/logout').catch(() => { /* best effort */ });

/** Admin = WMS staff-admin roles (mirrors LemsAccess server-side). */
export const isAdminRole = (role) => ['SYSTEM_ADMIN', 'HOD', 'ADMIN_STAFF'].includes(role);
