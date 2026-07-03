# CONSTRAINTS.md — SmartScale AI Presentation Platform

> Environment specification for the SmartScale AI Presentation Platform app.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | SmartScale AI Presentation Platform |
| PM2 process | `smartscale-ai-presentation-platform` (proposed; not yet deployed) |
| Port | **3036** (reserved in SERVER_PORTS.md, 1 Jul 2026; not yet binding) |
| Public URL | `https://ai-tools.techbridge.edu.gh/smartscale-ai-presentation-platform/` (planned) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/smartscale-ai-presentation-platform/` (planned) |
| Stack | React + Vite (frontend) · Express + tsx (backend) · Node v26 |
| Status | **Not yet deployed** — port reserved, deploy.ps1 and server.ts defaults already set to 3036 |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production, once deployed)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** |
| tsx | In `dependencies` — available after `pnpm install` (no `--prod`) |
| Reverse proxy | nginx (Plesk-managed) — vhost route must be added at first deploy |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) | WMS-issued shared fleet credential — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Frontend + server-side token exchange |
| `GOOGLE_CLIENT_SECRET` | Google OAuth token exchange | Server-side only — never expose to client |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URI | Must match Google Cloud Console exactly |
| `PORT` | Express listen port | Must be `3036` — matches the SERVER_PORTS.md reservation |

---

## 4a. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
The server route `/api/gemini/generate (raw generateContent bodies from the SPA)` relays calls to WMS, which adds the key server-side
(`X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>`).

- Missing `GEMINI_PROXY_KEY` -> the AI route returns HTTP 503 (server still boots)
- Migrated on 3 Jul 2026 from a broken frontend SDK call (`process.env` is undefined
  in the browser bundle); `@google/genai` has been removed

---

## 5. Deploy Pattern (first deploy checklist)

```powershell
cd C:\Development\github\aucdt-utilities\smartscale-ai-presentation-platform
.\deploy.ps1 -Build
```

At first deploy, in order:
1. Add the nginx vhost route for `/smartscale-ai-presentation-platform/` (SPA + `/api/` proxy to 3036)
2. Create the server `.env` and copy `GEMINI_PROXY_KEY` into it file-to-file from an already-relayed app (never echo the value)
3. Register the OAuth redirect URI in Google Cloud Console
4. `pm2 start` with `--cwd` at the deploy path; confirm the binding via `ss -ltnp` + `/proc/<pid>/cwd`
5. Update SERVER_PORTS.md: move this app from "Reserved" to "Actually listening"

---

## 6. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx, express, cookie-parser, dotenv are in dependencies (added 3 Jul 2026)
☐ pnpm build succeeds locally
☐ pnpm install run with no --prod flag (tsx must survive install)
☐ No GEMINI_API_KEY / @google/genai reference anywhere in the app
☐ GEMINI_PROXY_KEY present in the server .env — AI route must not return 503
☐ Health check passes: GET /smartscale-ai-presentation-platform/api/health -> { ok: true }
☐ PORT=3036 confirmed against SERVER_PORTS.md before pm2 start
```

---

*Authored 3 Jul 2026 — Daniel Frempong Twum / TUC ICT*
