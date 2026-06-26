# CONSTRAINTS.md — Techbridge Technical Quiz Platform

> Environment specification for the techbridge-technical-quiz-platform backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Techbridge Technical Quiz Platform |
| PM2 process | `techbridge-technical-quiz-platform` |
| Port | **3024** |
| Public URL | `https://ai-tools.techbridge.edu.gh/techbridge-technical-quiz/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/techbridge-technical-quiz-platform/` |
| Stack | React 19 · TypeScript · Vite · Express 5 · Tailwind CSS v4 · Gemini AI (`@google/genai`) · Google OAuth 2.0 |

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
| tsx | Must be in `dependencies` (not `devDependencies`) — server entry is `server.ts` |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini AI API key — server-side only, never exposed to client |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID — available to Vite frontend build and server |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — defaults to `https://ai-tools.techbridge.edu.gh/techbridge-technical-quiz-platform/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret — server-side only, never exposed to client |
| `PORT` | Express listen port — defaults to `3024` if unset |

All vars must be present in `.env` on the server before `pm2 restart`. Verify with `pm2 env techbridge-technical-quiz-platform`.

---

## 5. Google OAuth 2.0

- OAuth flow is handled entirely server-side via Express (`server.ts`).
- Callback routes: `/callback` and `/techbridge-technical-quiz-platform/callback` — both are registered.
- On success, user info is decoded from the `id_token` JWT and stored in a `httpOnly: false`, `secure: true`, `sameSite: lax` cookie named `techbridge-technical-quiz-platform_user` (base64-encoded JSON with `id`, `name`, `email`).
- Cookie path is scoped to `/techbridge-technical-quiz-platform/` — do not change this path without updating the frontend cookie reader.
- The Google Cloud Console must list the production redirect URI exactly: `https://ai-tools.techbridge.edu.gh/techbridge-technical-quiz-platform/callback`.

---

## 6. Gemini AI Integration

- Uses `@google/genai` SDK (v1.40.0).
- All Gemini calls must originate from the Express backend — `GEMINI_API_KEY` must never be bundled into the Vite client build.
- Do not add `GEMINI_API_KEY` to any `VITE_*` prefixed variable; Vite will expose it to the browser.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

- **Pattern 9** — Express server (`server.ts`) managed by PM2.
- **Pattern 12** — NVM / Node v26 on server.
- **Pattern 13** — tsx used as ESM loader for TypeScript server (`--import node_modules/tsx/dist/esm/index.mjs`).
- **Pattern 14** — chmod sweep may be required if deploy copies files via SSH/rsync.

The deploy script clones from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, extracts the `techbridge-technical-quiz-platform` subfolder, and restarts the PM2 process. The script remote path uses `tech-quiz` as the short alias — confirm the server symlink or directory alias matches before deploying.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ Vite production build succeeds: pnpm build — dist/ directory present
☐ server.ts compiles cleanly with tsx (no TypeScript errors)
☐ tsx is in dependencies (not devDependencies)
☐ GEMINI_API_KEY is NOT prefixed with VITE_ anywhere
☐ pnpm install run with no --prod flag (tsx must be installed)
☐ All five env vars present in server .env before pm2 restart
☐ Google Cloud Console redirect URI matches VITE_GOOGLE_REDIRECT_URI exactly
☐ Health check passes: GET /techbridge-technical-quiz-platform/api/health → { ok: true }
☐ OAuth callback roundtrip tested: login → redirect → cookie set → protected route accessible
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
