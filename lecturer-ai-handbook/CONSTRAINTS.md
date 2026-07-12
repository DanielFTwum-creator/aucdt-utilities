# CONSTRAINTS.md — Lecturer AI Handbook

> Environment spec for this app. Claude reads this at Session Start (Protocol step 2).
> It overrides global defaults.

| Field | Value |
|---|---|
| Public URL | `https://ai-tools.techbridge.edu.gh/lecturer/` |
| Deploy path | `/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/lecturer/` |
| Port (PM2 `lecturer-ai-handbook`) | **3042** (PORT-REGISTRY.md) |
| Stack | React 19 · TypeScript · Tailwind v4 (build-time) · Express 5 · tsx · Vite |
| Serving | self-serving-Node (Node serves the SPA from `dist/` + guarded `/api/`) |
| Auth | WMS SSO, archetype B, **all-TUC** (`@techbridge.edu.gh` staff + students) |

## AI key custody (non-negotiable — Pattern 11)

- This app **never holds a Gemini key**. `server.ts` relays `/api/gemini/generate`
  to WMS `https://wms.techbridge.edu.gh/api/gemini/generate` with the
  `GEMINI_PROXY_KEY` service credential; only WMS adds the real key.
- `GEMINI_PROXY_KEY` is injected on the server at deploy time from `/opt/tuc-wms/.env`
  (file-to-file, never on the dev machine, never echoed — SEC §12). `@google/genai`
  is not a dependency.

## Auth (WMS SSO archetype B, all-TUC)

- `src/auth.tsx` `AuthGate` wraps the app: silent refresh → "Continue with Google" →
  TOTP MFA (QR enrolment, Pattern 30). The WMS access token is held in memory and
  injected into every same-origin `/lecturer/api/` call by a `window.fetch` wrapper.
- `src/server/wmsAuthMiddleware.ts` `requireWmsAuth` guards `/api/gemini/generate`:
  validates the Bearer against WMS `/api/me` (60 s cache), domain-gated to
  `@techbridge.edu.gh`. This is what stops non-TUC callers consuming the AI relay.
- **WMS registration (required):** register as SSO app-base `app-bases.lecturer` in
  `/opt/tuc-wms/application.yml`, pointing at `https://ai-tools.techbridge.edu.gh/lecturer/`
  (same as aitopia/patois). Edit with `nano`. The SSO callback lands on
  `/lecturer/auth/callback` and is served by the SPA fallback.

## Serving (self-serving-Node)

- Under `NODE_ENV=production`, `server.ts` serves `dist/` (`express.static` at both `/`
  and the `/lecturer` prefix) + SPA fallback, plus the WMS-guarded `/api/`. Port 3042.
- nginx proxies **all** of `/lecturer/` to `localhost:3042`. No Apache, no `.htaccess`.
- `.env` sits outside `dist/`, never web-served.

## Frontend standards

- **Vite base is absolute `/lecturer/`** (Pattern 29) — nested OAuth callback route.
- **Lean initial load** (Pattern 32): Tailwind is build-time (v4 plugin), no
  `cdn.tailwindcss.com`, no external fonts, no esm.sh importmap.
- **Code-split** (Pattern 31): jsPDF loads on demand at PDF-export time. `pnpm build`
  shows no `> 600 kB` chunk warning.
- Manifest icons (if added) must be a local `favicon.svg` — `node scripts/check-manifests.mjs` (Pattern 33).

## Deploy

`.\deploy.ps1 -Build` (server-side build from `main`, so FF `main` first). The one-time
nginx `location /lecturer/ -> :3042` change goes through the Pattern 26 gate, not the script.

## Pre-deploy checklist

```
☐ registered as app-bases.lecturer in /opt/tuc-wms/application.yml -> /lecturer/
☐ nginx routes /lecturer/ -> localhost:3042 (Pattern 26 gate)
☐ GEMINI_PROXY_KEY injected server-side (deploy.ps1 step 4); @google/genai absent
☐ GET /lecturer/api/health -> { ok: true, custody: "wms-relay" }
☐ Sign-in: Continue with Google -> (MFA) -> app renders; /lecturer/api/gemini/generate returns 401 without a token
```
