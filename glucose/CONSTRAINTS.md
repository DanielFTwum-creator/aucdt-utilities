# CONSTRAINTS.md — Glucose Blood Sugar Tracker

> Environment specification for the Glucose backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Glucose Blood Sugar Tracker |
| PM2 process | `glucose` |
| Port | **3006** |
| Public URL | `https://glucose.techbridge.edu.gh/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/glucose/` |
| Stack | React + TypeScript (Vite) · Express · Node.js SQLite (`node:sqlite`) · Gemini AI (`@google/genai`) |

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
| Node version | **v26.3.1** (`node:sqlite` requires Node v22.5+; v26 satisfies this) |
| tsx | In `dependencies` — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |
| DB file | `data/glucose.db` — relative to deploy path; created on first run |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Auth token for WMS Gemini key proxy | **Production only** — required; AI routes fail without it |
| `GEMINI_API_KEY` | Direct Gemini key fallback | Local dev only — **not used in production** |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (frontend) | Baked into Vite bundle at build time |
| `VITE_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI (frontend) | Baked into Vite bundle at build time |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (server) | Server-side only; never expose to frontend |
| `PORT` | Express listen port | Defaults to `3006` |

> All variables live in `.env.local` (local) or set directly in PM2 / Plesk environment (production).
> `VITE_*` variables are build-time; changing them requires a full `pnpm build` and redeploy.

---

## 5. Gemini AI — WMS Proxy Pattern

The server **never stores a raw Gemini API key in production**. Instead it fetches a rotating key from the internal WMS proxy:

- **Proxy endpoint:** `https://wms.techbridge.edu.gh/api/gemini/key`
- **Auth header:** `X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>`
- **Cache TTL:** 6 hours (in-memory; resets on PM2 restart)
- **Local dev fallback:** `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` — only if `GEMINI_PROXY_KEY` is unset

> Do **not** add raw Gemini key handling to production code paths. All AI routes must call `getGeminiKey()` from `server.ts`.

---

## 6. SQLite Database

| Item | Value |
|---|---|
| Engine | Node built-in `node:sqlite` (`DatabaseSync`) — no external driver |
| DB file path | `<deploy_path>/data/glucose.db` |
| Tables | `admin_config`, `audit_logs`, `profile`, `readings` |
| Seeding | Test data is auto-seeded on first run if `readings` table is empty |
| Backup | Daily SQLite cron backup already live on server |
| Browser backup | IndexedDB browser backup — **pending** (see project backlog) |

> `node:sqlite` is a Node v22.5+ built-in. Do **not** install `better-sqlite3` or `sqlite3` npm packages — they are not used and will conflict.

---

## 7. Google OAuth

Google OAuth credentials are present (`VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) but the OAuth flow may be partial or in-progress. Before implementing or modifying auth:

- Confirm `VITE_GOOGLE_REDIRECT_URI` matches the URI registered in Google Cloud Console.
- `GOOGLE_CLIENT_SECRET` is server-side only — never reference it in Vite/frontend code.
- OAuth is **not** the primary auth mechanism confirmed active — verify current usage before assuming full SSO is live.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

Applies:
- **Pattern 9** — Express server managed by PM2
- **Pattern 12** — NVM / Node v26 on server
- **Pattern 13** — `tsx` used to run `server.ts` (must be in `dependencies`)
- **Pattern 14** — chmod sweep may be needed on `data/` directory for SQLite write access

Health check URL: `https://ai-tools.techbridge.edu.gh/glucose`

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx is in dependencies (not devDependencies) — required to run server.ts via PM2
☐ GEMINI_PROXY_KEY is set in production PM2 environment
☐ pnpm install run with no --prod flag (tsx must be installed)
☐ data/ directory exists and is writable by the PM2 process user
☐ node:sqlite requires Node v22.5+ — confirm PM2 uses Node v26
☐ VITE_* vars set before pnpm build (they are baked in at build time)
☐ Health check passes: GET /glucose/ → HTTP 200
☐ AI route smoke test: POST /glucose/api/analyse → valid Gemini response
☐ SQLite smoke test: readings table present and queryable after deploy
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
