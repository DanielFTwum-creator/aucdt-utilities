# CONSTRAINTS.md — AI Email Drafter

> Environment specification for the ai-email-drafter backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | AI Email Drafter |
| PM2 process | `ai-email-drafter` |
| Port | **3007** |
| Public URL | `https://ai-tools.techbridge.edu.gh/ai-email-drafter/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/ai-email-drafter/` |
| Stack | React 19 + TypeScript · Express 5 · Vite · Tailwind CSS v4 · `@google/genai` · Google OAuth 2.0 |

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
| tsx | In `dependencies` (`^4.22.3`) — available after `pnpm install` (no `--prod`) |
| PM2 interpreter | Node v26 + `--import node_modules/tsx/dist/esm/index.mjs` |
| Reverse proxy | nginx (Plesk-managed) |

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_API_KEY` | Gemini AI draft generation | Server-side only; also checked as `VITE_GEMINI_API_KEY` fallback |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Exposed to frontend via Vite |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URI | Defaults to `https://ai-tools.techbridge.edu.gh/email-drafter/callback` if unset |
| `GOOGLE_CLIENT_SECRET` | Google OAuth token exchange | Server-side only — never expose to client |
| `PORT` | Express listen port | Defaults to `3007` if unset |

If any variable is missing from `.env`, the server starts but `/api/gemini/draft` returns `500` (Gemini) or OAuth exchange fails silently.

---

## 5. Gemini AI Integration

- SDK: `@google/genai` (`^1.28.0`) — **not** the legacy `@google-cloud/vertexai`.
- The `GoogleGenAI` instance is created once at startup with `GEMINI_API_KEY`.
- If `GEMINI_API_KEY` is absent, `gemini` is `null` and the draft endpoint is non-functional — a `console.warn` is emitted at boot.
- All Gemini calls are server-side (Express route); the key is never sent to the browser.

---

## 6. Google OAuth 2.0

- Flow: server-side authorisation code exchange (PKCE not used).
- Callback routes: `GET /callback` and `GET /email-drafter/callback` — both handled by Express.
- After successful exchange, user identity is decoded from `id_token` (JWT) and written to a **client-readable cookie** (`email_drafter_user`, base64-encoded JSON) so `AuthContext` can hydrate on page load.
- Cookie flags: `httpOnly: false`, `secure: true`, `sameSite: lax`, 7-day `maxAge`, `path: /email-drafter`.
- Required env vars: `VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_REDIRECT_URI`.
- The redirect URI registered in Google Cloud Console **must** match `VITE_GOOGLE_REDIRECT_URI` exactly — mismatches cause `redirect_uri_mismatch` errors.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1
```

Optionally pass `-Build` to trigger a Vite build before deploying:

```powershell
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx for TypeScript server entry), **Pattern 12** (NVM — Node v26 on remote). The script SSHs into `root@techbridge.edu.gh`, pulls from GitHub (`aucdt-utilities` monorepo, subfolder `ai-email-drafter`), runs `pnpm install`, and restarts the PM2 process.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ GEMINI_API_KEY set in .env on server — GET /api/gemini/draft must not return 500
☐ VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI set in .env on server
☐ VITE_GOOGLE_REDIRECT_URI matches the URI registered in Google Cloud Console exactly
☐ tsx is in dependencies (not devDependencies) — confirmed at ^4.22.3
☐ pnpm install run with no --prod flag (tsx must be installed)
☐ PM2 process named ai-email-drafter is running on port 3007
☐ Health check passes: GET https://ai-tools.techbridge.edu.gh/ai-email-drafter/ → 200
☐ OAuth callback route reachable: /email-drafter/callback resolves through nginx to Express
☐ Cookie email_drafter_user set correctly after OAuth round-trip
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
