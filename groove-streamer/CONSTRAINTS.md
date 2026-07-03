# CONSTRAINTS.md — Groove Streamer

> Environment specification for the groove-streamer backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Groove Streamer |
| PM2 process | `groove-streamer` |
| Port | **3004** |
| Public URL | `https://ai-tools.techbridge.edu.gh/groove-streamer/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/groove-streamer/` |
| Stack | React 19 · TypeScript · Express · Vite · Tailwind CSS v4 · Google Gemini AI (`@google/genai`) · Google OAuth 2.0 |

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
| Reverse proxy | nginx (Plesk-managed) |
| Entry point | `server.ts` (ESM, uses dynamic `import()` for Vite in dev only) |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_PROXY_KEY` | WMS-issued relay credential (Pattern 11) — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Optional relay endpoint override — defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — server-side only, never exposed to client |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — must match Google Console exactly; production value is `https://ai-tools.techbridge.edu.gh/groove-streamer/callback` |
| `VITE_BASENAME` | Vite router basename — set to `/groove-streamer` for production sub-path routing |
| `PORT` | Express listen port — defaults to `3004` if unset |

> Config is loaded from `.env.local` if present, otherwise falls back to `.env`. Never commit either file.
> A `SESSION_SECRET` env var is consumed by `express-session`; if absent it falls back to the hard-coded string `super-secret-key` — **always set this in production**.

---

## 5. Google OAuth 2.0

- OAuth flow is handled entirely server-side in `server.ts`.
- Callback routes: `/callback` and `/groove-streamer/callback` — both are registered to handle Plesk reverse-proxy path variations.
- On success, user identity is stored in a base64-encoded cookie `groove_streamer_user` (non-HttpOnly so the React client can read it).
- Session cookies are configured `secure: true`, `sameSite: 'none'` — the app **requires HTTPS**; local HTTP testing will break cookie handling.
- Ensure `VITE_GOOGLE_REDIRECT_URI` is whitelisted in the Google Cloud Console OAuth credentials for the project.

---

## 6. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
The Lyria groove route relays generateContent calls to WMS, which adds the key server-side
(`X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>` against `WMS_GEMINI_URL`, model
`lyria-3-clip-preview`, `responseModalities: ["AUDIO"]`).

- Missing `GEMINI_PROXY_KEY` → `/api/groove` returns HTTP 503 (server still boots)
- Migrated from the SDK `generateContentStream` path on 3 Jul 2026: the relay is
  request/response, so the full clip now arrives in one JSON body instead of a stream.
  **Verify a real groove generation on first deploy** — audio responses are large and the
  WMS-side body limit must accommodate them. The `@google/genai` dependency is removed.
- The Express JSON body limit stays at `25mb` for the large audio base64 payloads.
- All Gemini calls must route through the Express API — never call Gemini from frontend code.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Or with a fresh Vite build:

```powershell
.\deploy.ps1 -Build
```

Applies:
- **Pattern 9** — Express server + PM2 process management
- **Pattern 13** — tsx as the ESM loader (`--import node_modules/tsx/dist/esm/index.mjs`)
- **Pattern 12** — NVM used to pin Node v26 on the server

The deploy script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `groove-streamer`, via an approval gate (`Approve-App.ps1`) before proceeding.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx is in dependencies (not devDependencies) — server.ts is the entry point
☐ vite is NOT imported at the top level of server.ts — dev-only branch uses dynamic import()
☐ All six env vars are present in .env or .env.local on the server
☐ SESSION_SECRET is set to a strong random value in production
☐ VITE_GOOGLE_REDIRECT_URI matches the registered URI in Google Cloud Console
☐ pnpm install run with no --prod flag (tsx must be available)
☐ Health check passes: GET /groove-streamer/api/health → { ok: true }
☐ OAuth callback reachable: https://ai-tools.techbridge.edu.gh/groove-streamer/callback
☐ Cookie behaviour verified over HTTPS — session cookies will not work over HTTP
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
