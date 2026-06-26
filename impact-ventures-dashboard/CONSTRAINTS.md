# CONSTRAINTS.md — Impact Ventures Dashboard

> Environment specification for the Impact Ventures Dashboard backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Impact Ventures Dashboard |
| PM2 process | `impact-ventures` |
| Port | **3025** |
| Public URL | `https://ai-tools.techbridge.edu.gh/impact-ventures/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/impact-ventures-dashboard/` |
| Stack | React 19 · TypeScript · Express 5 · Vite · Tailwind CSS · Recharts · `@google/genai` |

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
| Entry point | `server.ts` |
| Reverse proxy | nginx (Plesk-managed) |

> **Critical:** `vite` is a devDependency and is imported dynamically only in the non-production branch of `server.ts`. Never run `pnpm install --prod` — this drops `tsx` and breaks the production server.

---

## 4. Required Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID (also used client-side via Vite) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — defaults to `https://ai-tools.techbridge.edu.gh/impact-ventures-dashboard/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret (server-side only — never expose to client) |
| `PORT` | Express listen port — must be **3025** in production |

All variables are loaded via `dotenv` from `.env` at server startup. If any are missing, check `.env.local` or the Plesk environment panel.

---

## 5. Google OAuth 2.0

- The server handles the OAuth callback at both `/callback` and `/impact-ventures-dashboard/callback`.
- On success, the user payload (id, name, email) is base64-encoded into a cookie named `impact_ventures_dashboard_user` with `path=/impact-ventures-dashboard/`, `secure`, `sameSite=lax`, 7-day TTL.
- The Google Cloud Console authorised redirect URI must match `VITE_GOOGLE_REDIRECT_URI` exactly.
- `GOOGLE_CLIENT_SECRET` is used in the server-side token exchange only — it must never appear in any client bundle.

---

## 6. Gemini AI (`@google/genai`)

- The `@google/genai` SDK (`^1.50.1`) is in `dependencies` and runs server-side only.
- No `GEMINI_API_KEY` was found in the detected env vars — confirm the key name in `.env.local` before deploying. The SDK typically requires `GOOGLE_API_KEY` or a key passed explicitly to the client constructor.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx as runtime), **Pattern 14** (chmod sweep recommended for deploy path).

The script pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `impact-ventures-dashboard`, and restarts the `impact-ventures` PM2 process on port 3025.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ All four env vars are present in the server .env file: VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET, PORT=3025
☐ Gemini API key is set (check exact var name in .env.local — not in detected vars)
☐ tsx is in dependencies (not devDependencies) — required for server.ts at runtime
☐ pnpm install run WITHOUT --prod flag (devDependencies needed for Vite SSR dev branch)
☐ Google Cloud Console redirect URI matches VITE_GOOGLE_REDIRECT_URI exactly
☐ PM2 process 'impact-ventures' is running on port 3025 post-deploy
☐ Health check passes: GET /impact-ventures-dashboard/api/health → { ok: true }
☐ OAuth flow completes and sets impact_ventures_dashboard_user cookie correctly
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
