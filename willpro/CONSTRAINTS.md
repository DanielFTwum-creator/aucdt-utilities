# CONSTRAINTS.md — WillPro

> Environment specification for the WillPro backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | WillPro |
| PM2 process | `willpro` |
| Port | **3015** |
| Public URL | `https://ai-tools.techbridge.edu.gh/willpro/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/willpro/` |
| Stack | React 19 · TypeScript · Vite · Express 5 · Google OAuth 2.0 |

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

| Variable | Purpose |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID (exposed to frontend via Vite) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI — production default: `https://ai-tools.techbridge.edu.gh/willpro/callback` |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret — **server-side only, never expose to frontend** |
| `PORT` | Express listen port — defaults to `3015` if not set |

All four must be present in `.env` on the server. Verify with `cat /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/willpro/.env` after deploy.

---

## 5. Google OAuth 2.0

WillPro uses Google OAuth exclusively for authentication — there is no local username/password system.

**Flow:**
1. Frontend redirects user to Google with `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI`.
2. Google returns an authorisation code to `/willpro/callback` (handled by Express).
3. Server exchanges the code for tokens using `GOOGLE_CLIENT_SECRET`.
4. Server decodes the `id_token` JWT, sets a `willpro_user` cookie (Base64-encoded JSON), and redirects to `/willpro/`.

**Cookie spec:**
- Name: `willpro_user`
- Encoding: Base64 JSON `{ id, username, email, role: "staff" }`
- Flags: `httpOnly: false`, `secure: true`, `sameSite: lax`, `path: /willpro/`, 7-day TTL

**Registered redirect URIs** must include both:
- `https://ai-tools.techbridge.edu.gh/willpro/callback` (production)
- `http://localhost:3015/callback` (local dev, if needed)

These must be configured in the Google Cloud Console under the OAuth 2.0 client credentials.

---

## 6. Deploy Pattern

```powershell
.\deploy.ps1
# Pass -Build to trigger a Vite production build before rsync
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2), **Pattern 13** (tsx for TypeScript server), **Pattern 14** (chmod sweep if file permissions drift after rsync).

PM2 start command on server must use:
```bash
pm2 start server.ts --name willpro --interpreter node \
  --interpreter-args "--import node_modules/tsx/dist/esm/index.mjs"
```

---

## 7. Pre-Delivery Gate

Before deploying, confirm:

```
☐ VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET, PORT present in .env on server
☐ Redirect URI in .env matches the URI registered in Google Cloud Console
☐ tsx is in dependencies (not devDependencies) — confirmed at ^4.22.3
☐ pnpm install run with no --prod flag on server
☐ Vite build output (dist/) included in deploy if -Build was not passed
☐ Health check passes: GET /willpro/api/health → { ok: true }
☐ OAuth callback reachable: GET https://ai-tools.techbridge.edu.gh/willpro/callback returns redirect (not 404)
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
