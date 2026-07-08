# CONSTRAINTS.md — fail2ban-ai

> Environment specification for the fail2ban-ai app (Fail2Ban log analysis and
> threat dashboard). Claude reads this at **Session Start**, before writing any
> code for this app. This file overrides generic assumptions in the root
> `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | fail2ban-ai |
| PM2 process | `fail2ban-ai` (proposed; not yet deployed) |
| Port | **3040** (reserved in SERVER_PORTS.md, 8 Jul 2026; not yet binding) |
| Public URL | `https://ai-tools.techbridge.edu.gh/fail2ban-ai/` (planned) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/fail2ban-ai/` (planned) |
| Stack | React + Vite + D3/Recharts (frontend) · Express + tsx (backend) · Node v26 |
| Status | **Not yet deployed** — port reserved, server.ts default set to 3040 |
| Origin | AI Studio export, imported 8 Jul 2026 and converted to fleet standards |

---

## 2. Developer Machine

| Item | Value |
|---|---|
| OS | Windows 11 Home |
| Primary shell | **PowerShell 7+** |
| Package manager | **pnpm** (package-lock.json removed at import) |
| Node (local) | System node — use `nvm use 26` for server-parity testing |

---

## 3. Runtime Environment (Production, once deployed)

| Item | Value |
|---|---|
| Host | Ubuntu + Plesk — `66.226.72.199` |
| Node version | **v26.3.1** |
| tsx | In `dependencies` — available after `pnpm install` (no `--prod` caveat) |
| Reverse proxy | nginx (Plesk-managed) — vhost route must be added at first deploy via `nginx-safe-apply` (Pattern 26) |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the analyze-logs relay to WMS (Pattern 11) | WMS-issued shared fleet credential — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `PORT` | Express listen port | Must be `3040` — matches the SERVER_PORTS.md reservation |

---

## 4a. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at
runtime. The server route `/api/analyze-logs` builds the prompt server-side and
relays it to WMS, which adds the key (`X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>`).

- Missing `GEMINI_PROXY_KEY` -> `/api/analyze-logs` degrades to an offline
  pre-compiled summary (the server still boots; health reports custody
  `unconfigured`)
- Converted on 8 Jul 2026 from a server-held `GEMINI_API_KEY` +
  `@google/genai` SDK call; the SDK has been removed

## 4b. Other External Calls

- `/api/geolocate` uses a local offline IP database first, then ip-api.com for
  cache misses (no credentials involved)
- The frontend `IPTable` component calls `https://ipwho.is/<ip>` directly
  (public, unauthenticated)

---

## 5. Deploy Pattern (first deploy checklist)

```powershell
cd C:\Development\github\aucdt-utilities\fail2ban-ai
.\deploy.ps1 -Build
```

At first deploy, in order:
1. Add the nginx vhost route for `/fail2ban-ai/` (SPA + `/api/` proxy to 3040) —
   apply the config through `nginx-safe-apply` (Pattern 26), never by direct edit
2. The deploy script injects `GEMINI_PROXY_KEY` into the server `.env`
   file-to-file from `/opt/tuc-wms/.env` (never echo the value)
3. `pm2 start server.ts` via tsx with `--cwd` at the deploy path (Pattern 17);
   confirm the binding via `ss -ltnp` + `/proc/<pid>/cwd`
4. Update SERVER_PORTS.md: move this app from "Reserved" to "Actually listening"

---

## 6. Pre-Delivery Gate

Before deploying, confirm:

```
[ ] No GEMINI_API_KEY or @google/genai anywhere in the app
[ ] server.ts reads process.env.PORT (default 3040)
[ ] /api/health returns { ok, service, custody }
[ ] dist/index.html references a JS bundle (Pattern 24 guard)
[ ] pnpm-lock.yaml present; package-lock.json absent
[ ] Authentication decision recorded (WMS SSO vs magic-link) before public exposure
```

---

*Created 8 Jul 2026 — fleet standardisation of the AI Studio import.*
