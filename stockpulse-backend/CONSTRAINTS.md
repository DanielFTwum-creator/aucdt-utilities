# CONSTRAINTS.md — StockPulse Backend

> Environment specification for the stockpulse-backend service.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | StockPulse Backend |
| PM2 process | `stockpulse-backend` |
| Port | **3020** |
| Public URL | `https://ai-tools.techbridge.edu.gh/stockpulse/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/stockpulse-backend/` |
| Stack | Node.js · Express 5 · TypeScript · SQLite · Gemini AI · JWT Auth · Yahoo Finance |

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
| tsx | In `devDependencies` — **must be moved to `dependencies`** before deploy (required for PM2 `--import` mode) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

> **Warning:** `tsx` is currently in `devDependencies`. On the server, `pnpm install` must be run **without** `--prod` so tsx is available at runtime. Alternatively, move tsx to `dependencies` to be safe.

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port — set to `3020` in production |
| `NODE_ENV` | Runtime mode — set to `production` |
| `JWT_SECRET` | Secret key for signing JWT tokens — keep strong and private |
| `JWT_EXPIRE` | JWT token expiry duration (e.g. `7d`) |
| `GEMINI_API_KEY` | Google Gemini AI API key — used by `/api/ai` routes |
| `CORS_ORIGIN` | Allowed frontend origin (e.g. `https://ai-tools.techbridge.edu.gh`) |
| `DB_PATH` | Absolute path to the SQLite database file on the server |
| `ADMIN_EMAILS` | Comma-separated list of email addresses granted admin access |

> All variables must be present in `.env` on the server. Check `.env.local` on the developer machine for current values.

---

## 5. Gemini AI Integration

- Routes under `/api/ai` call the Gemini API using `GEMINI_API_KEY`.
- Ensure the key is valid and has quota before deploying to production.
- Do not hardcode the key anywhere — always read from `process.env.GEMINI_API_KEY`.

---

## 6. Google OAuth

- Auth routes live under `/api/auth`.
- OAuth credentials are managed via the Google Cloud Console project linked to `techbridge.edu.gh`.
- Authorised redirect URIs must include the production URL — update these in the Google Console if the domain or path changes.
- JWT tokens are issued post-OAuth and signed with `JWT_SECRET`.

---

## 7. SQLite Database

- Database file path is set via `DB_PATH` environment variable.
- Ensure the target directory exists and is writable by the PM2 process user on the server.
- Do not commit the `.db` file to version control.
- Run migrations/initialisations before starting the server on a fresh deploy.

---

## 8. Rate Limiting

- Global rate limit: **200 requests per 15 minutes** per IP.
- `app.set('trust proxy', 1)` is set — nginx must forward `X-Forwarded-For` correctly.
- Verify the Plesk/nginx config passes the real client IP, or rate limiting will apply to the proxy IP.

---

## 9. Deploy Pattern

```powershell
.\deploy.ps1
```

- **Pattern 9** — Express server managed by PM2
- **Pattern 12** — NVM / Node v26 selection on server
- **Pattern 13** — tsx used as ESM loader via `--import node_modules/tsx/dist/esm/index.mjs`
- **Pattern 14** — chmod sweep may be needed on `DB_PATH` directory and deploy folder

The deploy script targets `root@66.226.72.199` and the remote path `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/stockpulse`.

---

## 10. Pre-Delivery Gate

Before deploying, confirm:

```
☐ All env vars present in server .env: PORT, NODE_ENV, JWT_SECRET, JWT_EXPIRE,
    GEMINI_API_KEY, CORS_ORIGIN, DB_PATH, ADMIN_EMAILS
☐ tsx is available post-install (either in dependencies, or pnpm install run without --prod)
☐ pnpm install run with no --prod flag on server
☐ DB_PATH directory exists and is writable by the PM2 process user
☐ Google OAuth redirect URIs updated in Google Cloud Console if URL changed
☐ GEMINI_API_KEY is valid and has remaining quota
☐ nginx CORS_ORIGIN matches the deployed frontend origin exactly
☐ Health check passes: GET /health or GET /api/health → { status: "ok", version: "1.0.0", timestamp: "..." }
☐ Rate limit trust proxy confirmed — nginx forwarding real client IP
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
