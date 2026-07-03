# CONSTRAINTS.md — TUC AI Lab Catalog

> Environment specification for the tuc-ai-lab-catalog backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | TUC AI Lab Catalog |
| PM2 process | `tuc-ai-lab` |
| Port | **3003** |
| Public URL | `https://ai-tools.techbridge.edu.gh/ai-lab/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/tuc-ai-lab-catalog/` |
| Stack | TypeScript · Express · Vite · tsx · Google OAuth 2.0 · Gemini AI |

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
| Entry point | `server.ts` (runs via `tsx server.ts`) |
| Production detection | `NODE_ENV=production` — must be set in PM2 config; do NOT rely on directory heuristics |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID (exposed to frontend via Vite) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — must match Google Console exactly (e.g. `https://ai-tools.techbridge.edu.gh/ai-lab/callback`) |
| `GOOGLE_CLIENT_SECRET` | Server-side OAuth secret — never expose to frontend |
| `GEMINI_PROXY_KEY` | WMS-issued relay credential (Pattern 11) — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Optional relay endpoint override — defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |

Env file loading order: `.env.local` (checked first) → `.env` (fallback). Store secrets in `.env.local`; never commit it.

---

## 5. Google OAuth 2.0

The OAuth code exchange is performed **server-side** to avoid WAF blocks on URL parameters. Flow:

1. Frontend redirects user to Google's authorisation endpoint.
2. Google redirects to `/ai-lab/callback` (or `/callback`) with `code` and `state`.
3. `server.ts` exchanges the code for tokens via `POST https://oauth2.googleapis.com/token`.
4. Tokens are set as cookies and the user is redirected to `/ai-lab/`.

**Critical:** `VITE_GOOGLE_REDIRECT_URI` must be registered in Google Cloud Console under "Authorised redirect URIs". Any mismatch causes `redirect_uri_mismatch` errors.

---

## 6. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
The dictation route relays generateContent calls to WMS, which adds the key server-side
(`X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>` against `WMS_GEMINI_URL`). Missing
`GEMINI_PROXY_KEY` → the dictation route returns HTTP 503 (server still boots).
All Gemini requests must go through Express API routes, not direct frontend fetch calls.
Migrated from a direct `generativelanguage.googleapis.com` call on 3 Jul 2026.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

The script targets `root@techbridge.edu.gh` and deploys to `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-lab/` (note: deploy script uses `/ai-lab/` as the remote path alias). PM2 app name is `tuc-ai-lab` on port 3003.

Applies:
- **Pattern 9** — Express server + PM2
- **Pattern 13** — tsx as the runtime interpreter
- **Pattern 12** — NVM / Node v26 on server

PM2 start command must include:
```bash
NODE_ENV=production node --import node_modules/tsx/dist/esm/index.mjs server.ts
```

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ NODE_ENV=production is set in the PM2 ecosystem config or start command
☐ tsx is in dependencies (not devDependencies)
☐ pnpm install with no --prod flag (tsx must be installed)
☐ VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET, GEMINI_PROXY_KEY are set in .env.local on the server
☐ server.ts relays via WMS — no GEMINI_API_KEY reference anywhere in server.ts
☐ VITE_GOOGLE_REDIRECT_URI matches the registered URI in Google Cloud Console exactly
☐ Vite build completes without errors (pnpm run build)
☐ Health check passes: GET https://ai-tools.techbridge.edu.gh/ai-lab → HTTP 200
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
