# CONSTRAINTS.md — enhanced-youtube-genie

> Environment specification for the YouTube Description Genie backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | YouTube Description Genie |
| Folder | `enhanced-youtube-genie/` |
| PM2 process | `youtube-genie` |
| Port | **3028** |
| Public URL | `https://ai-tools.techbridge.edu.gh/youtube-genie/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/youtube-genie/` |
| Stack | React 19 · TypeScript · Vite · Express · Tailwind CSS 4 |
| SRS reference | TUC-ICT-SRS-2026-016 |

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
| PM2 interpreter | Node v26 + tsx |
| Entry point | `server.ts` (serves API relay + compiled React SPA) |
| Reverse proxy | nginx (Plesk-managed) — proxies `/youtube-genie/api/` to `:3028` |

---

## 4. Required Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Yes | Authenticates with the WMS Gemini key proxy. Set in `.env` on the server. |
| `WMS_GEMINI_URL` | No | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate`. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID. Also set as `VITE_GOOGLE_CLIENT_ID` for the frontend. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret. Server-side only — never in the React bundle. |
| `VITE_GOOGLE_CLIENT_ID` | Build-time | Baked into the frontend bundle for the OAuth initiation flow. |
| `VITE_GOOGLE_REDIRECT_URI` | Build-time | Defaults to `https://ai-tools.techbridge.edu.gh/youtube-genie/callback`. |
| `PORT` | No | Defaults to `3028`. Do not change in production. |

No `.env` file is committed. Maintain `.env.local` for local dev; server uses `.env`.

**Do not add a `GEMINI_API_KEY`** — the direct Gemini key was revoked after the WMS proxy migration. The app routes all AI calls through `server.ts` → WMS proxy.

---

## 5. Authentication

This app uses **Google OAuth** (not WMS SSO). The OAuth flow:

1. Browser redirects to Google with `VITE_GOOGLE_CLIENT_ID`.
2. Google redirects to `/youtube-genie/callback` with an auth code.
3. `server.ts` exchanges the code for tokens using `GOOGLE_CLIENT_SECRET`.
4. A `youtube-genie_user` cookie (HttpOnly, Secure, 7-day) is set for the session.
5. `AuthGate.tsx` reads this cookie client-side to gate access to the app.

---

## 6. Gemini AI Integration

All AI calls route through the central TUC WMS Gemini key proxy. The browser never calls Gemini directly.

```
Browser → POST /youtube-genie/api/generate
  → server.ts relay (adds X-Gemini-Proxy-Key header)
  → https://wms.techbridge.edu.gh/api/gemini/generate
  → Google Gemini
```

No `@google/genai` client import exists in this repo. The relay is in `server.ts`.

---

## 7. Build and Serve Pattern

`server.ts` serves both the Express relay endpoints and the compiled React SPA from `dist/`.

```bash
pnpm build        # Vite compiles React → dist/
pnpm start        # tsx server.ts — API relay + dist/ on port 3028
```

Local dev: `pnpm dev` runs the Vite dev server (port 5173). The server.ts relay is not used in dev mode — configure a local `.env.local` with a valid `GEMINI_PROXY_KEY` to test AI features locally.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2) · **Pattern 17** (fleet Node/PM2 deploy)
· **Pattern 18** (pnpm 11 `allowBuilds`).

**Key deploy decisions (30 June 2026):**

- Install steps use `pnpm install --silent 2>/dev/null || npm install` fallback — do not
  fight pnpm 11 build approval; npm runs esbuild/oxide lifecycle scripts without restriction.
- `pnpm-workspace.yaml` uses pnpm 11 `allowBuilds` format (NOT the removed `onlyBuiltDependencies`).
- PM2 uses `--interpreter npx --interpreter-args tsx` — more portable than a hardcoded binary path.
- `tsx` is in `dependencies` (not `devDependencies`) so it survives `pnpm install --prod`.

nginx proxy location block: `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_nginx.conf`

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_PROXY_KEY is set in .env on the server
☐ GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env on the server
☐ No GEMINI_API_KEY in .env — that key was revoked; use GEMINI_PROXY_KEY only
☐ tsx is in dependencies (not devDependencies)
☐ pnpm build completes without TypeScript errors (pnpm lint)
☐ Health check passes: GET https://ai-tools.techbridge.edu.gh/youtube-genie/ → 200
☐ PM2 process name is youtube-genie, port 3028
☐ OAuth callback URL in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI
```

---

*Authored 2026-06-30 — Daniel Frempong Twum / TUC ICT*
