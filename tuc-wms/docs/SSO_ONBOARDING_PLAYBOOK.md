# AI-Lab → WMS SSO Onboarding Playbook

| Field | Value |
|---|---|
| **Companion to** | `SSO_PASSTHROUGH_DESIGN.md` (TUC-ICT-SDD-2026-001) |
| **Goal** | One Techbridge Google Workspace login covers every AI-Lab app — no per-app re-login |
| **Status** | LIVE: tsapro (A) · umat (B, staff-only) · markai (B, hybrid) · tuc-netscan-100 (C) · **lems (B, staff+student)** |
| **Date** | 2026-06-13 |

## Why this works
Once an app is a WMS-SSO client, the user's `wms_refresh` cookie (scoped to `.techbridge.edu.gh`)
is shared across **all** subdomains — `techbridge.edu.gh`, `wms.techbridge.edu.gh`,
`ai-tools.techbridge.edu.gh`. So after one login (Google + TOTP if the role requires it),
every onboarded app silently adopts the session via `/api/auth/refresh` (`JWT_REFRESHED`) —
no second login. The apps already share one Google OAuth *client*; this makes them share the
*session*.

## Audience policy (DECIDED 2026-06-09)
WMS SSO domain-gates `@techbridge.edu.gh`, so it only fits **staff/internal** apps.
**Public-facing apps keep their own existing Google login** (which already handles
student/external/public users) — they are NOT onboarded to WMS SSO. So the first step of
the rollout is **classification**, not migration:

| App audience | Auth |
|---|---|
| Staff / internal (Workspace accounts) | → onboard to WMS SSO (this playbook) |
| Public-facing (students / external / anonymous) | → leave as-is (own per-app Google login) |

Only the staff-only subset gets the "log in once across the fleet" experience; that's the
intended scope.

## Two app archetypes
**A. react-router SPA** (tsapro ✅, tuc-ai-lab-catalog) — drop in the WMS client components
(`auth/api.ts`, `AuthContext`, `LoginPage`, `CallbackPage`, `MfaPage`, `ProtectedRoute`), add a
`/auth/callback` route, BrowserRouter basename = the app subpath.

**B. no-router state SPA** (umat ✅, markai ✅) — no routes; auth is gated by `if (!currentUser) <LoginView/>`.
Reference implementations: `umat/auth/` (plain JSX, staff-only) and `markai/services/wmsAuthService.ts` +
`markai/contexts/AuthContext.tsx` + `markai/components/WmsMfaModal.tsx` (TSX, hybrid — local accounts kept).
Adapt instead of copy:
- Rewrite the app's `AuthContext` to, on mount: (1) read `?code` / `?mfa_ticket` / `?error` from
  the URL (the WMS callback lands here), handle them, then clean the URL; (2) otherwise do a silent
  `POST {WMS}/api/auth/refresh` → `/api/me` to adopt an existing session.
- `LoginView` "Continue with Google" → `https://wms.techbridge.edu.gh/api/auth/google?app=<id>`.
- Render an **MFA modal** (verify/enrol-with-QR, ported from `MfaPage` minus routing) when a
  `mfa_ticket` is present. Note: the common case (user already logged into another fleet app) is
  silent adoption — the MFA modal only fires on a session's first login if it happens at this app.
- The static `.htaccess` SPA-fallback already serves `/<app>/auth/callback` → `index.html`.

## Per-app steps
**WMS side (batch several apps per restart to minimise downtime):**
1. Edit `/opt/tuc-wms/application.yml` → add `app-bases.<id>: "<frontend base>"` and the app's
   origin to `allowed-origins`.
2. `systemctl restart tuc-wms` (brief; additive + config-defaulted, rollback = `.bak` jar).
3. Verify: `curl -sI "https://wms.techbridge.edu.gh/api/auth/google?app=<id>"` → 302 + `sso_app=<id>`.

**App side:**
4. Swap auth per archetype (above). Point the app's auth API base at `https://wms.techbridge.edu.gh`,
   all calls `credentials: 'include'`. Remove the app's own OAuth (`server.*` `/api/auth/google/*`).
5. Map the WMS user (`{email,name,role}` from `/api/me`) to the app's user shape.
6. Build → deploy. Static (Plesk) apps: `scp dist/` to the docroot, `chown -R <vhost-user>:psacln`,
   755/644 (root:root ⇒ 403). The `.htaccess`/nginx SPA-fallback handles the callback route.

**Google console (once per registrable origin):** ensure the app's origin is an authorised JS
origin — `ai-tools.techbridge.edu.gh` and `techbridge.edu.gh` already are. No new redirect URI
(callback stays on the WMS host).

## Per-app checklist
```
☐ Audience confirmed staff-only (or policy decided)
☐ app-bases + allowed-origins added; WMS restarted; handoff 302 verified
☐ AuthContext swapped (silent refresh + callback handling) per archetype
☐ "Continue with Google" → {WMS}/api/auth/google?app=<id>
☐ MFA modal (no-router) or MfaPage route (router) wired
☐ App's own OAuth endpoints removed/bypassed
☐ Built + deployed; SPA-fallback serves /<app>/auth/callback
☐ Tested: fresh login + silent adoption from another fleet app
```

## Rollout (per the final classification in SRS-2026-013 §4)
1. ✅ **markai** — pilot complete 2026-06-11, browser-confirmed 2026-06-12 (hybrid: staff → SSO,
   external users keep local accounts; the old unrestricted client-side Google flow is removed).
2. ✅ **umat** — staff-only archetype B (2026-06-11), incl. WMS-side persistence (`/api/umat/**`).
3. ✅ **lems** — live 2026-06-13 (`lems.techbridge.edu.gh`). Archetype B-style: auth gated at App
   level before the Router mounts; authenticated state uses react-router for student vs admin
   routing. Audience: all `@techbridge.edu.gh` accounts (students + staff). Notes:
   - LEMS is itself SRS-2026-013; it runs as a module inside WMS (`/api/lems`), not a separate service.
   - Domain-rejected sign-ins served via static `auth-error.html` (bypasses SPA + stale SW).
   - Service worker unregistration included in the error page to clear stale caches on next visit.
4. Remaining staff set: reconcile the two netscans, analytics dashboards (Impact Ventures, Strategy),
   tuc-2026-enrollment-command-centre, techbridge-student-population-register.
5. Public apps (incl. tuc-ai-lab-catalog hub, biochemai, willpro, glucose, dictation-app) keep their
   own login — no action. Static/no-auth apps need nothing.
