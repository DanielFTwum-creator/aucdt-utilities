# CONSTRAINTS.md — YouTube Description Genie

> Environment specification for the youtube-description-genie backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | youtube-description-genie |
| PM2 process | `youtube-genie` |
| Port | **3018** |
| Public URL | `https://ai-tools.techbridge.edu.gh/youtube-genie/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/youtube-description-genie/` |
| Stack | React 19 · TypeScript · Vite · Express · tsx · Tailwind CSS v4 |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** (declared as `pnpm@11.5.3` in packageManager field) |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** |
| tsx | **In `devDependencies`** — MUST move to `dependencies` before deploying, or PM2 start will fail |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |
| Entry point | `server.ts` — run via `tsx server.ts` |

> **CRITICAL:** `tsx` is currently in `devDependencies`. Running `pnpm install --prod` on the server will omit it and break `pnpm start`. Either move `tsx` to `dependencies` or ensure `pnpm install` is run without `--prod`.

---

## 4. Required Environment Variables

The server reads these via `dotenv.config()` from a `.env` file (not `.env.local`, which is Vite-only).

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Service credential sent as `X-Gemini-Proxy-Key` to the WMS Gemini proxy | Secret — server-side only; never in client bundle |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Prefixed `VITE_` so Vite also exposes it to the frontend |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Server-side only — never expose to client |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URL (default: `https://ai-tools.techbridge.edu.gh/youtube-genie/auth/google/callback`) | Must match the URI registered in Google Cloud Console |
| `PORT` | HTTP port (default: `4173` in code, overridden to `3018` by PM2/deploy script) | Set to `3018` in production |
| `WMS_GEMINI_URL` | Upstream Gemini proxy endpoint (default: `https://wms.techbridge.edu.gh/api/gemini/generate`) | Override only if WMS address changes |

Secrets for production are stored on the server. Local development uses `.env.local` (Vite picks this up; `dotenv` does not — create a separate `.env` for local server testing).

---

## 5. Gemini Proxy Architecture

This app does **not** hold a Gemini API key directly. All AI generation requests flow through the central WMS proxy at `wms.techbridge.edu.gh`:

```
Browser → POST /api/generate (no secret)
  → server.ts relay → WMS (X-Gemini-Proxy-Key: GEMINI_PROXY_KEY)
    → Gemini API
```

The `GEMINI_PROXY_KEY` credential lives only in the server process environment. It is never bundled into the Vite client build. If `GEMINI_PROXY_KEY` is unset, `/api/generate` returns `503`.

---

## 6. Google OAuth Flow

Server-side OAuth code exchange — the client secret never reaches the browser.

| Endpoint | Purpose |
|---|---|
| `GET /auth/google/callback` (also `/{basePath}/auth/google/callback`) | Receives `code` from Google, exchanges for tokens, sets `youtubegenie_user` cookie |
| `POST /api/auth/logout` | Clears `youtubegenie_user` cookie |

Cookie name: `youtubegenie_user` — base64-encoded JSON containing `{ id, username, email }`. Secure + SameSite Lax. Path is derived from `VITE_GOOGLE_REDIRECT_URI`.

The `VITE_GOOGLE_REDIRECT_URI` must be registered as an authorised redirect URI in the Google Cloud Console OAuth client.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx interpreter flag), **Pattern 14** (chmod sweep if needed).

The deploy script pulls from GitHub (`aucdt-utilities` monorepo), copies the `youtube-description-genie` subfolder to the remote path, runs `pnpm install`, `pnpm build`, and restarts the `youtube-genie` PM2 process on port `3018`.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx moved to dependencies (not devDependencies) — required for pnpm install without --prod
☐ pnpm install run with no --prod flag on server (or tsx is in dependencies)
☐ .env on server contains GEMINI_PROXY_KEY, VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI, PORT=3018
☐ VITE_GOOGLE_REDIRECT_URI matches the URI registered in Google Cloud Console
☐ pnpm build succeeds (dist/ directory created)
☐ Health check passes: GET /health → plain text "healthy"
☐ PM2 process youtube-genie is running and stable (pm2 status)
☐ Reverse proxy routes /youtube-genie/ correctly to port 3018
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
