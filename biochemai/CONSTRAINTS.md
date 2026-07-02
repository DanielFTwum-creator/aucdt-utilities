# CONSTRAINTS.md — BioChemAI

> Environment specification for the BioChemAI backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | BioChemAI |
| PM2 process | `biochemai` |
| Port | **3002** |
| Public URL | `https://ai-tools.techbridge.edu.gh/biochemai/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/biochemai/` |
| Stack | React 19 + Vite (frontend) · Express + tsx (backend) · Node v26 |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** (enforced via `packageManager: pnpm@11.5.3`) |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** (`/root/.nvm/versions/node/v26.3.1/bin/node`) |
| tsx | In `dependencies` — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |
| `.env` file | Copied from `.env.local` → `${DEPLOY_PATH}/.env` by `deploy.ps1` |

---

## 4. Required Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `GEMINI_PROXY_KEY` | WMS-issued secret | Authenticates the generate relay to WMS (Pattern 11) |
| `WMS_GEMINI_URL` | Optional override | Relay endpoint; defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `VITE_GOOGLE_CLIENT_ID` | Google Workspace console | OAuth client ID (frontend + server) |
| `GOOGLE_CLIENT_SECRET` | Google Workspace console | OAuth token exchange (server only) |
| `VITE_GOOGLE_REDIRECT_URI` | Deploy config | OAuth callback URI |
| `PORT` | deploy.ps1 (`3002`) | Express listen port |

**Never hardcode any of these.** All read via `dotenv.config()` at startup.

---

## 5. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

BioChemAI never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
All generateContent calls are relayed to WMS, which adds the key server-side:

```
POST https://wms.techbridge.edu.gh/api/gemini/generate?model=gemini-2.5-flash
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
Body: raw Gemini generateContent JSON (contents / systemInstruction / tools / generationConfig)
Response: raw Gemini REST response, relayed verbatim
```

- No key cache, no key invalidation — the app has no key to manage
- Missing `GEMINI_PROXY_KEY` → AI routes return HTTP 503 (server still boots)
- Reference implementation: `server.ts` → `callGemini()`; same idiom as omniextract
- Migrated from the transitional key-fetch mode on 2 Jul 2026
- Known dead code: `components/voice/VoiceContainer.tsx` reads `process.env.API_KEY`
  (never injected by vite.config) — voice mode is non-functional and holds no key.
  A future fix needs the Live API ephemeral-token flow, not the REST relay.

---

## 6. Auth Flow

- **Google OAuth 2.0** — Authorization Code flow (backend token exchange)
- Callback: `GET /biochemai/callback` → exchanges code → sets `biochemai_user` cookie (base64 JSON, httpOnly: false for AuthContext hydration)
- Cookie scope: `path: /biochemai/`, `secure: true`, `sameSite: lax`, 7-day TTL
- No JWT; session lives entirely in the cookie + localStorage

---

## 7. Deploy Pattern (Pattern 9 + 12 + 13)

```powershell
.\deploy.ps1 -Build   # full: git clone → pnpm build → rsync → pnpm install → pm2 restart
.\deploy.ps1          # frontend only: scp dist → pm2 reload
```

- NVM v26 sourced before every server-side `pnpm install` and PM2 command
- PM2 uses `--cwd ${DEPLOY_PATH}` so `dotenv.config()` resolves `.env` correctly
- `pnpm install` — no `--prod` flag (tsx must survive install)

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ server.ts relays via callGemini() — no GEMINI_API_KEY reference anywhere in server.ts
☐ No process.exit(1) on missing proxy key — AI routes return HTTP 503 instead
☐ tsx is in dependencies (not devDependencies) in package.json
☐ pnpm build succeeds locally
☐ Health check passes: GET /biochemai/api/health → { ok: true }
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
