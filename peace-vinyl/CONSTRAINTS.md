# CONSTRAINTS.md — Peace Vinyl

> Environment specification for the peace-vinyl backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.
>
> Rewritten from a reality-verified read of `server.js`, `src/`, `package.json`,
> `vite.config.ts` and `deploy.ps1` (12 Jul 2026). The previous version of this file
> described a client-side Gemini AI feature that does not exist in the code — see §6.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Peace Vinyl |
| PM2 process | `peace-vinyl` |
| Port | **3026** |
| Public URL | `https://ai-tools.techbridge.edu.gh/peace-vinyl/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/peace-vinyl/` |
| Stack | React 19 · Vite 6 · Tailwind CSS 4 · Express 4 (plain JS, `server.js`) |
| Serving | self-serving-Node — `server.js` serves `dist/` under `NODE_ENV=production` + handles OAuth routes |

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
| Server entry | `server.js` (plain Node ESM — `tsx` only used as PM2's interpreter shim, no `.ts` compile needed) |
| Reverse proxy | nginx (Plesk-managed) |

### Known drift: `server.js` port default vs `SERVER_PORTS.md`

`server.js` line 106 hardcodes `process.env.PORT || 3001` (3001 is currently unused
fleet-wide, but is still the wrong value for this app). `deploy.ps1` sets `PORT=3026`
explicitly at PM2 start, so the live process correctly binds 3026 — the in-code
fallback is stale and would misbind if ever started without that env var. Not fixed
here (docs-only pass).

---

## 4. Authentication — bespoke Google OAuth (NOT WMS SSO)

This app implements its own Google OAuth 2.0 authorisation-code flow — it is not on
WMS SSO. Same shape as sibling AI-Studio-scaffolded apps (deep-dub-vibes-player,
biochemai, willpro, glucose, groove-streamer): `src/contexts/AuthContext.tsx` builds
the `accounts.google.com` redirect, `server.js` exchanges the code via `POST
/api/auth/google/token`, and the `{ id, name, email }` result is cached in
`sessionStorage` — no server session, no JWT, no MFA, no signature verification on
the decoded ID token.

`server.js` calls `process.exit(1)` at boot if `VITE_GOOGLE_CLIENT_ID` or
`GOOGLE_CLIENT_SECRET` is missing.

### Confirmed bug: OAuth redirect path is `/peace/`, but the app is deployed at `/peace-vinyl/` [GAP]

`src/utils/appContext.ts` hardcodes `APP_NAME = 'peace'` and `APP_PATH = '/peace/'`.
`AuthContext.tsx` builds `redirect_uri` as `${origin}${APP_PATH}callback` →
`https://ai-tools.techbridge.edu.gh/peace/callback` — but `deploy.ps1` deploys this
app to `/peace-vinyl/` (confirmed: `RewriteBase /peace-vinyl/` in the generated
`.htaccess`, `$RemotePath` ends in `peace-vinyl/`). `server.js`'s own `/callback`
handler also redirects back to `/peace/?code=...` rather than `/peace-vinyl/?code=...`.
This looks like a leftover from an earlier app name ("peace") before the folder was
renamed to `peace-vinyl`, and — unless `/peace/` happens to be aliased to the same
backend elsewhere in nginx — the sign-in flow likely 404s or lands on the wrong app.
Not fixed here (docs-only pass); verify with a real sign-in attempt before relying on
login, and if broken, correct `APP_PATH` to `/peace-vinyl/` and the `server.js`
redirects to match.

---

## 5. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `NODE_ENV` | Runtime mode | Set to `production` on server |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | `server.js` exits 1 if unset |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI | See §4 bug — the code-computed value may not match this |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | Server-side only; `server.js` exits 1 if unset |

> `.env.example` also documents `VITE_GEMINI_API_KEY` — **not referenced anywhere in
> `src/`** (see §6). The committed `.env.example` value for that line is already a
> redacted placeholder from a prior key-revocation cleanup, not a live secret; still,
> treat the whole line as dead and drop it on the next code touch rather than filling
> in a real key.

---

## 6. AI: none in use — `@google/genai` is an unused dependency [GAP]

`@google/genai` (`^1.29.0`) is listed in `package.json` and `VITE_GEMINI_API_KEY` is
documented in `.env.example` and the old CONSTRAINTS text, but a full grep of `src/`
finds **no** import of `@google/genai`, no `GoogleGenAI` usage, and no reference to
`VITE_GEMINI_API_KEY` anywhere in the app. There is no AI feature in this player
today — it's a vinyl-spinner music player + OAuth login, nothing more. Treat the
dependency and env var as dead weight from the AI Studio scaffold. If AI is added
later, it must go through a server-side WMS relay (Pattern 11) with
`GEMINI_PROXY_KEY` — never a client-side `VITE_`-prefixed key.

---

## 7. Frontend standards

- **Vite base is relative (`./`)** — served under `/peace-vinyl/` sub-path; no
  client-side nested routes beyond the OAuth callback (handled server-side), so
  Pattern 29 doesn't clearly apply — flag if a deep client route is ever added.
- **Lean initial load (Pattern 32) — not compliant.** `index.html` loads Google Fonts
  and `googletagmanager.com/gtag/js` at boot, not deferred. No Tailwind CDN, no
  `esm.sh` importmap.
- `public/manifest.json` is not present; only `favicon.svg`. No `<link
  rel="manifest">` in `index.html`, so Pattern 33 doesn't apply.
- No code-splitting audit done in this pass (Pattern 31) — `pnpm build` not run.

---

## 8. Build & Serve Pattern

```
pnpm build        → outputs to dist/
node server.js    → serves dist/ as static + handles /api/* and /callback routes
```

The SPA fallback (`GET /.*`) serves `dist/index.html` for all unmatched routes. If
`dist/index.html` does not exist, the server returns a 404 JSON error.

---

## 9. Deploy Pattern

```powershell
cd C:\Development\github\aucdt-utilities\peace-vinyl
.\deploy.ps1 -Build
```

The deploy script pulls the `peace-vinyl` subfolder from the `aucdt-utilities`
monorepo, builds, ships `server.js` + `package.json` + lockfile, and (re)starts the
`peace-vinyl` PM2 process with `PORT=3026`.

---

## 10. Pre-Delivery Gate

Before deploying, confirm:

```
☐ pnpm build completes with no errors
☐ dist/index.html exists before starting server
☐ VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI set and valid on the server
☐ Sign-in tested end-to-end against the live /peace-vinyl/ URL — confirm the §4 redirect-path bug is not actually breaking login before assuming it works
☐ PM2 process name is exactly peace-vinyl, bound to port 3026 (server.js's own fallback of 3001 is stale)
☐ If touching AI: route any new Gemini call through WMS (Pattern 11) — @google/genai currently sits unused; either wire it up properly or remove it
```

---

*Rewritten 12 Jul 2026 — reality-verified documentation pass (TUC ICT).*
