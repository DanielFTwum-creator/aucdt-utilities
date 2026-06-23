// WMS SSO pass-through client (TUC-ICT-SRS-2026-013 §5.1).
// Phase 1 migration: NetScan API is now hosted by WMS, so the WMS access token
// is used directly for all /api/v1/netscan/* calls. The separate netscanSsoExchange
// step (which issued a second, NetScan-specific JWT) has been removed.

const WMS = (import.meta as any).env?.VITE_WMS_BASE ?? 'https://wms.techbridge.edu.gh';

/** Full-page entry to the WMS OAuth flow, tagged for this app. */
export const wmsLoginUrl = () => `${WMS}/api/auth/google?app=netscan`;

/** Exchange the one-time OAuth code (from the callback) for a WMS access token. */
export async function wmsExchangeCode(code: string): Promise<string> {
  const res = await fetch(`${WMS}/api/auth/exchange`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error('WMS code exchange failed');
  return (await res.json()).access_token as string;
}

/** Silent re-auth from the shared HttpOnly refresh cookie. Returns a WMS access token or null. */
export async function wmsSilentRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${WMS}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()).access_token as string;
  } catch {
    return null;
  }
}

export interface MfaResult { access_token?: string; user?: unknown; mfa_ticket?: string; error?: string; secret?: string; otpauthUri?: string; }

/** Generic POST to a WMS MFA endpoint; the caller inspects access_token vs mfa_ticket/error. */
export async function wmsMfa(path: string, body: unknown): Promise<MfaResult> {
  const res = await fetch(`${WMS}${path}`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return res.json();
}

/** Fetch the authenticated user's profile from WMS. Returns email and name. */
export async function wmsMe(accessToken: string): Promise<{ email: string; name: string }> {
  const res = await fetch(`${WMS}/api/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('WMS /api/me failed');
  return res.json();
}
