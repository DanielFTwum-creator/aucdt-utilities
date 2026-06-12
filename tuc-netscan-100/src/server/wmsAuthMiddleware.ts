import { Request, Response, NextFunction } from 'express';

/**
 * WMS SSO guard for the NetScan REST API (TUC-ICT-SRS-2026-013).
 * Requires a valid WMS access token (Bearer) on every /api/v1 request — the frontend obtains it via
 * the WMS SSO flow. Trust is established by relaying the token to WMS /api/me (no shared secret); a
 * short in-memory cache avoids hammering WMS. Domain-gated to @techbridge.edu.gh.
 *
 * This closes the exposure of an unauthenticated network-reconnaissance API.
 */
const WMS_BASE = process.env.WMS_BASE || 'http://127.0.0.1:8081'; // server-to-server; bypass public/WAF
const ALLOWED_DOMAIN = '@techbridge.edu.gh';
const CACHE_TTL_MS = 60_000;

const cache = new Map<string, { email: string; exp: number }>();

export async function requireWmsAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Personal/LAN mode: scan your own network from your own machine without WMS
  // (NETSCAN_LOCAL_MODE=1). NEVER set this on a server — the API becomes
  // unauthenticated. Pair with VITE_NETSCAN_LOCAL_MODE=1 for the frontend gate.
  if (process.env.NETSCAN_LOCAL_MODE === '1') {
    (req as any).wmsEmail = 'local-mode@localhost';
    next();
    return;
  }

  const header = req.headers['authorization'];
  const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ status: 401, message: 'Authentication required.' });
    return;
  }

  const hit = cache.get(token);
  if (hit && hit.exp > Date.now()) {
    (req as any).wmsEmail = hit.email;
    next();
    return;
  }

  try {
    const r = await fetch(`${WMS_BASE}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) {
      res.status(401).json({ status: 401, message: 'Invalid or expired session.' });
      return;
    }
    const me = (await r.json()) as { email?: string };
    const email = (me.email || '').toLowerCase();
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      res.status(403).json({ status: 403, message: 'Forbidden — Techbridge staff only.' });
      return;
    }
    cache.set(token, { email, exp: Date.now() + CACHE_TTL_MS });
    (req as any).wmsEmail = email;
    next();
  } catch {
    res.status(401).json({ status: 401, message: 'Authentication check failed.' });
  }
}
