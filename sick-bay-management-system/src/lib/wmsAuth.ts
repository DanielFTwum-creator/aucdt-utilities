// WMS SSO client for SickBay Management System (TUC-ICT-SRS-2026-004).
// Staff sign in with their @techbridge.edu.gh Workspace account;
// the access token lives in memory only (never localStorage).
// Mirrors the LEMS wmsAuth.js pattern for fleet-wide SSO interoperability.

const WMS_BASE = import.meta.env?.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';
const TIMEOUT_MS = 12_000;

export const wmsBase = WMS_BASE;

/* ── In-Memory Token Store ─────────────────────────────────────────────── */
let accessToken: string | null = null;
export function getAccessToken(): string | null { return accessToken; }
export function setAccessToken(t: string | null): void { accessToken = t; }

/* ── Helpers ───────────────────────────────────────────────────────────── */
function timeoutSignal(): AbortSignal | undefined {
  try { return AbortSignal.timeout(TIMEOUT_MS); } catch { return undefined; }
}

async function post<T = any>(path: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(WMS_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',          // sends wms_refresh cookie cross-origin
    signal: timeoutSignal(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as unknown as T;
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).error || JSON.parse(text).message || text; } catch { /* keep raw */ }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return JSON.parse(text) as T;
}

/* ── WMS User Type ─────────────────────────────────────────────────────── */
export interface WmsUser {
  email: string;
  name: string;
  role: string;
  picture?: string;
  sub?: string;        // Google sub (unique user ID)
}

export interface WmsSession {
  access_token: string;
  user: WmsUser;
}

/* ── SSO Session Adoption ──────────────────────────────────────────────── */

/** Refresh-cookie session adoption. Returns {access_token, user} or null. */
export async function silentSession(): Promise<WmsSession | null> {
  try {
    const r = await post<{ access_token: string }>('/api/auth/refresh');
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
export async function refreshToken(): Promise<string | null> {
  try {
    const r = await post<{ access_token: string }>('/api/auth/refresh');
    accessToken = r.access_token;
    return accessToken;
  } catch {
    return null;
  }
}

/* ── Auth Endpoints ────────────────────────────────────────────────────── */

/** Exchange Google authorization code for WMS session. */
export const exchange = (code: string) =>
  post<WmsSession>('/api/auth/exchange', { code });

/** Verify TOTP MFA code. */
export const mfaVerify = (mfa_ticket: string, code: string) =>
  post<WmsSession>('/api/auth/mfa/verify', { mfa_ticket, code });

/** Begin TOTP enrolment — returns secret + otpauthUri. */
export const mfaEnrollBegin = (mfa_ticket: string) =>
  post<{ secret: string; otpauthUri: string }>('/api/auth/mfa/enroll/begin', { mfa_ticket });

/** Confirm TOTP enrolment with secret + verification code. */
export const mfaEnrollConfirm = (mfa_ticket: string, secret: string, code: string) =>
  post<WmsSession>('/api/auth/mfa/enroll/confirm', { mfa_ticket, secret, code });

/** Clears the fleet-wide refresh cookie (signs out of all WMS-SSO apps). */
export const wmsLogout = () =>
  post('/api/auth/logout').catch(() => { /* best effort */ });

/* ── Role Helpers ──────────────────────────────────────────────────────── */

/** Admin = WMS staff-admin roles (retained for reference; SickBay itself gates
 *  on the email allow-list below, not on WMS role). */
export const isAdminRole = (role: string): boolean =>
  ['SYSTEM_ADMIN', 'HOD', 'ADMIN_STAFF', 'MEDICAL_OFFICER'].includes(role);

/** SickBay administrators, by institutional email. Admin rights are granted to
 *  these accounts ONLY, independent of WMS role, so a clinic account without an
 *  admin role can still administer the sick bay. The server enforces the same
 *  list (routes.ts); this drives the UI. */
export const SICKBAY_ADMIN_EMAILS = [
  'clinic@techbridge.edu.gh',      // primary  — clinic nurse
  'daniel.twum@techbridge.edu.gh', // backup   — Head of ICT
];
export const isSickbayAdmin = (email?: string): boolean =>
  !!email && SICKBAY_ADMIN_EMAILS.includes(email.trim().toLowerCase());

/** Medical staff = roles that can log visits, dispense medication */
export const isMedicalRole = (role: string): boolean =>
  ['SYSTEM_ADMIN', 'HOD', 'ADMIN_STAFF', 'MEDICAL_OFFICER', 'NURSE', 'HEALTH_WORKER'].includes(role);
