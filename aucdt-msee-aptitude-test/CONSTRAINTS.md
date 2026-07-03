# CONSTRAINTS.md — MSEE Aptitude Test

> Environment specification for the aucdt-msee-aptitude-test backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | MSEE Aptitude Test |
| PM2 process | `aucdt-msee-aptitude-test` |
| Port | **3011** |
| Public URL | `https://ai-tools.techbridge.edu.gh/aucdt-msee-aptitude-test/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/aucdt-msee-aptitude-test/` |
| Stack | React 19 + Vite 6 (frontend) · Express 5 (backend, plain JS `server.js`) · MySQL (mysql2) · Gemini AI (`@google/genai`) · JWT auth |

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
| Server entry | `server.js` (plain ESM — no `tsx` needed; do **not** rename to `.ts`) |
| PM2 interpreter | Node v26, standard `node` interpreter |
| Reverse proxy | nginx (Plesk-managed) |

> **Note:** The server is plain JavaScript (`server.js`), not TypeScript. Do not introduce `tsx` or a TypeScript server unless the project is explicitly migrated. The existing `tsconfig.json` applies to the Vite/React frontend only.

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) | WMS-issued service credential — this app never holds the Gemini key. Missing = AI route returns 503 (server still boots). |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `PORT` | Server port | Must be `3011`; set in `ecosystem.config.js` to avoid EADDRINUSE conflicts. |
| `DB_HOST` | MySQL host | Defaults to `localhost` if unset |
| `DB_USER` | MySQL username | Defaults to `root` if unset |
| `DB_PASSWORD` | MySQL password | Defaults to `''` if unset |
| `DB_NAME` | MySQL database name | Defaults to `msee_test_db` if unset |
| `JWT_SECRET` | JWT signing secret | Required for auth middleware; missing = all protected routes return 403 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Frontend-only Vite env var (not used server-side in current code) |
| `VITE_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | Frontend-only Vite env var |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Server-side; check usage — may be for a future OAuth flow |

> All DB variables have in-code defaults but should be explicitly set in `.env` on the server. Do not rely on defaults in production.

---

## 5. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
All generateContent calls are relayed to WMS, which adds the key server-side:

```
POST https://wms.techbridge.edu.gh/api/gemini/generate?model=gemini-2.5-flash
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
Body: raw Gemini generateContent JSON (contents / generationConfig with REST-style
      type strings, e.g. "OBJECT" / "ARRAY" — the SDK Type enum is gone)
Response: raw Gemini REST response, relayed verbatim
```

- No key cache, no key invalidation — the app has no key to manage
- Missing `GEMINI_PROXY_KEY` → `/api/generate` returns HTTP 503 (server still boots)
- Reference implementation: `server.js` → `callGemini()`; same idiom as biochemai/omniextract
- Migrated from direct `@google/genai` SDK usage on 3 Jul 2026 (SDK dependency removed;
  the startup `process.exit(1)` on missing key is also gone)
- Known dead code: `index.html` still carries an AI Studio importmap entry for
  `@google/genai` — unused by any component, left in place (pre-existing).

---

## 6. MySQL Database

- Driver: `mysql2/promise` (connection pool).
- Pool is created at startup; failure causes `process.exit(1)`.
- Default database name: `msee_test_db` — ensure this schema exists on the server before first deploy.
- No ORM — raw SQL queries throughout. Schema migrations must be run manually or via a migration script.

---

## 7. Authentication

- JWT-based auth (`jsonwebtoken`).
- `authenticateToken` middleware validates Bearer tokens on protected routes.
- `isAdmin` middleware enforces role === `'admin'` for admin-only endpoints.
- Passwords hashed with `bcrypt` (10 salt rounds).
- `JWT_SECRET` **must** be set in `.env` — there is no in-code default.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1
.\deploy.ps1 -Build   # include Vite production build step
```

Patterns in use:
- **Pattern 9** — Express server (`server.js`) managed by PM2
- **Pattern 12** — NVM / Node v26 on the server
- No Pattern 13 (no `tsx`) — server is plain ESM JavaScript

PM2 ecosystem must set `PORT=3011` explicitly to prevent port collision with other apps in the monorepo.

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ server.js relays via callGemini() — no GEMINI_API_KEY reference anywhere in server.js
☐ GEMINI_PROXY_KEY is set in server .env (not just locally)
☐ JWT_SECRET is set in server .env
☐ DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are set in server .env
☐ MySQL database `msee_test_db` exists and schema is up to date
☐ PORT=3011 is set in ecosystem.config.js (never hardcode 3000)
☐ pnpm install run without --prod flag (devDependencies needed for Vite build)
☐ Vite build output is in `dist/` and served correctly by Express static handler
☐ Health check passes: GET /aucdt-msee-aptitude-test/api/health → { ok: true }
☐ No accidental `tsx` import added to server.js or ecosystem config
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
