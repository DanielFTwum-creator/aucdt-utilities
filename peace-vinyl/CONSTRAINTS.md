# CONSTRAINTS.md — Peace Vinyl

> Environment specification for the peace-vinyl backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Peace Vinyl |
| PM2 process | `peace-vinyl` |
| Port | **3026** |
| Public URL | `https://ai-tools.techbridge.edu.gh/peace-vinyl/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace-vinyl/` |
| Stack | React 19 · Vite 6 · Tailwind CSS 4 · Express 4 · Node.js (ESM) · Google Gemini AI · Google OAuth 2.0 |

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
| Server entry | `server.js` (plain Node — no tsx needed) |
| PM2 interpreter | Node v26, standard `node server.js` start |
| Reverse proxy | nginx (Plesk-managed) |

> **Note:** `tsx` is in `devDependencies` only. The production server entry is `server.js` (compiled JS), so `tsx` is not required at runtime. Do **not** move it to `dependencies`.

---

## 4. Required Environment Variables

Store in `.env.local` at project root. The server calls `dotenv.config()` and will `process.exit(1)` if the OAuth vars are missing.

| Variable | Purpose | Required |
|---|---|---|
| `NODE_ENV` | Set to `production` on server | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID (also exposed to frontend via Vite) | Yes |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI registered in Google Cloud Console | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — **server-side only, never expose to client** | Yes |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (exposed to frontend via Vite) | Yes |

---

## 5. Google OAuth 2.0

The Express server handles the OAuth token exchange server-side to keep `GOOGLE_CLIENT_SECRET` off the client.

- **Callback route:** `GET /callback` — receives `code` + `state` from Google and redirects to `/peace/?code=…&state=…`
- **Token exchange route:** `POST /api/auth/google/token` — exchanges the authorisation code for `id_token` + `access_token` and returns decoded user info
- **JWT decode:** Done in-process via `Buffer.from(parts[1], 'base64')` — no `jsonwebtoken` library needed
- Ensure the redirect URI in `VITE_GOOGLE_REDIRECT_URI` exactly matches the URI registered in Google Cloud Console (including trailing slash)

---

## 6. Gemini AI

The `@google/genai` SDK (`^1.29.0`) is used for AI features. The API key is passed via `VITE_GEMINI_API_KEY`, which Vite bakes into the frontend bundle at build time.

- **Warning:** Because the key is a `VITE_` var, it is visible in the compiled frontend bundle. Restrict the key to the production domain in Google Cloud Console.
- No server-side Gemini proxy is present — calls are made directly from the React frontend.

---

## 7. Build & Serve Pattern

```
pnpm build        → outputs to dist/
node server.js    → serves dist/ as static + handles /api/* and /callback routes
```

The SPA fallback (`GET /.*`) serves `dist/index.html` for all unmatched routes. If `dist/index.html` does not exist, the server returns a 404 JSON error — always run `pnpm build` before starting.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 14** (chmod sweep recommended after deploy).

The deploy script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `peace-vinyl`, to `$RemotePath` on `root@techbridge.edu.gh`.

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ pnpm build completes with no errors
☐ dist/index.html exists before starting server
☐ .env.local present on server with all five env vars populated
☐ VITE_GOOGLE_REDIRECT_URI matches the URI registered in Google Cloud Console
☐ GOOGLE_CLIENT_SECRET is NOT a VITE_ prefixed var (it must stay server-side only)
☐ tsx is in devDependencies — confirm it is NOT in dependencies (not needed at runtime)
☐ pnpm install with no --prod flag (devDependencies needed for build)
☐ PM2 process name is exactly `peace-vinyl`
☐ Health check passes: GET /peace-vinyl/api/health → { ok: true } (add this route if not present)
☐ Google Gemini API key restricted to ai-tools.techbridge.edu.gh in Google Cloud Console
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
