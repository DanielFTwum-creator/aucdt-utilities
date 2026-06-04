# TUC-WMS Auth API — Contract for the WMS UI

> Backend implements SRS TUC-ICT-SRS-2026-004 v1.0.1 (Google Workspace SSO).
> The UI is delivered separately; this is the contract it must integrate against.
> Auth provider: Google (OAuth 2.0 / OIDC). TUC-WMS issues its own JWT post-callback.

## Login flow (what the UI does)

1. **Start sign-in** — the UI renders a single **"Continue with Google"** button that
   navigates the browser to:
   ```
   GET /api/auth/google
   ```
   (Spring Security initiates the OAuth2 authorization-code flow. Do NOT fetch this
   via XHR — it's a full-page redirect to Google.)

2. **Google → callback** — Google redirects to `GET /api/auth/google/callback` (server-side,
   handled by the backend). The backend then **redirects the browser to the UI**:
   ```
   {FRONTEND_BASE}/auth/callback?code=<one-time-code>      ← normal users
   {FRONTEND_BASE}/auth/callback?mfa_ticket=<ticket>       ← HOD / SystemAdmin (FR-AUTH-008)
   {FRONTEND_BASE}/auth/callback?error=domain              ← non-@techbridge.edu.gh (FR-AUTH-009)
   {FRONTEND_BASE}/auth/callback?error=deactivated         ← deactivated TUC-WMS account
   {FRONTEND_BASE}/auth/callback?error=oauth               ← OAuth failure
   ```
   The JWT is **never** placed in the URL (best practice). The UI reads the query param
   on its `/auth/callback` route.

3. **Exchange the code for a session** (normal users):
   ```
   POST /api/auth/exchange
   Body: { "code": "<one-time-code>" }
   200 → { "access_token": "<JWT>", "user": { email, name, role, photoUrl } }
        + Set-Cookie: wms_refresh=<refresh JWT>  (HttpOnly, Secure, SameSite=Lax, path=/api/auth)
   401 → { "error": "Invalid or expired code" }
   ```
   The auth code is single-use and expires in 5 minutes.

4. **MFA** (HOD / SystemAdmin only — FR-AUTH-008):
   ```
   POST /api/auth/mfa/verify
   Body: { "mfa_ticket": "<ticket>", "code": "<6-digit TOTP>" }
   200 → { "access_token", "user" } + refresh cookie   (same as exchange)
   401 → { "error": "Invalid code", "mfa_ticket": "<fresh ticket>" }   (retry without restarting OAuth)
   ```
   The UI shows a 6-digit TOTP input only when it received `?mfa_ticket=`.

## Using the session

- Store the **access token in memory only** (React state / Zustand) — **never** localStorage
  or sessionStorage (NFR-SEC-008).
- Send it on every API call: `Authorization: Bearer <access_token>`.
- Access token expires in **15 minutes**.

## Silent refresh

```
POST /api/auth/refresh        (no body; sends the HttpOnly wms_refresh cookie automatically)
200 → { "access_token", "user" }
401/403 → refresh expired or account deactivated → send the user back to the login page
```
Call this on a 401 from any API, or proactively before the 15-min access token expires.

## Current user

```
GET /api/me        (Authorization: Bearer <token>)
200 → { email, name, role, photoUrl, mfaEnrolled }
```

## Logout

```
POST /api/auth/logout   → clears the refresh cookie. The UI also drops the in-memory token.
```

## Roles (FR-AUTH-003)

`STUDENT` (default on first login), `LECTURER`, `ADMIN_STAFF`, `HOD`, `SYSTEM_ADMIN`.
Role is assigned server-side — there is **no role selector** on the login screen.
`HOD` / `SYSTEM_ADMIN` require TOTP MFA and can only be elevated by a SystemAdmin via
`/api/admin/users/{id}/role` (never auto-assigned).

## Admin (SystemAdmin only — FR-AUTH-004)

```
GET    /api/admin/users                       → list users
PUT    /api/admin/users/{id}/role   { role }   → reassign role
PUT    /api/admin/users/{id}/active { active } → deactivate/reactivate (revokes access immediately)
```

## Notes for the UI build
- Remove any email/password form, role-selector, and forgot-password link (SRS §3.4). The only
  login affordance is "Continue with Google".
- Add an `/auth/callback` route that branches on `code` / `mfa_ticket` / `error`.
- All auth errors should be shown distinctly (domain rejection vs. deactivated vs. generic), not a
  single generic message.
