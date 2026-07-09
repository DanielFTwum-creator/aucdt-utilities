# CONSTRAINTS.md — Brand Guideline Checker

> Environment specification for the Brand Guideline Checker app.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Brand Guideline Checker |
| PM2 process | `brand-guideline-checker` (proposed; not yet deployed) |
| Port | **3034** (reserved in SERVER_PORTS.md, 1 Jul 2026; not yet binding) |
| Public URL | `https://ai-tools.techbridge.edu.gh/brand-guideline-checker/` (planned) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/brand-guideline-checker/` (planned) |
| Stack | React + Vite (frontend) · Express + tsx (backend) · Node v26 |
| Status | **Not yet deployed** — port reserved, deploy.ps1 and server.ts defaults already set to 3034 |

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
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) | WMS-issued shared fleet credential — this app never holds the Gemini key. Sourced server-side file-to-file from a sibling relayed app; never on the dev machine. |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `WMS_BASE` | Server-side WMS base for the `requireWmsAuth` token check (`/api/me`) | Optional. Defaults to `http://127.0.0.1:8081` (bypasses public/WAF). |
| `VITE_WMS_BASE` | Client-side WMS base for the SSO flow | Optional. Defaults to `https://wms.techbridge.edu.gh`. No build-time value needed. |
| `PORT` | Express listen port | Must be `3034` — matches the SERVER_PORTS.md reservation |

> Sign-in is WMS SSO (see §4b). No `VITE_GOOGLE_*` client ID/redirect and no `GOOGLE_CLIENT_SECRET` are used any more — they were removed with the bespoke OAuth flow.

---

## 4b. Authentication — WMS SSO (archetype B, all-TUC)

Wired onto the WMS SSO family on 9 Jul 2026 (TUC-ICT-SRS-2026-013), replacing the
bespoke Google-OAuth + client-secret flow. Sign-in is delegated to WMS (Google OAuth
+ TOTP MFA), domain-gated to `@techbridge.edu.gh` so all TUC members (students +
staff) can use the checker.

- **Client:** `src/AuthGate.tsx` runs the WMS flow — silent session adoption (fleet
  refresh cookie), "Continue with Google" handoff to `${WMS}/api/auth/google?app=brand-guideline-checker`,
  and the TOTP modal. The WMS access token is held in memory and injected into
  `/brand-guideline-checker/api/` calls via a `window.fetch` wrapper.
- **Server:** `src/server/wmsAuthMiddleware.ts` → `requireWmsAuth` guards
  `/api/gemini/generate`, validating the Bearer token against WMS `/api/me` (60s cache)
  and enforcing the domain gate. There is no server-side OAuth callback route any more —
  the SSO callback lands on `/brand-guideline-checker/auth/callback?code=` and is served
  by the SPA (nginx must route it to the app, not a backend endpoint).
- **WMS registration (required at first deploy):** register the app-base
  (`app-bases.brand-guideline-checker`) in `/opt/tuc-wms/application.yml`, pointing at
  `https://ai-tools.techbridge.edu.gh/brand-guideline-checker/`, same as aitopia/fail2ban-ai.
  Edit with `nano`.
- To restrict to staff only, narrow `ALLOWED_DOMAIN` in `wmsAuthMiddleware.ts` (one line).

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
cd C:\Development\github\aucdt-utilities\brand-guideline-checker
.\deploy.ps1 -Build
```

At first deploy, in order:
1. Register the app-base (`app-bases.brand-guideline-checker`) in `/opt/tuc-wms/application.yml`, then restart WMS (§4b)
2. Add the nginx vhost route for `/brand-guideline-checker/`: SPA fallback + `/api/` proxy to 3034. The SSO callback path `/brand-guideline-checker/auth/callback` must reach the SPA, not the backend. Apply via nginx-safe-apply (Pattern 26)
3. `GEMINI_PROXY_KEY` is sourced automatically by deploy.ps1 (file-to-file from the aitopia sibling `.env`); if the donor is absent, add it manually file-to-file (never echo the value)
4. `pm2 start` with `--cwd` at the deploy path; confirm the binding via `ss -ltnp` + `/proc/<pid>/cwd`
5. Update SERVER_PORTS.md: move this app from "Reserved" to "Actually listening"

---

## 6. Pre-Delivery Gate

Before deploying, confirm:

```
☐ tsx, express, dotenv are in dependencies
☐ src/server/wmsAuthMiddleware.ts is shipped alongside server.ts to the deploy path
☐ app-base registered in /opt/tuc-wms/application.yml (app-bases.brand-guideline-checker)
☐ nginx routes /brand-guideline-checker/api/ to 3034 and lets /auth/callback fall through to the SPA
☐ pnpm build succeeds locally
☐ pnpm install run with no --prod flag (tsx must survive install)
☐ No GEMINI_API_KEY / @google/genai reference anywhere in the app
☐ GEMINI_PROXY_KEY present in the server .env — AI route must not return 503
☐ Sign-in works: Continue with Google → (MFA) → app renders; /brand-guideline-checker/api/gemini/generate returns 401 without a token
☐ Health check passes: GET /brand-guideline-checker/api/health -> { ok: true }
☐ PORT=3034 confirmed against SERVER_PORTS.md before pm2 start
```

---

*Authored 3 Jul 2026 — Daniel Frempong Twum / TUC ICT*
