# CONSTRAINTS.md — MarkAI

> Environment specification for the MarkAI backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | MarkAI |
| PM2 process | `markai` |
| Port | **3000** |
| Public URL | `https://ai-tools.techbridge.edu.gh/markai/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/markai/` |
| Stack | React + Vite (frontend) · Express 5 (CJS backend, `server.cjs`) · `@google/genai` · Google OAuth 2.0 |

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
| Server entry | `server.cjs` — plain CJS; **no tsx required** |
| PM2 interpreter | Node v26, standard (`node server.cjs`) |
| Reverse proxy | nginx (Plesk-managed) |

> **Note:** There is no `server.ts`; the backend is `.cjs`. Do **not** add `--import tsx` to the PM2 config.

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 — server-side client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 — server-side client secret |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth — exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI — exposed to Vite frontend build |
| `PORT` | Express listen port (defaults to `3000` if unset) |
| `GEMINI_PROXY_KEY` | Auth key for the TUC WMS Gemini key relay (`wms.techbridge.edu.gh`) |

All vars live in `.env.local` (preferred) or `.env`. The server checks for `.env.local` first at startup.

> **Local dev fallback:** If `GEMINI_PROXY_KEY` is absent, the server falls back to `API_KEY`. This fallback must **not** be used in production.

---

## 5. Gemini AI — WMS Key Relay

MarkAI does **not** hold a raw Gemini API key. Instead it fetches a short-lived key from the TUC central key-custody service (WMS) on first use and caches it for 6 hours.

| Item | Value |
|---|---|
| WMS endpoint | `https://wms.techbridge.edu.gh/api/gemini/key` |
| Request header | `X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>` |
| Cache TTL | 6 hours (in-process memory) |
| Stale-key handling | `API_KEY_INVALID` / `API key expired` errors auto-invalidate the cache; the next request refetches |

**Never hardcode a raw Gemini key in this repo.** Always use the WMS relay pattern.

---

## 6. Google OAuth

The backend exposes OAuth endpoints in `server.cjs`. The redirect URI is derived at runtime from the `origin` query parameter supplied by the client — there is no single hardcoded callback URL.

Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_CLIENT_ID`, and `VITE_GOOGLE_REDIRECT_URI` are all set before building or starting the server. The Vite vars must be present at **build time** to be embedded in the frontend bundle.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1          # deploy without rebuilding frontend
.\deploy.ps1 -Build   # rebuild Vite bundle then deploy
```

Pattern applied: **Pattern 9** (Express server + PM2, no tsx, no NVM switch needed on server — Node v26 is the active interpreter).

The deploy script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subdirectory `markai`, and syncs to the remote path via SSH as `root@techbridge.edu.gh`.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ All five env vars present in .env.local on the server
☐ GEMINI_PROXY_KEY is set — WMS relay must be reachable
☐ Vite build completed if frontend changed (pnpm build)
☐ No --prod flag on pnpm install (all deps needed at runtime)
☐ PM2 start command is: node server.cjs (no tsx, no --import flag)
☐ Health check passes: GET /markai/api/health → { ok: true }
☐ Google OAuth redirect URI matches VITE_GOOGLE_REDIRECT_URI exactly
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
