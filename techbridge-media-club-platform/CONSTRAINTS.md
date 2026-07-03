# CONSTRAINTS.md — Techbridge Media Club Platform

> Environment specification for the Techbridge Media Club Platform app.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Techbridge Media Club Platform |
| PM2 process | `techbridge-media-club-platform` (proposed; not yet deployed) |
| Port | **3039** (reserved in SERVER_PORTS.md, 1 Jul 2026; not yet binding) |
| Public URL | `https://ai-tools.techbridge.edu.gh/techbridge-media-club-platform/` (planned) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-media-club-platform/` (planned) |
| Stack | React + Vite (frontend) · Express + tsx (backend) · Node v26 |
| Status | **Not yet deployed** — port reserved, deploy.ps1 and server.ts defaults already set to 3039 |

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
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Frontend + server-side token exchange |
| `GOOGLE_CLIENT_SECRET` | Google OAuth token exchange | Server-side only — never expose to client |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URI | Must match Google Cloud Console exactly |
| `PORT` | Express listen port | Must be `3039` — matches the SERVER_PORTS.md reservation |

---

## 4a. Gemini / AI Usage

None. This app has no AI calls and must not gain a Gemini key. If AI features are
added later, use the WMS generate relay (Pattern 11) — never a local key.

---

## 5. Deploy Pattern (first deploy checklist)

```powershell
cd C:\Development\github\aucdt-utilities\techbridge-media-club-platform
.\deploy.ps1 -Build
```

At first deploy, in order:
1. Add the nginx vhost route for `/techbridge-media-club-platform/` (SPA + `/api/` proxy to 3039)
2. Create the server `.env`
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
☐ Health check passes: GET /techbridge-media-club-platform/api/health -> { ok: true }
☐ PORT=3039 confirmed against SERVER_PORTS.md before pm2 start
```

---

*Authored 3 Jul 2026 — Daniel Frempong Twum / TUC ICT*
