# CONSTRAINTS.md — Deep Dub Vibes Player

> Environment specification for the deep-dub-vibes-player backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Deep Dub Vibes Player |
| PM2 process | `deep-dub-vibes-player` |
| Port | **3023** |
| Public URL | `https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deep-dub-vibes-player/` |
| Stack | React 19 · Vite 8 · Tailwind CSS 4 · Express 5 · TypeScript · Node.js (ESM server) |

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
| tsx | In `devDependencies` — **must be moved to `dependencies`** before deploying if `server.ts` is used; available after `pnpm install` (no `--prod`) |
| Server entry | `server.js` (compiled ESM — built via esbuild or vite; see deploy script) |
| PM2 interpreter | Node v26; no `--import tsx` flag needed if server is pre-compiled to `server.js` |
| Reverse proxy | nginx (Plesk-managed) |

> **Warning:** `tsx` is currently in `devDependencies`. If the server is run directly as TypeScript via tsx in PM2, move it to `dependencies`. If PM2 runs the compiled `server.js`, tsx is not needed at runtime.

---

## 4. Required Environment Variables

All vars must be present in `.env.local` on the server at the deploy path.

| Variable | Purpose | Notes |
|---|---|---|
| `NODE_ENV` | Runtime mode | Set to `production` on server |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | Read by both Vite (frontend) and Express (backend) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI | Must match Google Console exactly — `https://ai-tools.techbridge.edu.gh/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | **Server-side only** — never expose to client bundle |
| `VITE_GEMINI_API_KEY` | Gemini AI API key (`@google/genai`) | Prefixed with `VITE_` — currently exposed to client bundle; review if this should be proxied server-side |

> **Security note:** `VITE_GEMINI_API_KEY` is a Vite public env var and will be embedded in the built client bundle. If the key should remain private, move Gemini calls to a backend proxy endpoint and rename the var (remove `VITE_` prefix).

---

## 5. Google OAuth Flow

The Express server handles the server-side leg of the OAuth 2.0 authorisation code flow.

- **Callback route:** `GET /callback` — receives `code` and `state` from Google, redirects to `/deep-dub-vibes-player/?code=...&state=...`
- **Token exchange route:** `POST /api/auth/google/token` — exchanges authorisation code for `id_token` + `access_token` using `GOOGLE_CLIENT_SECRET`; decodes the JWT locally and returns user info to the client
- The React SPA completes the flow by reading query params on load
- Google Console must have `https://ai-tools.techbridge.edu.gh/callback` listed as an authorised redirect URI

---

## 6. Gemini AI Integration

- Package: `@google/genai` v2.6.0
- API key supplied via `VITE_GEMINI_API_KEY`
- Calls are currently made from the **client side** (Vite public env var)
- If usage limits or key security become a concern, proxy calls through Express and use a non-`VITE_` prefixed server-only variable

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
.\deploy.ps1 -Build   # include Vite build step
```

Applies: **Pattern 9** (Express server + PM2) · **Pattern 14** (chmod sweep if needed).

The deploy script pulls from GitHub (`aucdt-utilities` monorepo, `deep-dub-vibes-player` subfolder), runs `pnpm install`, optionally runs `pnpm build`, and restarts the PM2 process.

> **Port note:** The server code defaults to `process.env.PORT || 3009`. Ensure `PORT=3023` is set in `.env.local` on the server, or PM2 ecosystem config passes the correct port — otherwise the process will bind to 3009, not 3023.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ PORT=3023 is set in .env.local on the server (server.js falls back to 3009 if missing)
☐ VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI are set and valid
☐ VITE_GEMINI_API_KEY is set (and key exposure risk accepted or mitigated)
☐ Google Console has https://ai-tools.techbridge.edu.gh/callback as an authorised redirect URI
☐ tsx moved to dependencies if PM2 runs server via tsx (not pre-compiled server.js)
☐ pnpm install with no --prod flag
☐ pnpm build completes without errors
☐ PM2 process named exactly `deep-dub-vibes-player`
☐ Health check passes: GET /deep-dub-vibes-player/ returns the React app (no 404)
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
