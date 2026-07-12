import { Request, Response, NextFunction } from 'express';

/**
 * WMS SSO guard for the Lecturer AI Handbook API (TUC-ICT-SRS-2026-013, archetype B).
 * Requires a valid WMS access token (Bearer) on every protected request — the frontend
 * obtains it via the WMS SSO flow. Trust is established by relaying the token to WMS
 * /api/me (no shared secret); a short in-memory cache avoids hammering WMS.
 *
 * Domain-gated to @techbridge.edu.gh, which admits all TUC members (staff + students) —
 * the intended audience for this learning tool. This is what protects the WMS Gemini
 * relay: only signed-in TUC accounts can reach /api/gemini/generate.
 */
const WMS_BASE = process.env.WMS_BASE || 'http://127.0.0.1:8081'; // server-to-server; bypass public/WAF
const ALLOWED_DOMAIN = '@techbridge.edu.gh';
const CACHE_TTL_MS = 60_000;

const cache = new Map<string, { email: string; exp: number }>();

export async function requireWmsAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers['authorization'];
  const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
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
      res.status(401).json({ error: 'Invalid or expired session.' });
      return;
    }
    const me = (await r.json()) as { email?: string };
    const email = (me.email || '').toLowerCase();
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      res.status(403).json({ error: 'Forbidden — Techbridge accounts only.' });
      return;
    }
    cache.set(token, { email, exp: Date.now() + CACHE_TTL_MS });
    (req as any).wmsEmail = email;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication check failed.' });
  }
}
