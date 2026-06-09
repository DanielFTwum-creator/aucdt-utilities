// WMS SSO pass-through client (TUC-ICT-SRS-2026-013 §5.1).
// NetScan bootstraps its own session from a WMS identity: obtain a WMS access token (via OAuth
// code exchange or silent refresh against the WMS host), then exchange it at NetScan's own
// /api/v1/auth/sso-exchange, which relays it to WMS /api/me and returns a NetScan JWT.

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

/** Exchange a WMS access token for a NetScan session token (NetScan backend trusts WMS /api/me). */
export async function netscanSsoExchange(wmsToken: string): Promise<{ token: string; username: string; role: string }> {
  const res = await fetch('/api/v1/auth/sso-exchange', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wmsToken }),
  });
  if (!res.ok) throw new Error('NetScan SSO exchange failed');
  return res.json();
}
