# CONSTRAINTS.md — Techbridge Student Population Register

> Environment specification for the techbridge-student-population-register backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Techbridge Student Population Register |
| PM2 process | `tb-student-reg` |
| Port | **3013** |
| Public URL | `https://ai-tools.techbridge.edu.gh/tb-student-reg/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-student-population-register/` |
| Stack | React 19 · TypeScript · Express · Vite 6 · better-sqlite3 · Google OAuth 2.0 · Gemini AI (`@google/genai`) |

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
| tsx | In `dependencies` — available after `pnpm install` (no `--prod` flag) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |
| Entry point | `server.ts` (run via `tsx server.ts` in dev; PM2 uses tsx import flag in prod) |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini AI API key — server-side only, never expose to client |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — must match Google Console exactly; production value is `https://ai-tools.techbridge.edu.gh/techbridge-student-population-register/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — server-side only, never expose to client |
| `PORT` | Express listen port — set to `3013` in production `.env`; server.ts defaults to `3013` if unset, so this **must** be set |

> Note: The server.ts hardcodes `3013` as the `PORT` fallback. Always ensure `PORT=3013` is set in the production `.env` file so PM2 picks up the correct port.

---

## 5. Google OAuth 2.0

- OAuth flow is server-side; the callback is handled at `/callback` and `/techbridge-student-population-register/callback`.
- On success, user info is written to a secure cookie named `techbridge_student_population_register_user` (base64-encoded JSON, path scoped to `/techbridge-student-population-register/`).
- `VITE_GOOGLE_CLIENT_ID` is a Vite public variable (prefix `VITE_`) — it is baked into the frontend bundle at build time.
- `GOOGLE_CLIENT_SECRET` and `GEMINI_API_KEY` must **never** appear in frontend code or Vite config.
- Authorised redirect URIs in the Google Cloud Console must include both the production URI and any local dev URI used.

---

## 6. Gemini AI

- SDK: `@google/genai` (dependency, not devDependency).
- All Gemini calls are server-side only — the `GEMINI_API_KEY` is read from `process.env` in `server.ts`.
- Do not import `@google/genai` in any file under `src/` that is bundled by Vite for the browser.

---

## 7. SQLite (better-sqlite3)

- ORM: none — uses `better-sqlite3` directly (synchronous API).
- Database file path is not set via env var — confirm location in `server.ts` or a `db.ts` helper before modifying schema.
- `better-sqlite3` requires a native build. After `pnpm install` on the server, confirm the native module compiled correctly for Node v26. If it fails, run `pnpm rebuild better-sqlite3`.
- Do **not** delete the `.db` file during deployment; the deploy script must preserve it.

---

## 8. Deploy Pattern

```powershell
.\deploy.ps1
.\deploy.ps1 -Build   # include Vite production build step
```

Patterns applied:
- **Pattern 9** — Express server + PM2 process management
- **Pattern 13** — `tsx` used as the TypeScript runner (`server.ts` entry point)
- **Pattern 12** — NVM / Node v26 must be active on the server before PM2 starts

PM2 ecosystem config must use:
```json
{
  "interpreter": "node",
  "node_args": "--import node_modules/tsx/dist/esm/index.mjs",
  "script": "server.ts"
}
```

---

## 9. Pre-Delivery Gate

Before deploying, confirm:

```
☐ PORT=3013 is set in production .env (server.ts defaults to 3013 — this will break nginx routing)
☐ GEMINI_API_KEY, VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET all present in .env
☐ tsx is in dependencies (not devDependencies) — required for PM2 tsx import flag
☐ pnpm install run without --prod flag (tsx must be installed)
☐ better-sqlite3 native module compiled for Node v26 (run pnpm rebuild better-sqlite3 if in doubt)
☐ SQLite .db file preserved — deploy script must not delete or overwrite it
☐ OAuth redirect URI in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI exactly
☐ Vite build completed (pnpm build) before rsync if deploying with -Build flag
☐ Health check passes: GET /techbridge-student-population-register/api/health → { status: "ok" }
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
