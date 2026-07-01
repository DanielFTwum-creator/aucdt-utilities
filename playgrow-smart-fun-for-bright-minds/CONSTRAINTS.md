# CONSTRAINTS.md — PlayGrow: Smart Fun for Bright Minds

> Environment specification for the PlayGrow backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | playgrow-smart-fun-for-bright-minds |
| PM2 process | `playgrow` |
| Port | **3025** |
| Public URL | `https://ai-tools.techbridge.edu.gh/playgrow/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/playgrow-smart-fun-for-bright-minds/` |
| Stack | React 19 + Vite + TypeScript · Express (server.ts) · Tailwind CSS v4 · Google OAuth 2.0 · Gemini via WMS proxy relay |

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
| tsx | In `devDependencies` — **must be moved to `dependencies`** before deploying; `pnpm install` (no `--prod`) makes it available |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

> **Warning:** `tsx` is currently in `devDependencies`. The PM2 process runs `tsx server.ts` in production, so `tsx` must be in `dependencies` or `pnpm install` must be run without `--prod`. Confirm before every deploy.

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — exposed to Vite/browser build |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — defaults to `https://ai-tools.techbridge.edu.gh/playgrow/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — **server-side only, never expose to client** |
| `PORT` | Listening port — must be `3025` in production (server.ts defaults to 3015 if unset; `.env` must set this explicitly) |
| `WMS_GEMINI_URL` | WMS central Gemini proxy endpoint — defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `GEMINI_PROXY_KEY` | Service credential for the WMS Gemini relay — **server-side only** |

All variables are loaded via `dotenv` from `.env` at startup. If any are missing, check `.env.local` on the server.

> **Note on PORT:** `server.ts` defaults to `3015` if `PORT` is unset. This collides with willpro. The production `.env` **must** explicitly set `PORT=3025`.

---

## 5. Google OAuth 2.0

This app uses the Google OAuth 2.0 authorisation code flow, handled entirely server-side via `server.ts`.

- The browser redirects to Google using `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI`.
- Google returns the authorisation code to `/playgrow/callback`.
- The server exchanges the code for tokens using `GOOGLE_CLIENT_SECRET` (never sent to the browser).
- A decoded JWT payload is stored in a `playgrow_user` cookie (`httpOnly: false`, `secure: true`, `sameSite: lax`, scoped to `/playgrow/`).
- **Authorised redirect URIs** in the Google Cloud Console must include `https://ai-tools.techbridge.edu.gh/playgrow/callback`.
- Do not alter the cookie path or name without updating the client-side session logic.

---

## 6. Gemini Proxy Relay

This app holds **no Gemini API key**. All AI generation is routed through the central WMS proxy at `wms.techbridge.edu.gh`.

- The browser calls `/playgrow/api/generate` (POST).
- `server.ts` forwards the raw `generateContent` body to `WMS_GEMINI_URL` with the `GEMINI_PROXY_KEY` service credential in the `X-Gemini-Proxy-Key` header.
- Never add a direct Gemini key to this app — use the WMS relay exclusively.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Applies the following patterns:
- **Pattern 9** — Express server (`server.ts`) managed by PM2
- **Pattern 12** — NVM / Node v26 on the server
- **Pattern 13** — `tsx` used as the PM2 interpreter (`--import node_modules/tsx/dist/esm/index.mjs`)

The deploy script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `playgrow-smart-fun-for-bright-minds`, runs `pnpm install` and `pnpm build` on the server, then restarts the `playgrow` PM2 process.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ PORT=3025 is set explicitly in the server .env (default in server.ts is 3015 — wrong port)
☐ GOOGLE_CLIENT_SECRET is set in the server .env (never in Vite/client env)
☐ WMS_GEMINI_URL and GEMINI_PROXY_KEY are set in the server .env
☐ Authorised redirect URI https://ai-tools.techbridge.edu.gh/playgrow/callback is registered in Google Cloud Console
☐ tsx is in dependencies (not devDependencies only) — required for PM2 to run server.ts
☐ pnpm install run without --prod flag so tsx is available
☐ pnpm build completes without errors
☐ Health check passes: GET /playgrow/api/health → { ok: true, service: "playgrow", port: 3025 }
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
