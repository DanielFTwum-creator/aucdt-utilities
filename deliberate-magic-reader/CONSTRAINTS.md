# CONSTRAINTS.md — Deliberate Magic Reader

> Environment specification for the deliberate-magic-reader backend.
> Claude reads this at **Session Start**, before writing any code for this app.
> This file overrides generic assumptions in the root `CLAUDE.md` where they conflict.

---

## 1. Identity

| Field | Value |
|---|---|
| App name | Deliberate Magic Reader |
| PM2 process | `deliberate-magic-reader` |
| Port | **3008** |
| Public URL | `https://ai-tools.techbridge.edu.gh/magic-reader/` (verified against `deploy.ps1` — NOT `/deliberate-magic-reader/`; the repo folder and the deployed slug differ) |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/magic-reader/` |
| Stack | React 19 + Vite 8 (frontend) · Express 5 + TypeScript (backend, `server.ts`) · Gemini AI relayed via WMS (Pattern 11) · bespoke Google OAuth 2.0 (not WMS SSO) |
| Build output | `pnpm build` produces `dist/server.cjs` (esbuild) + Vite static assets, but production does **not** run the compiled bundle — see §3 |

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
| tsx | **Actually used in production** — `deploy.ps1` starts PM2 with `--interpreter npx --interpreter-args tsx` against `server.ts` directly |
| PM2 start command | `PORT=3008 pm2 start server.ts --name deliberate-magic-reader --interpreter npx --interpreter-args tsx` (verified in `deploy.ps1`) |
| Reverse proxy | nginx (Plesk-managed), proxying `/magic-reader/` → `localhost:3008` |

> **Correction (12 Jul 2026):** the previous version of this file said production ran
> the esbuild-compiled `dist/server.cjs`. That's what `pnpm build`/`pnpm start`
> produce and describe, but `deploy.ps1` does **not** ship or run that bundle — its
> `rsync` step explicitly excludes `server.cjs`/`server.js`/`server.ts` from the
> `dist/` copy, then separately `scp`s the raw `server.ts` + `package.json` +
> `pnpm-lock.yaml` to the server and starts it with the `tsx` interpreter, same as
> every other fleet app on Pattern 13. The `esbuild`/`dist/server.cjs` path in
> `package.json`'s `build`/`start` scripts is real but unused by the actual deploy —
> treat it as a local-only alternative, not the production contract.

---

## 4. Required Environment Variables

| Variable | Purpose | Notes |
|---|---|---|
| `GEMINI_PROXY_KEY` | Authenticates the generate relay to WMS (Pattern 11) | WMS-issued service credential — this app never holds the Gemini key |
| `WMS_GEMINI_URL` | Relay endpoint override | Defaults to `https://wms.techbridge.edu.gh/api/gemini/generate` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | Exposed to browser via Vite prefix; also used server-side for token exchange |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URI | Production value: `https://ai-tools.techbridge.edu.gh/magic-reader/callback` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | Server-side only — never expose to client |
| `PORT` | Express listen port | Defaults to `3008` if unset |

All variables must be present in the server `.env` on the production host before PM2 restart.

---

## 5. Gemini Key Pattern (Pattern 11 — WMS Relay, fleet standard)

This app never holds the Gemini key — not in code, not in `.env`, not fetched at runtime.
All generateContent calls are relayed to WMS, which adds the key server-side:

```
POST https://wms.techbridge.edu.gh/api/gemini/generate?model=gemini-3.5-flash
Header: X-Gemini-Proxy-Key: <GEMINI_PROXY_KEY>
Body: raw Gemini generateContent JSON
Response: raw Gemini REST response, relayed verbatim
```

- No key cache, no key invalidation — the app has no key to manage
- Missing `GEMINI_PROXY_KEY` → AI routes return HTTP 503 (server still boots)
- Reference implementation: `server.ts` → `callGemini()`; same idiom as biochemai/omniextract
- Migrated from direct `@google/genai` SDK usage on 3 Jul 2026 (SDK dependency removed)
- Do not move Gemini calls to the frontend; the relay credential is server-side only.

---

## 6. Google OAuth 2.0

- Flow: standard authorisation code exchange via `https://oauth2.googleapis.com/token`.
- Callback routes handled at both `/callback` and `/magic-reader/callback` on the Express server.
- On success, a `magic_reader_user` cookie (base64-encoded JSON) is set with `path: '/magic-reader/'`, `httpOnly: false`, `secure: true`, `sameSite: lax`, 7-day TTL.
- The cookie path is scoped to `/magic-reader/` — do not change this or the frontend will not read it.
- Required Google Cloud Console settings: authorised redirect URI must include `https://ai-tools.techbridge.edu.gh/magic-reader/callback`.

---

## 6a. Frontend standards

- **Vite base is relative (`./`)** and `define`s `VITE_GOOGLE_CLIENT_ID`/
  `VITE_GOOGLE_REDIRECT_URI` at build time. The OAuth callback is handled entirely
  server-side (`server.ts`'s `/magic-reader/callback` route sets a cookie and
  redirects to `/magic-reader/`) rather than as a client-side SPA route, so the
  Pattern 29 absolute-base requirement (which targets nested *client* routes) does
  not clearly apply here — flag if a genuine deep client route is ever added.
- **Lean initial load (Pattern 32) — not compliant.** `index.html` loads Google Fonts
  (`fonts.googleapis.com`/`fonts.gstatic.com`) and `googletagmanager.com/gtag/js` at
  boot, not deferred to `window.load`. No Tailwind CDN and no `esm.sh` importmap.
- Only `favicon.svg` in `public/`; no `manifest.json` referenced in `index.html`, so
  Pattern 33 doesn't apply.
- No code-splitting audit done in this pass (Pattern 31) — `pnpm build` not run.

---

## 7. Deploy Pattern

```powershell
.\deploy.ps1 -Build
```

- Always pass `-Build` — the Vite static assets in `dist/` still need building even
  though the server itself runs as `server.ts` via `tsx`, not the compiled bundle.
- The script clones/pulls from `git@github.com:DanielFTwum-creator/aucdt-utilities.git`, subfolder `deliberate-magic-reader`.
- Remote path on server: `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/magic-reader/` — confirmed the deployed slug is `magic-reader`, matching the OAuth cookie path and callback route hardcoded in `server.ts`.
- Pattern 9 (Express server + PM2) · Pattern 12 (NVM v26).

### Pattern 13 violation: `tsx` is in `devDependencies`, but the server install uses `--prod` [GAP]

`deploy.ps1` runs `CI=true pnpm install --prod --silent` on the server (line 131),
which excludes `devDependencies` — and `tsx` sits in `devDependencies` in
`package.json`. PM2 is then started with `--interpreter npx --interpreter-args tsx`.
This works today only because `npx tsx` falls back to fetching `tsx` on demand when
it isn't present in `node_modules`, which is not the documented fleet pattern
(root `CLAUDE.md` / Pattern 13 requires `tsx` in `dependencies` for exactly this
reason) and is a soft dependency on npm registry reachability at every fresh deploy
or `pm2 delete && start`. Not fixed here (docs-only pass) — move `tsx` to
`dependencies` on the next code touch to bring this in line with the rest of the
fleet.

---

## 8. Pre-Delivery Gate

Before deploying, confirm:

```
☐ pnpm build completes without errors (vite build; the esbuild bundle it also produces is not what runs in prod — see §3)
☐ All five env vars are set in the server .env file
☐ GOOGLE_CLIENT_SECRET is not committed to the repository
☐ OAuth redirect URI in Google Cloud Console matches VITE_GOOGLE_REDIRECT_URI (https://ai-tools.techbridge.edu.gh/magic-reader/callback)
☐ pnpm install run without --prod flag locally (devDependencies needed for build tooling); note the server itself installs WITH --prod (see Pattern 13 gap above)
☐ server.ts relays via callGemini() — no GEMINI_API_KEY reference anywhere in server.ts
☐ Health check passes: GET /magic-reader/api/health → { ok: true }
☐ PM2 process named deliberate-magic-reader is running on port 3008, served at /magic-reader/ (not /deliberate-magic-reader/)
```

---

*Authored 2026-06-26 — Daniel Frempong Twum / TUC ICT*
