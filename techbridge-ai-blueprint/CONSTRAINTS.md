# CONSTRAINTS.md — Techbridge AI Blueprint

> Environment specification for the techbridge-ai-blueprint backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | techbridge-ai-blueprint |
| PM2 process | `tb-ai-blueprint` |
| Port | **3016** |
| Public URL | `https://ai-tools.techbridge.edu.gh/tb-ai-blueprint/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-ai-blueprint/` |
| Stack | React 19 + TypeScript · Vite 5 · Express 5 · Tailwind CSS 4 · Node v26 |

> **Note:** The deploy script and server fallback reference `/blueprint/` and port `3005` — these are stale values. The canonical port is **3016** and the public path is `/tb-ai-blueprint/`. Verify `.env` and nginx config match before deploying.

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
| tsx | **Not in `dependencies`** — must be added before deploying `server.ts` (see §7) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) — proxies `/tb-ai-blueprint/` → `localhost:3016` |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI (must match Google Console) — e.g. `https://ai-tools.techbridge.edu.gh/tb-ai-blueprint/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — server-side only, never expose to frontend |
| `PORT` | Express server port — must be set to `3016` in production `.env` |

> All four variables are required at runtime. If `.env` is missing, the server will start but OAuth will fail silently. Check `.env.local` for local development overrides.

---

## 5. Google OAuth 2.0

This app implements **server-side OAuth code exchange** — the backend (`server.ts`) calls `https://oauth2.googleapis.com/token`, decodes the returned `id_token` JWT, and sets a `blueprint_user` cookie.

Key details:

- Cookie name: `blueprint_user` (base64-encoded JSON; `httpOnly: false` so the frontend can read it)
- Cookie path: `/blueprint/` — **update to `/tb-ai-blueprint/` to match the canonical public URL**
- Fallback: user data is also passed as a `?user=` query param if the cookie is blocked
- Callback routes handled: `GET /callback` and `GET /blueprint/callback` — add `/tb-ai-blueprint/callback` if the path changes
- The `VITE_GOOGLE_REDIRECT_URI` in Google Cloud Console **must exactly match** the value in `.env`; a mismatch causes `redirect_uri_mismatch` errors

---

## 6. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2) · **Pattern 13** (tsx for `server.ts`) · **Pattern 12** (NVM — Node v26 on server)

The deploy script clones from GitHub (`DanielFTwum-creator/aucdt-utilities`) and extracts the `techbridge-ai-blueprint` subfolder on the remote host. Confirm the remote path in the script matches the canonical deploy path above before running.

---

## 7. Pre-Delivery Gate

Before deploying, confirm:

```
☐ PORT=3016 is set in .env on the server (not 3005)
☐ VITE_GOOGLE_REDIRECT_URI matches the URI registered in Google Cloud Console
☐ GOOGLE_CLIENT_SECRET is present in server .env (never committed to git)
☐ tsx is in dependencies (not devDependencies) — required for server.ts at runtime
☐ pnpm install run without --prod flag so tsx is available
☐ Cookie path updated from /blueprint/ to /tb-ai-blueprint/ if using canonical URL
☐ nginx proxy rule points /tb-ai-blueprint/ → localhost:3016
☐ PM2 process name is tb-ai-blueprint and uses Node v26 interpreter
☐ Health check passes: GET /tb-ai-blueprint/api/health → { ok: true }
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
