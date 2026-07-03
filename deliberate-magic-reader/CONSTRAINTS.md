# CONSTRAINTS.md — Deliberate Magic Reader

> Environment specification for the deliberate-magic-reader backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Deliberate Magic Reader |
| PM2 process | `deliberate-magic-reader` |
| Port | **3008** |
| Public URL | `https://ai-tools.techbridge.edu.gh/deliberate-magic-reader/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deliberate-magic-reader/` |
| Stack | React 19 + Vite 8 (frontend) · Express 5 + TypeScript (backend) · Gemini AI (`@google/genai`) · Google OAuth 2.0 |
| Build output | `dist/server.cjs` (esbuild bundle) + `dist/` (Vite static assets) |

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
| tsx | In `devDependencies` only — **not used in production**; server is compiled to `dist/server.cjs` via esbuild at build time |
| PM2 start command | `node dist/server.cjs` (no tsx flag needed — CJS bundle is plain Node) |
| Reverse proxy | nginx (Plesk-managed), proxying `/deliberate-magic-reader/` → `localhost:3008` |

> **Note:** Unlike apps that run `server.ts` directly in production with tsx, this app compiles first. `pnpm build` runs `vite build && esbuild server.ts ...`. Deploy must always include the build step.

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) | WMS-issued service credential — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | Exposed to browser via Vite prefix; also used server-side for token exchange |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URI | Production value: `https://ai-tools.techbridge.edu.gh/magic-reader/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | Server-side only — never expose to client |
| `PORT` | Express listen port | Defaults to `3008` if unset |

All variables must be present in the server `.env` on the production host before PM2 restart.

---

## 5. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
All generateContent calls are relayed to WMS, which adds the key server-side:

```
POST https://wms.techbridge.edu.gh/api/gemini/generate?model=gemini-3.5-flash
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
Body: raw Gemini generateContent JSON
Response: raw Gemini REST response, relayed verbatim
```

- No key cache, no key invalidation — the app has no key to manage
- Missing `GEMINI_PROXY_KEY` → AI routes return HTTP 503 (server still boots)
- Reference implementation: `server.ts` → `callGemini()`; same idiom as biochemai/omniextract
- Migrated from direct `@google/genai` SDK usage on 3 Jul 2026 (SDK dependency removed)
- Do not move Gemini calls to the frontend; the relay credential is server-side only.

---

## 6. Google OAuth 2.0

- Flow: standard authorisation code exchange via `https://oauth2.googleapis.com/token`.
- Callback routes handled at both `/callback` and `/magic-reader/callback` on the Express server.
- On success, a `magic_reader_user` cookie (base64-encoded JSON) is set with `path: '/magic-reader/'`, `httpOnly: false`, `secure: true`, `sameSite: lax`, 7-day TTL.
- The cookie path is scoped to `/magic-reader/` — do not change this or the frontend will not read it.
- Required Google Cloud Console settings: authorised redirect URI must include `https://ai-tools.techbridge.edu.gh/magic-reader/callback`.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

- Always pass `-Build` — production requires the compiled `dist/server.cjs`.
- The script clones/pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `deliberate-magic-reader`.
- Remote path on server: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/magic-reader/` (note: deploy script uses `magic-reader/` not `deliberate-magic-reader/` — confirm this matches the PM2 config on the server).
- Pattern 9 (Express server + PM2) · Pattern 12 (NVM v26) — no tsx flag required at runtime.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ pnpm build completes without errors (vite build + esbuild bundle)
☐ dist/server.cjs is present after build
☐ All five env vars are set in the server .env file
☐ GOOGLE_CLIENT_SECRET is not committed to the repository
☐ OAuth redirect URI in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI
☐ pnpm install run without --prod flag (devDependencies needed for build tooling)
☐ server.ts relays via callGemini() — no GEMINI_API_KEY reference anywhere in server.ts
☐ Health check passes: GET /magic-reader/api/health → { ok: true }
☐ PM2 process named deliberate-magic-reader is running on port 3008
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
