// WMS SSO client for MarkAI (archetype B — TUC-ICT-SDD-2026-001).
// Staff sign-in is delegated to the WMS backend (Google OAuth + TOTP, domain-gated
// to @techbridge.edu.gh). MarkAI keeps its own local accounts for external users;
// this service only handles the WMS dance: handoff, code exchange, MFA, silent
// session adoption via the shared .techbridge.edu.gh refresh cookie.

const AUTH_BASE = (import.meta as any).env?.VITE_AUTH_BASE ?? 'https://wms.techbridge.edu.gh';

export const wmsAuthBase: string = AUTH_BASE;

export interface WmsUser { email: string; name: string; role: string; photoUrl?: string; }
export interface WmsSession { access_token: string; user: WmsUser; }

// Fail fast on a stalled network/proxy so the UI never hangs forever.
const TIMEOUT_MS = 12000;
function timeoutSignal(): AbortSignal | undefined {
  try { return AbortSignal.timeout(TIMEOUT_MS); } catch { return undefined; }
}

async function wmsPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(AUTH_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

/** Adopt an existing fleet session (refresh cookie → JWT → profile). Null = not signed in. */
export async function wmsSilentSession(): Promise<WmsSession | null> {
  try {
    const r = await wmsPost<{ access_token: string }>('/api/auth/refresh');
    const me = await fetch(AUTH_BASE + '/api/me', {
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

export const wmsExchange = (code: string) =>
  wmsPost<WmsSession>('/api/auth/exchange', { code });

export const wmsMfaVerify = (mfa_ticket: string, code: string) =>
  wmsPost<WmsSession>('/api/auth/mfa/verify', { mfa_ticket, code });

export const wmsMfaEnrollBegin = (mfa_ticket: string) =>
  wmsPost<{ secret: string; otpauthUri: string }>('/api/auth/mfa/enroll/begin', { mfa_ticket });

export const wmsMfaEnrollConfirm = (mfa_ticket: string, secret: string, code: string) =>
  wmsPost<WmsSession>('/api/auth/mfa/enroll/confirm', { mfa_ticket, secret, code });

/** Clears the fleet-wide refresh cookie (signs the user out of all WMS-SSO apps). */
export const wmsLogout = () => wmsPost<void>('/api/auth/logout').catch(() => { /* best effort */ });
