# CONSTRAINTS.md — StockPulse Backend

> Environment specification for the StockPulse Express/SQLite API.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.
>
> **Path note (important):** this repo folder (`stockpulse-backend/`) is a
> documentation-only stub — it contains no source code, only this file. The actual
> backend source lives at `../stockpulse/backend/` (sibling repo folder `stockpulse`,
> subdirectory `backend`), and the frontend SPA lives at `../stockpulse/`. Both are
> deployed together by `stockpulse/deploy.ps1` to one remote path. Rewritten 12 Jul
> 2026 from a reality-verified read of `stockpulse/backend/src/index.ts`,
> `src/services/gemini.ts`, `src/middleware/auth.ts`, `src/routes/auth.ts`, and
> `stockpulse/deploy.ps1` — the previous version of this file (direct `GEMINI_API_KEY`
> + plain Google-OAuth-only auth model) no longer matched the code.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | StockPulse Backend |
| PM2 process | `stockpulse-backend` |
| Port | **3020** |
| Public URL | `https://ai-tools.techbridge.edu.gh/stockpulse/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/stockpulse/` (frontend at the path root, backend under `stockpulse/backend/`) |
| Stack | Node.js · Express 5 · TypeScript (`tsx`) · SQLite (`better-sqlite3`-shaped `db.prepare`) · JWT auth (`jsonwebtoken` + `bcryptjs`) · Yahoo Finance (`yahoo-finance2`) · Gemini AI via WMS relay |
| Serving | **static-SPA + separate API backend** (Pattern 28 archetype) — Apache/`.htaccess` serves the built frontend and proxies only `/stockpulse/api/` to this Node process; this is *not* a self-serving-Node app, so no nginx `location /stockpulse/` block should ever proxy the whole sub-path to it (see Pattern 28's own worked example, which is this exact app) |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** |
| tsx | In `devDependencies` in `stockpulse/backend/package.json` — production install is `pnpm install --prod` (see `stockpulse/deploy.ps1`), and PM2 starts `src/index.ts` with `--interpreter npx --interpreter-args tsx`, so this app has the same Pattern 13 gap as deliberate-magic-reader: it relies on `npx`'s auto-fetch fallback rather than `tsx` actually being installed. Not fixed here (docs-only pass). |
| Entry point | `src/index.ts` |
| Reverse proxy | Apache `.htaccess` (see §9) — **not** an nginx self-serve block |

---

## 4. Authentication — local email/password (JWT), with optional Google OAuth

This is **not** WMS SSO. `stockpulse/backend/src/routes/auth.ts` implements:

- `POST /api/auth/register` — email + password (bcrypt, cost 12) + name; creates a
  free-tier user, a paper-trading account seeded with $100,000, and a default
  watchlist (`SOXL`, `SOXS`).
- `POST /api/auth/login` — email/password, issues a JWT (`JWT_SECRET`, default
  expiry `JWT_EXPIRE`).
- `GET /api/auth/me`, `POST /api/auth/upgrade`, `POST /api/auth/cancel` — all behind
  `requireAuth` (Bearer JWT, `src/middleware/auth.ts`).
- `GET /api/auth/google` / `GET /api/auth/google/callback` — an **optional**,
  separate Google OAuth login path (its own authorization-code exchange, not tied to
  WMS), gated on `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` being set; returns 503 if
  unconfigured.
- Every login/register/failure is written to an `audit_logs` table (`logAudit()`).
- `requirePremium` middleware gates premium-tier routes on `req.user.tier`.

---

## 5. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `PORT` | HTTP port | `3020` in production |
| `NODE_ENV` | Runtime mode | `production` |
| `JWT_SECRET` | Signs auth tokens | Keep strong and private; never log |
| `JWT_EXPIRE` | Token TTL | e.g. `7d` |
| `GEMINI_PROXY_KEY` | Authenticates the relay to WMS (Pattern 11) | **This app never holds the Gemini key** — see §6 |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://ai-tools.techbridge.edu.gh` in production |
| `DB_PATH` | SQLite file path | Relative to `backend/`, e.g. `./data/stockpulse.db` |
| `ADMIN_EMAILS` | Comma-separated admin emails | Grants `/api/admin` access |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth login | Absent → `/api/auth/google` returns 503, everything else still works |
| `APP_URL` | Base URL used to build the OAuth callback URL | Defaults to `http://localhost:3000` |

> `stockpulse/.env.example` (root, frontend-facing) still documents a direct
> `GEMINI_API_KEY` — that line is stale. The real backend never reads
> `GEMINI_API_KEY`; only `GEMINI_PROXY_KEY` is used (see §6). Secrets are injected on
> the server via a gitignored `stockpulse/.env.secrets.local` that `deploy.ps1` reads
> and appends into the shipped `.env` — never put a real secret on a command line or
> in this file.

---

## 6. Gemini AI — WMS relay (Pattern 11), already migrated

`stockpulse/backend/src/services/gemini.ts` relays `analyzeStock()` calls to WMS:

```
POST https://wms.techbridge.edu.gh/api/gemini/generate?model=gemini-2.5-flash
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
Body: raw Gemini generateContent JSON (contents / generationConfig)
```

- No raw `GEMINI_API_KEY` anywhere in the backend code.
- Missing `GEMINI_PROXY_KEY` → `analyzeStock()` throws; check the calling route
  surfaces a clean error rather than a raw stack trace if you touch this.
- The code comment in `gemini.ts` explicitly documents this as the fix for the
  "confirmed leak vector for the 22 Jun 2026 fleet key revocation" (a hardcoded key
  previously lived in `deploy.ps1`) — never reintroduce a raw key here.
- The root frontend `package.json` (`stockpulse/package.json`) still lists
  `@google/genai` as a dependency; it is not part of the backend relay and looks
  like leftover AI-Studio-scaffold weight — flag for removal on a future touch, not
  fixed here (docs-only pass).

---

## 7. SQLite Database

- Path set via `DB_PATH`; schema in `src/db/schema.ts`.
- Do not commit the `.db`/`.db-shm` files (present locally under `backend/data/` for
  dev — confirm `.gitignore` excludes them before any commit).
- `alertWorker.ts` runs a background price-alert loop, started from `src/index.ts`
  on boot.

---

## 8. Rate Limiting & Security Headers

- `express-rate-limit`: 200 requests / 15 minutes per IP, `app.set('trust proxy', 1)`.
- `helmet({ contentSecurityPolicy: false })` — CSP is disabled; if re-enabling it,
  test the SPA/API split carefully since Apache serves the frontend separately.
- `cors({ origin: CORS_ORIGIN, credentials: true })`.

---

## 9. Serving Archetype — static-SPA + separate API (Pattern 28)

This is the fleet's canonical example of the *static-SPA + API* archetype, distinct
from the self-serving-Node apps elsewhere in this fleet:

- The frontend (`stockpulse/dist/` after `vite build`) is served **directly by
  Apache/Plesk** from the docroot.
- `.htaccess` (generated by `stockpulse/deploy.ps1`) does the SPA fallback and
  proxies only `^api/(.*)$` to `http://localhost:3020/api/$1`; it also blocks direct
  access to `backend/` (`RewriteRule ^backend/ - [F,L]`).
- **No nginx `location /stockpulse/` block should exist.** A prior incident (10 Jul
  2026, documented in `PATTERNS.md` Pattern 28) added exactly such a block, which
  proxied the whole sub-path to this API-only backend and 404'd every page load —
  the fix was to remove the nginx location entirely and let Apache/`.htaccess` handle
  it. If `ai-tools.techbridge.edu.gh/stockpulse/` ever 404s with `{"error":"Route not
  found"}`, check for a reintroduced nginx block first.

---

## 10. Deploy Pattern

```powershell
cd C:\Development\github\aucdt-utilities\stockpulse
.\deploy.ps1 -Build
```

Deployed from the sibling `stockpulse/` repo folder (not from this
`stockpulse-backend/` stub) — `deploy.ps1` builds the Vite frontend, stages
`dist/` + a generated `.htaccess`, uploads both the frontend and
`backend/src/*` + `backend/package.json`/`pnpm-lock.yaml`, injects secrets from
`.env.secrets.local` into `backend/.env` (never on a command line or in output),
runs `pnpm install --prod` on the server, and (re)starts/reloads the
`stockpulse-backend` PM2 process bound to port 3020.

---

## 11. Pre-Delivery Gate

Before deploying, confirm:

```
☐ .env.secrets.local exists next to stockpulse/deploy.ps1 (deploy aborts without it)
☐ All backend env vars present: PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRE, GEMINI_PROXY_KEY,
    CORS_ORIGIN, DB_PATH, ADMIN_EMAILS (GOOGLE_CLIENT_ID/SECRET optional)
☐ No raw GEMINI_API_KEY anywhere in backend/src — only GEMINI_PROXY_KEY (Pattern 11)
☐ tsx available at runtime post-install (currently relies on npx auto-fetch — Pattern 13 gap, see §3)
☐ DB_PATH directory exists and is writable by the PM2 process user
☐ No nginx location /stockpulse/ block exists — Apache .htaccess must own the sub-path (Pattern 28)
☐ Google OAuth redirect URIs updated in Google Cloud Console if APP_URL changes (only if that optional flow is used)
☐ Health check passes: GET /stockpulse/api/health (or /health) → { status: "ok", version, timestamp }
☐ Rate limit trust proxy confirmed — nginx/Apache forwarding real client IP
```

---

*Rewritten 12 Jul 2026 — reality-verified documentation pass (TUC ICT).*
