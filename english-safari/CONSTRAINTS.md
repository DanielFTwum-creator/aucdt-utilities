# CONSTRAINTS.md — English Safari

> Environment specification for the English Safari backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | English Safari |
| PM2 process | `tb-ai-english-safari` |
| Port | **3021** |
| Public URL | `https://ai-tools.techbridge.edu.gh/english-safari/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/english-safari/` |
| Stack | React 19 + TypeScript · Vite · Express 5 · `tsx` · Tailwind CSS v4 · `@google/genai` |

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
| `tsx` | In `dependencies` — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` pointing at `server.ts` |
| Reverse proxy | nginx (Plesk-managed) — routes `/english-safari/` to `:3021` |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Auth token for WMS key-proxy | **Primary key mechanism — must be set in production.** |
| `GEMINI_API_KEY` | Local dev fallback only | Used when `GEMINI_PROXY_KEY` is absent (never in production). |
| `PORT` | Express listen port | Defaults to `3021` if unset. |

**Key custody note:** The Gemini API key is never stored locally in production. `server.ts` fetches it at request time from `https://wms.techbridge.edu.gh/api/gemini/key` using `GEMINI_PROXY_KEY` for auth, following fleet standard FR-SSO-011. The fetched key is cached in memory with a 6-hour TTL.

Set variables in `.env.local` for local development:

```
GEMINI_API_KEY=your-local-key-here
PORT=3021
```

---

## 5. Gemini AI Proxy

- Model: `gemini-2.5-flash`
- Client library: `@google/genai` v2+
- All Gemini calls are server-side only — the API key never reaches the browser.
- Routes are dual-registered: `/api/gemini/*` (local dev) and `/english-safari/api/gemini/*` (production via nginx sub-path).
- If `GEMINI_PROXY_KEY` is missing at startup, the server logs a warning and falls back to `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` for local use; production will fail without `GEMINI_PROXY_KEY`.

---

## 6. Deploy Pattern

```powershell
.\deploy.ps1
```

Patterns that apply:

- **Pattern 9** — Express `server.ts` running under PM2
- **Pattern 13** — `tsx` used as the PM2 interpreter (`--import node_modules/tsx/dist/esm/index.mjs`)
- **Pattern 12** — NVM / Node v26 must be active on the server before PM2 restart

The script clones from `git@github.com:DanielFTwum-creator/aucdt-utilities.git` and deploys the `english-safari/` subfolder to the remote path. Pass `-Build` to trigger a Vite production build before rsync.

---

## 7. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_PROXY_KEY is set in the server environment (not just .env.local)
☐ tsx is in dependencies (not devDependencies) — required for server.ts
☐ pnpm install run with no --prod flag so tsx is available
☐ Vite production build passes: pnpm build
☐ PM2 process name matches: tb-ai-english-safari
☐ Health check passes: GET /english-safari/api/health → { ok: true }
☐ Dual-path routes verified: /api/gemini/* (dev) and /english-safari/api/gemini/* (prod)
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
