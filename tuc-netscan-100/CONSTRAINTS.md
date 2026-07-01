# CONSTRAINTS.md — TUC NetScan 100

> Environment specification for the tuc-netscan-100 backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | TUC NetScan 100 |
| PM2 process | `tuc-netscan-100` (deploy.ps1 uses alias `tuc-netscan-backend`) |
| Port | **3027** |
| Public URL | `https://netscan.techbridge.edu.gh` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/netscan/` |
| Stack | React 19 · TypeScript · Vite 8 · Express 5 · Tailwind CSS 4 · Gemini AI (`@google/genai`) |
| SRS reference | TUC-ICT-SRS-2026-013 |

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
| tsx | In `dependencies` — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Entry point | `server.ts` (unified full-stack server — serves API + compiled React SPA) |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Gemini AI diagnosis gateway. If absent or contains `MY_GEMINI_API_KEY`, the server falls back to local expert rules — no crash, but AI features are disabled. Set in `.env` on the server. |
| `WMS_BASE` | No | Base URL for WMS SSO token validation. Defaults to `http://127.0.0.1:8081` (server-to-server, bypasses WAF). Override if WMS runs on a different port. |
| `PORT` | No | Defaults to `3027`. Do not change in production. |
| `NETSCAN_LOCAL_MODE` | Dev only | Set to `1` to bypass WMS SSO on the backend. **Never set this on the production server** — it disables all authentication. |
| `VITE_WMS_BASE` | Build-time | Frontend SSO base URL. Defaults to `https://wms.techbridge.edu.gh`. Set at build time if WMS is on a custom domain. |
| `VITE_NETSCAN_LOCAL_MODE` | Dev only | Set to `1` at build time to skip the SSO gate in the React frontend. Pair with `NETSCAN_LOCAL_MODE=1` on the backend. |
| `DISABLE_HMR` | Dev only | Set to `true` in AI Studio / agentic environments to disable Vite HMR and file watching. |

No `.env` file is committed. Create `.env` on the server with at minimum `GEMINI_API_KEY`.

---

## 5. WMS SSO Authentication

All `/api/v1` routes are gated by the `requireWmsAuth` middleware (`src/server/wmsAuthMiddleware.ts`).

- The frontend obtains a Bearer token via the WMS SSO flow (`src/auth.tsx`).
- Every API request must include `Authorization: Bearer <token>`.
- The middleware validates the token against `WMS_BASE/api/me` (server-to-server call).
- Only `@techbridge.edu.gh` email addresses are permitted — all others receive `403 Forbidden`.
- Validated tokens are cached in-memory for 60 seconds to avoid hammering WMS.
- **Never remove or bypass this middleware in production.**

---

## 6. Gemini AI Integration

- Package: `@google/genai` v2+ (not the legacy `@google-ai/generativelanguage`).
- Model used: `gemini-3.5-flash`.
- The integration is in `src/server/api.ts` — `askGeminiForDiagnosis()`.
- If `GEMINI_API_KEY` is missing or is the placeholder string, the function returns local expert rules rather than throwing. The app remains fully functional without the key.

---

## 7. Build & Serve Pattern

This is a **unified full-stack server** — `server.ts` both serves the Express API and static React assets from `dist/`. There is no separate frontend server in production.

```
pnpm build        # Vite compiles React → dist/
pnpm start        # tsx server.ts — serves API + dist/ on port 3027
```

In development, `pnpm dev` runs Vite's dev server (port 3000) with the NetScan API mounted directly via a Vite plugin — no separate Express process needed.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1
```

Applies: **Pattern 9** (Express server + PM2) · **Pattern 13** (tsx entry point) · **Pattern 14** (chmod sweep if needed).

nginx vhost_nginx.conf (API proxy location): `/var/www/vhosts/system/netscan.techbridge.edu.gh/conf/vhost_nginx.conf`

The deploy script SSHs to `root@66.226.72.199`, pulls from GitHub, runs `pnpm install`, `pnpm build`, then restarts the PM2 process.

Note: `deploy.ps1` uses PM2 app name `tuc-netscan-backend` — ensure the PM2 ecosystem config or `pm2 start` command matches this name.

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_API_KEY is set in .env on the server (not the placeholder value)
☐ WMS_BASE points to the correct WMS instance (default: http://127.0.0.1:8081)
☐ NETSCAN_LOCAL_MODE is NOT set (or is unset) on the production server
☐ tsx is in dependencies (not devDependencies) — confirmed in package.json
☐ pnpm install run without --prod flag so tsx is available
☐ pnpm build completes without TypeScript errors (pnpm lint)
☐ Health check passes: GET https://netscan.techbridge.edu.gh → 200
☐ WMS SSO gate is active: unauthenticated GET /api/v1/* → 401
☐ PM2 process name matches deploy.ps1: tuc-netscan-backend
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
