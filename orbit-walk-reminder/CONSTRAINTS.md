# CONSTRAINTS.md — Orbit Walk Reminder

> Environment specification for the orbit-walk-reminder backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Orbit Walk Reminder |
| PM2 process | `orbit-walk-reminder` |
| Port | **3010** |
| Public URL | `https://ai-tools.techbridge.edu.gh/orbit-walk-reminder/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/orbit-walk-reminder/` |
| Stack | TypeScript · Express · Vite · React · Tailwind CSS v4 · Google GenAI · Google OAuth 2.0 · Capacitor (iOS/Android) |

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
| Entry point | `server.ts` (Express + Vite SSR/static serving) |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | Exposed to Vite frontend build |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI | Default: `https://ai-tools.techbridge.edu.gh/orbit-walk-reminder/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | Server-side only — never expose to client |
| `PORT` | Express listen port | Defaults to `3010` if unset |
| `ADMIN_PASSWORD` | Admin section password | Defaults to `tuc-admin-2026` — override in production |
| `JWT_SECRET` | JWT signing secret | Defaults to `tuc-super-secret-key-2026` — override in production |

> **Security note:** `ADMIN_PASSWORD` and `JWT_SECRET` have hardcoded fallbacks in `server.ts`. Production `.env` must override both with strong secrets.

---

## 5. Google OAuth 2.0

- OAuth flow is handled server-side in `server.ts`.
- Callback routes: `/callback` and `/orbit-walk-reminder/callback` — both are registered.
- On success, user info (id, name, email) is stored in a base64-encoded cookie named `orbit_walk_reminder_user`.
- Cookie is scoped to `/orbit-walk-reminder/`, `secure: true`, `sameSite: lax`, 7-day TTL.
- The `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI` vars are prefixed with `VITE_` so Vite injects them into the frontend bundle — do not rename them.

---

## 6. Google GenAI (Gemini)

- Uses `@google/genai` (`^1.29.0`) from Google's official SDK.
- API key variable: check `.env.local` — not present in the env vars list above; confirm before deployment.
- Do not use the older `@google-cloud/vertexai` or `generativeai` packages — this app uses the unified `@google/genai` SDK.

---

## 7. Capacitor (Mobile)

- The app targets iOS and Android via Capacitor 8.
- `build:ios` and `build:android` scripts use `npx cap sync` — these require Capacitor CLI available globally or via `pnpm dlx`.
- Mobile builds are not part of the server deploy; they are built and opened locally via `pnpm ios:open` / `pnpm android:open`.
- Do not modify `capacitor.config.*` without confirming the app ID and server URL settings.

---

## 8. Audit Logging

- Audit log is written to `logs/audit.log` in the project root on the server.
- The `logs/` directory is created automatically on server start if absent.
- Admin screenshots (if any) are served statically at `/api/admin/screenshots`.
- Do not gitignore `logs/` silently — confirm `.gitignore` excludes log files before committing.

---

## 9. Deploy Pattern

```powershell
.\deploy.ps1
# With Vite rebuild:
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx entry point), **Pattern 14** (chmod sweep recommended after deploy).

PM2 start command on server must use:
```bash
node --import node_modules/tsx/dist/esm/index.mjs server.ts
```

---

## 10. Pre-Delivery Gate

Before deploying, confirm:

```
☐ ADMIN_PASSWORD and JWT_SECRET are set to strong values in production .env
☐ GOOGLE_CLIENT_SECRET is present in production .env (server-side only)
☐ VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI are set before running vite build
☐ Gemini API key is present in .env (confirm variable name from .env.local)
☐ tsx is in dependencies (not devDependencies) — required for server.ts
☐ pnpm install with no --prod flag
☐ Vite build output is in dist/ and served correctly by Express
☐ OAuth redirect URI registered in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI
☐ Health check passes: GET /orbit-walk-reminder/api/health → { ok: true }
☐ Cookie path is scoped to /orbit-walk-reminder/ — test login flow end-to-end after deploy
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
