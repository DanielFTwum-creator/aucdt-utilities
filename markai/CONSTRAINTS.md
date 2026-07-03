# CONSTRAINTS.md — MarkAI

> Environment specification for the MarkAI backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | MarkAI |
| PM2 process | `markai` |
| Port | **3000** |
| Public URL | `https://ai-tools.techbridge.edu.gh/markai/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/markai/` |
| Stack | React + Vite (frontend) · Express 5 (CJS backend, `server.cjs`) · `@google/genai` · Google OAuth 2.0 |

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
| Server entry | `server.cjs` — plain CJS; **no tsx required** |
| PM2 interpreter | Node v26, standard (`node server.cjs`) |
| Reverse proxy | nginx (Plesk-managed) |

> **Note:** There is no `server.ts`; the backend is `.cjs`. Do **not** add `--import tsx` to the PM2 config.

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 — server-side client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 — server-side client secret |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth — exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI — exposed to Vite frontend build |
| `PORT` | Express listen port (defaults to `3000` if unset) |
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Optional generate relay override (defaults to `https://wms.techbridge.edu.gh/api/gemini/generate`) |
| `WMS_GEMINI_PREDICT_URL` | Optional Imagen relay override (defaults to `https://wms.techbridge.edu.gh/api/gemini/predict`) |

All vars live in `.env.local` (preferred) or `.env`. The server checks for `.env.local` first at startup.

---

## 5. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

MarkAI never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
All calls are relayed to WMS, which adds the key server-side:

| Path | WMS endpoint |
|---|---|
| Text + image-edit (`generateContent`) | `POST /api/gemini/generate?model=<model>` |
| Imagen text-to-image (`:predict`) | `POST /api/gemini/predict?model=<model>` |

Both authenticated with `X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>`; bodies are raw
Gemini REST JSON, responses relayed verbatim.

- No key cache, no key invalidation — the app has no key to manage
- Missing `GEMINI_PROXY_KEY` → AI routes return HTTP 503 (server still boots)
- Reference implementation: `server.cjs` → `relayGenerate()` / `relayPredict()`; same idiom as dmcdai
- Migrated from the transitional key-fetch mode (`/api/gemini/key` + 6h cache + local `API_KEY` fallback) on 3 Jul 2026
- Known dead code: `components/LiveChatView.tsx` (Live audio chat) still fetches
  `/api/gemini/key`, an endpoint that no longer exists — the feature errors out and
  holds no key. A future fix needs the Live API ephemeral-token flow, not the REST relay.

**Never hardcode a raw Gemini key in this repo.** Always use the WMS relay pattern.

---

## 6. Google OAuth

The backend exposes OAuth endpoints in `server.cjs`. The redirect URI is derived at runtime from the `origin` query parameter supplied by the client — there is no single hardcoded callback URL.

Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_CLIENT_ID`, and `VITE_GOOGLE_REDIRECT_URI` are all set before building or starting the server. The Vite vars must be present at **build time** to be embedded in the frontend bundle.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1          # deploy without rebuilding frontend
.\deploy.ps1 -Build   # rebuild Vite bundle then deploy
```

Pattern applied: **Pattern 9** (Express server + PM2, no tsx, no NVM switch needed on server — Node v26 is the active interpreter).

The deploy script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subdirectory `markai`, and syncs to the remote path via SSH as `root@techbridge.edu.gh`.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ All required env vars present in .env.local on the server
☐ GEMINI_PROXY_KEY is set — WMS relay must be reachable
☐ server.cjs relays via relayGenerate()/relayPredict() — no GEMINI_API_KEY / API_KEY reference in server.cjs
☐ Vite build completed if frontend changed (pnpm build)
☐ No --prod flag on pnpm install (all deps needed at runtime)
☐ PM2 start command is: node server.cjs (no tsx, no --import flag)
☐ Health check passes: GET /markai/api/health → { ok: true }
☐ Google OAuth redirect URI matches VITE_GOOGLE_REDIRECT_URI exactly
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
