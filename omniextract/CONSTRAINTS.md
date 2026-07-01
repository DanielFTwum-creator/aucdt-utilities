# CONSTRAINTS.md — OmniExtract

> Environment specification for the OmniExtract backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | OmniExtract |
| PM2 process | `omniextract` |
| Port | **3005** |
| Public URL | `https://ai-tools.techbridge.edu.gh/omniextract/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/omniextract/` |
| Stack | TypeScript · Express · Vite (React frontend) · Google OAuth 2.0 · WMS Gemini Proxy |

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
| tsx | Must be in `dependencies` (not `devDependencies`) — used to run `server.ts` |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Express listen port — defaults to `3005` if unset |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID (used server-side and exposed to Vite frontend) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret (server-side only — never expose to frontend) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URL — production value: `https://ai-tools.techbridge.edu.gh/omniextract/callback` |
| `GEMINI_API_KEY` | Present in `.env` but **not used directly** — OmniExtract proxies all Gemini calls through WMS (see §5) |
| `VITE_WMS_BASE` | Base URL of the WMS Gemini proxy — defaults to `https://wms.techbridge.edu.gh` if unset |

> Note: `GEMINI_API_KEY` is listed in `.env` for legacy reasons. OmniExtract does **not** call Gemini directly. Do not wire new code to use this key. All `generateContent` calls must go through the WMS proxy.

---

## 5. Google OAuth 2.0

OmniExtract uses Google OAuth for user authentication. The full OAuth exchange is handled server-side in `server.ts`.

- Client ID is `VITE_GOOGLE_CLIENT_ID` (Vite-prefixed so it is available in the frontend build for the sign-in button).
- Client secret is `GOOGLE_CLIENT_SECRET` — server-side only.
- Redirect URI must exactly match the value registered in Google Cloud Console.
- The callback route is `/omniextract/callback`.
- Session state is managed via `cookie-parser` (no database session store).

---

## 6. WMS Gemini Proxy

OmniExtract does **not** hold a Gemini API key and never calls `generativelanguage.googleapis.com` directly.

- All `generateContent` calls are forwarded to `${VITE_WMS_BASE}/api/gemini/generate`.
- WMS authenticates this service via `GEMINI_PROXY_KEY` (a service credential distinct from the Gemini API key itself).
- If WMS is unreachable, extraction will fail — surface a clear error to the user rather than silently returning empty data.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
.\deploy.ps1 -Build   # includes Vite production build before rsync
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx for TypeScript server), **Pattern 14** (chmod sweep on deploy path).

The deploy script:
1. Runs `pnpm install` on the remote (no `--prod` flag — tsx must be available).
2. Optionally runs `pnpm build` locally and rsyncs `dist/` to the server.
3. Restarts the PM2 process `omniextract`.
4. Hits the health URL `https://ai-tools.techbridge.edu.gh/omniextract` to confirm liveness.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx is in dependencies (not devDependencies) — server.ts is executed via tsx
☐ pnpm install run without --prod flag on remote
☐ VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI set in server .env
☐ VITE_WMS_BASE set and WMS /api/gemini/generate endpoint is reachable
☐ OAuth redirect URI in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI exactly
☐ Health check passes: GET /omniextract → HTTP 200
☐ No direct Gemini API key calls remain in server.ts — all extraction routes proxy through WMS
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
