# CONSTRAINTS.md — Deep Dub Vibes Player

> Environment specification for the deep-dub-vibes-player backend.
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
| App name | Deep Dub Vibes Player |
| PM2 process | `deep-dub-vibes-player` |
| Port | **3023** |
| Public URL | `https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/deep-dub-vibes-player/` |
| Stack | React 19 · Vite 8 · Tailwind CSS 4 · Express 5 (plain JS, `server.js`) |
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
| Server entry | `server.js` (plain Node ESM — no `tsx` needed at runtime) |
| PM2 interpreter | Node v26, standard start |
| Reverse proxy | nginx (Plesk-managed) |

`tsx` sits in `devDependencies` only, which is correct: production runs `server.js`
directly, not a `.ts` entry point.

### Known drift: `server.js` port default vs `SERVER_PORTS.md`

`server.js` line 105 hardcodes `process.env.PORT || 3009` (3009 collides with
omniextract's port, per `PORT-REGISTRY.md`'s conflict history). `deploy.ps1` sets
`--env PORT=3023` explicitly at PM2 start, so the live process correctly binds 3023 —
but the in-code fallback is stale and would misbind if ever started without that env
var. Not fixed here (docs-only pass).

---

## 4. Authentication — bespoke Google OAuth (NOT WMS SSO)

This app implements its **own** Google OAuth 2.0 authorisation-code flow — it is not
on WMS SSO.

- **Client:** `src/contexts/AuthContext.tsx` builds the `accounts.google.com` redirect
  URL, stores an `oauth_state` nonce in `sessionStorage`, and on return exchanges the
  `code` via `POST /api/auth/google/token`. The resulting `{ id, name, email }` user
  object is cached in `sessionStorage` under `deep_user` — there is no server session,
  no JWT issued, and no MFA step.
- **Server:** `server.js` handles `GET /callback` (redirects to
  `/deep-dub-vibes-player/?code=&state=`) and `POST /api/auth/google/token` (exchanges
  the code for tokens using `GOOGLE_CLIENT_SECRET`, decodes the ID token locally with a
  hand-rolled base64 JWT decode — no signature verification).
- `src/utils/appContext.ts` is a small multi-app OAuth-context helper shared with
  sibling apps (`peace`, `biochemai`, `willpro`, `glucose`, `groove-streamer`, …); its
  `APP_NAME`/`APP_PATH` here are `deep-dub-vibes-player` / `/deep-dub-vibes-player/`,
  consistent with the actual deploy slug (unlike peace-vinyl — see that app's
  CONSTRAINTS.md for a similar helper with a mismatched path).
- `server.js` calls `process.exit(1)` at boot if `VITE_GOOGLE_CLIENT_ID` or
  `GOOGLE_CLIENT_SECRET` is missing — there is no graceful degrade; the whole app is
  down without OAuth configured.

### Likely-broken callback route under the deployed sub-path [GAP — verify before relying on sign-in]

`AuthContext.tsx` builds `redirect_uri` as `${origin}${APP_PATH}callback`, i.e.
`https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/callback` (`APP_PATH` from
`src/utils/appContext.ts`). But `server.js` registers the handler at the bare path
`app.get('/callback', ...)`, not `/deep-dub-vibes-player/callback`. Self-serving-Node
apps in this fleet (Pattern 28) are proxied by nginx with the sub-path prefix intact —
Pattern 25 notes each app is expected to normalise the prefix itself for `/api/` routes
— so unless nginx is specifically stripping `/deep-dub-vibes-player` before this
backend, Google's redirect lands on a path Express doesn't match, falls through to the
SPA catch-all, and the code/state exchange never happens (silently — the SPA just
reloads without a session). Compare with `deliberate-magic-reader/server.ts`, which
registers **both** `/callback` and `/magic-reader/callback` defensively. This was not
tested against the live server in this pass (docs-only); verify with a real sign-in
attempt before trusting the login flow, and if broken, register both paths the same
way magic-reader does.

---

## 5. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `NODE_ENV` | Runtime mode | Set to `production` on server |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | Read by both Vite (frontend) and Express (backend); `server.js` exits 1 if unset |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | Server-side only; `server.js` exits 1 if unset |
| `PORT` | Express listen port | Code default is stale (3009) — must be set to 3023 explicitly (see §3) |

> `.env.example` also lists `VITE_GOOGLE_REDIRECT_URI` and `VITE_GEMINI_API_KEY` —
> the former is read by `src/contexts/AuthContext.tsx` (`import.meta.env`), the latter
> is **not referenced anywhere in `src/`** (see §6).

---

## 6. AI: none in use — `@google/genai` is an unused dependency [GAP]

`@google/genai` is listed in `package.json` and `VITE_GEMINI_API_KEY` is documented in
`.env.example`, but a full grep of `src/` finds **no** import of `@google/genai`, no
`GoogleGenAI` usage, and no reference to `VITE_GEMINI_API_KEY` anywhere in the app.
There is no AI feature in this player today. Treat the dependency and env var as dead
weight left over from an AI Studio scaffold — remove them on next code touch, or wire
up a real feature through the WMS relay (Pattern 11) if one is wanted. Do **not**
reintroduce a client-side Gemini call; if AI is added, it must go through
`server.js` → WMS `/api/gemini/generate` with `GEMINI_PROXY_KEY`, matching the fleet
standard used by bridge-radio/deliberate-magic-reader.

---

## 7. Frontend standards

- **Vite base is relative (`./`)** — served under a sub-path
  (`/deep-dub-vibes-player/`) with no nested client routes deeper than the OAuth
  `callback` redirect (handled server-side, not as an SPA route), so Pattern 29's
  absolute-base requirement does not clearly apply; flag for review if a deep client
  route is ever added.
- **Lean initial load (Pattern 32) — not compliant.** `index.html` loads
  `fonts.googleapis.com`/`fonts.gstatic.com` (Google Fonts) and
  `googletagmanager.com/gtag/js` **at boot** (not deferred to `window.load`). No
  `cdn.tailwindcss.com` and no `esm.sh` importmap (Tailwind is build-time via
  `@tailwindcss/vite`).
- `public/manifest.json` does not exist; `index.html` has no `<link rel="manifest">`,
  so Pattern 33 doesn't apply. `favicon.svg` is present and referenced locally.
- No code-splitting audit done in this pass (Pattern 31) — `pnpm build` not run.

---

## 8. Deploy Pattern

```powershell
cd C:\Development\github\aucdt-utilities\deep-dub-vibes-player
.\deploy.ps1 -Build
```

Applies: **Pattern 9** (Express server + PM2). The deploy script pulls from the
`aucdt-utilities` monorepo (`deep-dub-vibes-player` subfolder), runs `pnpm install`,
builds with Vite, sets `PORT=3023` explicitly, and (re)starts the PM2 process.

---

## 9. Pre-Delivery Gate

```
☐ PORT=3023 supplied explicitly at PM2 start (server.js falls back to stale 3009 otherwise)
☐ VITE_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI set and valid
☐ Google Console has https://ai-tools.techbridge.edu.gh/deep-dub-vibes-player/callback (or the app's actual registered callback) as an authorised redirect URI — confirm against server.js's /callback route
☐ pnpm build completes without errors
☐ PM2 process named exactly deep-dub-vibes-player
☐ Health check: GET /deep-dub-vibes-player/ returns the React app (no 404); no dedicated /api/health route exists today
☐ If touching AI: route any new Gemini call through WMS (Pattern 11) — do not add a client-side @google/genai call
```

---

*Rewritten 12 Jul 2026 — reality-verified documentation pass (TUC ICT).*
