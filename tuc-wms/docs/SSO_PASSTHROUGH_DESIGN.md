# SSO Pass-Through — Design Specification

| Field | Value |
|---|---|
| **Document ID** | TUC-ICT-SDD-2026-001 |
| **Version** | 0.1 (draft for review) |
| **Date** | 2026-06-08 |
| **Author** | Daniel Frempong Twum / TUC ICT |
| **Status** | DRAFT — awaiting approval before any production WMS code change |
| **First client** | TSAPro (salary/grade tool), served at `https://techbridge.edu.gh/tsapro` |
| **Identity provider** | TUC-WMS auth backend (`wms.techbridge.edu.gh`) |

---

## 1. Purpose & Scope

Allow other Techbridge applications to authenticate against the **existing WMS
Google-SSO + TOTP-MFA backend** instead of each app shipping its own auth. This
document specifies the **minimal, additive, backward-compatible** changes needed to
turn the WMS auth service from single-tenant into a multi-tenant SSO provider, and
the corresponding client-side work for the first consumer, **TSAPro**.

In scope: the multi-tenant handoff, cookie/CORS scoping, the TSAPro client, user
provisioning, deployment. Out of scope: changing WMS's own login behaviour (it must
remain byte-for-byte unchanged), and any change to the Google OAuth callback URI.

## 2. Background — current single-tenant state

The WMS backend hard-codes one consumer (`wms.techbridge.edu.gh`) in three places:

| Concern | Location | Current behaviour |
|---|---|---|
| Post-login redirect | `OAuthSuccessHandler` L61/L67 | redirects to `props.frontendBase + /auth/callback` |
| Failure redirect | `SecurityConfig` L87 | `props.frontendBase + /auth/callback?error=oauth` |
| CORS | `SecurityConfig` L103 | `allowedOrigins = [frontendBase]` |
| Refresh cookie | `AuthController.refreshCookie` L154 | `wms_refresh`, no `Domain` (→ wms host only), `path=/api/auth`, `SameSite=Lax`, `Secure` |

The Google callback (`/api/auth/google/callback`) is **fixed and host-bound to the
WMS backend** — Google always returns there; only the *final, app-ward* redirect
differs per consumer. **Therefore no new Google redirect URI is required.**

## 3. Goals & non-goals

**Goals**
- One identity, one MFA enrolment, one audit trail across WMS + adopting apps.
- WMS's own flow unchanged when no app is specified (default = WMS).
- No new backend, JVM, or database (reuse the running WMS service).
- Open-redirect-safe: an app may only be returned to a **server-side allow-listed** base.

**Non-goals**
- Silent cross-app session adoption without a click (future; this design still
  requires the user to choose "Continue with Google" in each app the first time).
- Per-app role models (all apps share the WMS user store and role set — see §6.6).

## 4. Architecture overview

```
 Browser (techbridge.edu.gh/tsapro)              WMS backend (wms.techbridge.edu.gh)
 ─────────────────────────────────               ───────────────────────────────────
 "Continue with Google"
   → full-page nav ────────────────────────────▶ GET /api/auth/google?app=tsapro
                                                    • validate app ∈ allowlist
                                                    • Set-Cookie sso_app=tsapro (short TTL)
                                                    • 302 → /api/oauth2/authorization/google
   ◀──────────────── Google OAuth dance ─────────▶ (callback /api/auth/google/callback, unchanged)
                                                  OAuthSuccessHandler
                                                    • resolveOrProvision (domain gate, MFA gate)
                                                    • base = lookup(sso_app cookie) ?? frontendBase
   ◀─ 302 to base + /auth/callback?code=…  ───────  (or ?mfa_ticket=… / ?error=…)
 CallbackPage @ /tsapro/auth/callback
   → POST https://wms.techbridge.edu.gh/api/auth/exchange  (credentials: include)
   ◀─ { access_token } + Set-Cookie wms_refresh; Domain=.techbridge.edu.gh
 App runs; silent refresh via POST .../api/auth/refresh (cookie is same-site)
```

Key insight: `techbridge.edu.gh` and `wms.techbridge.edu.gh` share the registrable
domain `techbridge.edu.gh`, so they are **same-site**. A `SameSite=Lax`, `Secure`
cookie with `Domain=.techbridge.edu.gh` is therefore sent on TSAPro→WMS requests,
and CORS (with an explicit allowed origin + credentials) covers the XHR calls. No
`/tsapro/api` reverse proxy is needed for auth — TSAPro talks to the WMS host directly.

## 5. Sequence (TSAPro first login, MFA role)

1. User clicks **Continue with Google** → browser navigates to
   `https://wms.techbridge.edu.gh/api/auth/google?app=tsapro`.
2. Backend validates `app=tsapro` against the allowlist, sets `sso_app` cookie,
   redirects into the standard Google authorization-code flow.
3. Google authenticates and calls the **unchanged** WMS callback.
4. `OAuthSuccessHandler` runs domain gate → provisioning → MFA gate, then redirects
   to `https://techbridge.edu.gh/tsapro/auth/callback` with `?code=` (or `?mfa_ticket=`).
5. TSAPro `CallbackPage` exchanges the code (or collects TOTP then verifies) against
   the WMS host; receives the access token + `wms_refresh` cookie.
6. `AuthContext` silent-refreshes on subsequent loads via the shared cookie.

## 6. Detailed design

### 6.1 App handoff via a short-lived `sso_app` cookie (allow-listed)
- New config `tucwms.auth.app-bases` — a `Map<String,String>` of `appId → frontendBase`,
  e.g. `wms: https://wms.techbridge.edu.gh`, `tsapro: https://techbridge.edu.gh/tsapro`.
- `OAuthEntryController.startGoogleLogin(@RequestParam(required=false) String app)`:
  if `app` is present and **in the map**, write a `Secure`, `HttpOnly`, `SameSite=Lax`,
  short-TTL (≈5 min) cookie `sso_app=<appId>` scoped to `Domain=.techbridge.edu.gh`,
  `path=/api`. If `app` is absent or unknown, write nothing (WMS default).
- `OAuthSuccessHandler` resolves the target base as
  `appBases.get(cookie.sso_app)` falling back to `props.frontendBase`, and clears the
  `sso_app` cookie on redirect. **Open-redirect safety:** the base is never taken from
  a request value directly — only from the server-side map.
- The same fallback is applied to `SecurityConfig` failure redirect (read `sso_app`).

### 6.2 Refresh-cookie domain widening
- `AuthProperties.cookieDomain` (default empty = current host-only behaviour).
- When set (`.techbridge.edu.gh`), `AuthController.refreshCookie` adds `.domain(...)`.
  WMS deployments that leave it empty are unaffected.
- **Path note:** the cookie `path` stays `/api/auth`; TSAPro calls the WMS host
  directly (`/api/auth/*`), so the path matches. (A `/tsapro/api` proxy would *not*
  match this path — hence the direct-host design.)

### 6.3 CORS allowed-origins as a list
- `AuthProperties.allowedOrigins` (`List<String>`, default `[frontendBase]`).
- `SecurityConfig.corsSource` uses the list. Add `https://techbridge.edu.gh`.
- `allowCredentials(true)` already set; origins must be explicit (no `*`).

### 6.4 TSAPro client
- Add WMS client components (adapted from `tuc-wms/frontend/src/auth/*` + `api.ts`):
  `AuthContext`, `LoginPage` (single Google button → WMS host with `?app=tsapro`),
  `CallbackPage`, `MfaPage`, `ProtectedRoute`. `api.ts` base = `https://wms.techbridge.edu.gh`,
  all calls `credentials: 'include'`.
- Routing: add `/auth/callback`; wrap the app in `AuthProvider` + `ProtectedRoute`.
- **Remove** the legacy auth: `AuthGate.tsx` (admin/admin), `src/AuthGate.*`,
  `pages/LoginPage.tsx` (password), `contexts/AuthContext.tsx` (password),
  `services/AuthService.ts`. Update `index.tsx` to drop the `<AuthGate>` wrapper.
- `vite base` stays `'./'` (path-portable).

### 6.5 Provisioning the three users
- `POST /api/admin/users` (SYSTEM_ADMIN-only) for each:
  `stephanie.acquah-djan@techbridge.edu.gh`, `daniel.twum@techbridge.edu.gh`,
  `easantea@techbridge.edu.gh`. Pre-provisioning means their first Google login
  matches the existing record instead of defaulting to STUDENT.

### 6.6 OPEN DECISION — role ↔ MFA ↔ WMS-authority coupling
Because identity is shared, the **role** chosen for these users in WMS has two
side effects:
- `requiresMfa()` is true **only** for `HOD` and `SYSTEM_ADMIN`. To force TOTP MFA on
  the salary tool, the user must hold one of those roles…
- …but those roles also grant elevated **WMS** authority (e.g. SYSTEM_ADMIN unlocks
  `/api/admin/**`). That is almost certainly **not** wanted for salary-tool users.

Options (decision required before provisioning):
1. **`ADMIN_STAFF`** — no elevated WMS access, **no MFA**. Simplest; matches "staff".
2. **`HOD`/`SYSTEM_ADMIN`** — gets MFA but leaks WMS privilege. Not recommended.
3. **Decouple MFA from role** (small enhancement: an `mfaRequired` flag per user, or a
   per-app MFA policy) — gets MFA on tsapro without WMS privilege. Best long-term, but
   scope beyond this change.

Recommendation: provision as **`ADMIN_STAFF`** now (path 1) and track MFA-decoupling
(path 3) as a follow-up if MFA on tsapro is mandatory.

## 7. Security considerations
- **Open redirect:** target base resolved only from the server-side allowlist; the
  request never supplies a URL, only an opaque `appId`.
- **Cookie scope:** `wms_refresh` widened to the registrable domain only
  (`.techbridge.edu.gh`); still `HttpOnly`, `Secure`, `SameSite=Lax`, `path=/api/auth`.
- **CORS:** explicit origins + credentials; no wildcard.
- **Blast radius:** all changes gated by new, defaulted config — an unconfigured WMS
  behaves exactly as today.
- **Audit:** unchanged — provisioning, MFA, JWT issuance already audited per-email.

## 8. Configuration summary (new keys, all defaulted)
```yaml
tucwms:
  auth:
    cookie-domain: ".techbridge.edu.gh"        # default "" → host-only (unchanged)
    allowed-origins:                            # default [frontendBase]
      - "https://wms.techbridge.edu.gh"
      - "https://techbridge.edu.gh"
    app-bases:
      wms: "https://wms.techbridge.edu.gh"
      tsapro: "https://techbridge.edu.gh/tsapro"
```

## 9. Deployment
- **Google console:** add `https://techbridge.edu.gh` as an authorised JavaScript
  origin. (Redirect URI unchanged.)
- **nginx (techbridge.edu.gh):** serve the `/tsapro` SPA (SPA fallback to
  `/tsapro/index.html`). No `/tsapro/api` proxy required for auth.
- **WMS backend:** redeploy with the new config; verify WMS login still works first.
- **TSAPro:** build (`base './'`) → `scp dist/` to the Plesk docroot for `/tsapro`.

## 10. Backward compatibility & rollback
- All backend changes are additive and config-defaulted; reverting config (or the
  commit) restores single-tenant WMS exactly.
- TSAPro frontend is independent; rolling back its bundle reverts to the old gate.

## 11. Onboarding checklist (future apps)
1. Add `appId → base` to `tucwms.auth.app-bases`; add origin to `allowed-origins`.
2. Add the app's origin as a Google authorised JS origin (if a new registrable domain).
3. Drop the WMS client components into the app; point `api.ts` at the WMS host;
   "Continue with Google" → `…/api/auth/google?app=<appId>`.
4. Pre-provision users via `/api/admin/users`.
5. Serve the SPA; verify login + silent refresh.

## 12. Open decisions for sign-off
- [ ] Role for the three TSAPro users (§6.6) — recommend `ADMIN_STAFF`.
- [ ] Is TOTP MFA **mandatory** on TSAPro? If yes, schedule the MFA-decoupling enhancement.
- [ ] Confirm `wms.techbridge.edu.gh` is the live WMS host and `techbridge.edu.gh/tsapro` the target path.
```
