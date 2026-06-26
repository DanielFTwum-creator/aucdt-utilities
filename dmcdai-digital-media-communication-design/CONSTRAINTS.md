# CONSTRAINTS.md — DMCD AI (Digital Media Communication Design)

> Environment specification for the dmcdai-digital-media-communication-design backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | DMCD AI — Digital Media Communication Design |
| PM2 process | `dmcdai` |
| Port | **3014** |
| Public URL | `https://ai-tools.techbridge.edu.gh/dmcdai/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/dmcdai-digital-media-communication-design/` |
| Stack | React 19 · Vite · Express · Node.js · MySQL · Gemini AI (`@google/genai`) |

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
| Server entry | `server.js` (plain ESM — no `tsx` required) |
| PM2 interpreter | Node v26, standard `node server.js` |
| Reverse proxy | nginx (Plesk-managed) |
| Database | MySQL — pool connecting to `66.226.72.199:3306`, database `tuc_rms_prod` |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Gemini AI local dev fallback | Used only when `GEMINI_PROXY_KEY` is absent (local dev only) |
| `GEMINI_PROXY_KEY` | Auth key for WMS Gemini relay | **Production must set this** — server fetches the real Gemini key from `https://wms.techbridge.edu.gh/api/gemini/key` |
| `JWT_SECRET` | Signs session JWTs | Defaults to a hardcoded string — override in production |
| `DB_HOST` | MySQL host | Defaults to `66.226.72.199` |
| `DB_PORT` | MySQL port | Defaults to `3306` |
| `DB_USER` | MySQL username | Defaults to `aucdtadmin_dev` |
| `DB_PASS` | MySQL password | Defaults to hardcoded dev credential — **always override in production** |
| `DB_NAME` | MySQL database name | Defaults to `tuc_rms_prod` |
| `SMTP_GATEWAY_URL` | Mail dispatch endpoint | Defaults to `https://api.techbridge.edu.gh/aucdt-dev/sendMail` |
| `RMS_BASE_URL` | Base URL for self-referencing links | Defaults to `https://ai-tools.techbridge.edu.gh` |

> All variables must be present in the `.env` file at the project root on the server.
> Do **not** commit `.env` to git. Check `.env.local` if values are missing locally.

---

## 5. Gemini AI Proxy Pattern

This app uses a **WMS key relay** rather than embedding a Gemini API key directly.

- In **production**, `GEMINI_PROXY_KEY` is set. The server calls `https://wms.techbridge.edu.gh/api/gemini/key` with that proxy key to retrieve the real Gemini API key. The fetched key is cached in memory for 6 hours (TTL).
- In **local dev**, if `GEMINI_PROXY_KEY` is absent, the server falls back to `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` from the environment.
- If Google returns `API_KEY_INVALID` or `API key expired`, the cache is invalidated and the next request automatically refetches from WMS — self-healing rotation.
- Image generation routes use `v1beta` API version (`getImageAi()`); all other routes use the standard `getGeminiKey()` helper.

> Never hardcode a Gemini key into the server. Always route through the WMS proxy in production.

---

## 6. Deploy Pattern

```powershell
.\deploy.ps1
```

Or with a forced Vite build:

```powershell
.\deploy.ps1 -Build
```

- **Pattern 9** — Express server (`server.js`) managed by PM2
- **Pattern 12** — NVM used on server to select Node v26
- No `tsx` needed (server is `.js`, not `.ts`)
- The deploy script clones from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, extracts the `dmcdai-digital-media-communication-design` subfolder, runs `pnpm install`, builds the Vite frontend, and restarts the `dmcdai` PM2 process.

---

## 7. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_PROXY_KEY is set in the server .env (not the local fallback key)
☐ DB_PASS and JWT_SECRET are overridden from their defaults in .env
☐ pnpm install run with no --prod flag (devDependencies needed for Vite build)
☐ Vite build completes without error: pnpm run build
☐ server.js is ESM-compatible (uses import/export — do not add CommonJS require() calls)
☐ PM2 process 'dmcdai' is restarted after deploy
☐ Health check passes: GET /dmcdai/api/health → { ok: true }
☐ MySQL pool connects successfully on startup (watch PM2 logs)
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
