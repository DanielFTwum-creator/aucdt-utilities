# CONSTRAINTS.md — Patois Lyricist v2.0.0

> Environment specification for the patois-lyricist-v2.0.0 backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Patois Lyricist v2.0.0 |
| PM2 process | `patois-lyricist` |
| Port | **3028** |
| Public URL | `https://ai-tools.techbridge.edu.gh/patois-lyricist/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois-lyricist-v2.0.0/` |
| Stack | React 19 · TypeScript · Express 5 · Vite · tsx · Google GenAI (`@google/genai`) |

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
| tsx | In `dependencies` — available after `pnpm install` (no `--prod` flag) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Entry point | `server.ts` |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates requests to the WMS Gemini key broker at `wms.techbridge.edu.gh` | **Required in production.** Without it the AI routes fail. Local dev may fall back to `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY`. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — exposed to the frontend via Vite | Set in `.env` or `.env.local` |
| `VITE_GOOGLE_REDIRECT_URI` | Full callback URL used by both the frontend and the server to derive `basePath` | Default: `https://ai-tools.techbridge.edu.gh/patois/auth/google/callback` |
| `GOOGLE_CLIENT_SECRET` | Server-side Google OAuth secret — never exposed to the client | Set in `.env.local` only; never commit |

> `.env` is loaded first; `.env.local` is loaded second with `override: true`, so `.env.local` wins on conflicts.

---

## 5. Gemini AI — WMS Key Proxy

The server does **not** hold a raw Gemini API key in production. Instead it calls the internal WMS broker:

```
GET https://wms.techbridge.edu.gh/api/gemini/key
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
```

- The resolved key is cached in-process for **6 hours** (TTL: `KEY_TTL_MS`).
- If `GEMINI_PROXY_KEY` is absent, the server logs a warning and falls back to `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` (local dev only).
- Never set a raw `GEMINI_API_KEY` in production — always use `GEMINI_PROXY_KEY`.

---

## 6. Google OAuth

- Server-side authorisation code exchange is handled at:
  - `GET /auth/google/callback`
  - `GET /<basePath>/auth/google/callback`
- `basePath` is derived at startup by parsing `VITE_GOOGLE_REDIRECT_URI`; it defaults to `/patois` if the URI cannot be parsed.
- `GOOGLE_CLIENT_SECRET` is used exclusively server-side — confirm it is **never** injected into the Vite build.
- The client ID (`VITE_GOOGLE_CLIENT_ID`) is intentionally public and safe to expose via Vite.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

- **Pattern 9** — Express server (`server.ts`) managed by PM2.
- **Pattern 13** — tsx used as the runtime interpreter (`tsx server.ts`); tsx must remain in `dependencies`, not `devDependencies`.
- The deploy script clones/pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, extracts the `patois-lyricist-v2.0.0` subfolder, and deploys to the remote path via SSH (`root@techbridge.edu.gh`).
- `pnpm install` must be run **without** `--prod` so that tsx (in `dependencies`) is available to PM2.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_PROXY_KEY is set in the server environment (not just .env.local)
☐ GOOGLE_CLIENT_SECRET is set server-side and absent from the Vite build output
☐ VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI are set correctly for production
☐ tsx is in dependencies (not devDependencies) — required by PM2 at runtime
☐ pnpm install run with no --prod flag
☐ PORT env var set to 3028 in PM2 config / ecosystem file
☐ Health check passes: GET /patois-lyricist/api/health → { ok: true }
☐ OAuth callback URL matches VITE_GOOGLE_REDIRECT_URI exactly (including path)
☐ tsc --noEmit passes with no type errors before build
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
