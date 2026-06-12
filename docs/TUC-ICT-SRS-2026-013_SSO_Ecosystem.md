# Software Requirements Specification — Techbridge Unified SSO Ecosystem

| Field | Value |
|---|---|
| **Document ID** | TUC-ICT-SRS-2026-013 |
| **Version** | 1.1.1 |
| **Date** | 2026-06-12 |
| **Author** | Daniel Frempong Twum / TUC ICT |
| **Status** | Baselined (living document — update as apps onboard) |
| **Standard** | IEEE 29148 |
| **Published** | https://wms.techbridge.edu.gh/docs/sso-handbook.html (SYSTEM_ADMIN only) |
| **Related** | TUC-ICT-SDD-2026-001 (SSO pass-through design) · `tuc-wms/docs/SSO_ONBOARDING_PLAYBOOK.md` · TUC-ICT-SRS-2026-004 (TUC-WMS) |

---

## 1. Introduction

### 1.1 Purpose
Specify the requirements and architecture for a **single sign-on (SSO) ecosystem** across the
Techbridge AI-Lab application fleet, so that a member of staff who authenticates once with their
`@techbridge.edu.gh` Google Workspace account is automatically signed in to every **internal/staff**
application — without re-authenticating per app. This document is the authoritative, evolving
architecture reference for the ecosystem; it consolidates the design (SDD-2026-001) and onboarding
playbook into a single requirements baseline.

### 1.2 Scope
**In scope:** the identity provider (TUC-WMS), the multi-tenant SSO mechanism, client-app
integration patterns ("archetypes"), the staff-vs-public application classification and policy,
deployment topology, and the rollout roadmap. **Out of scope:** the internal feature requirements of
each individual application (covered by their own SRSs), and the auth of **public-facing** apps,
which deliberately retain their own login.

### 1.3 Definitions
- **IdP (Identity Provider):** TUC-WMS — owns identity, MFA, roles and audit; issues sessions.
- **SSO client:** a staff app that delegates authentication to the IdP.
- **Pass-through:** after one login, other clients silently adopt the session (no re-login).
- **Archetype:** a class of client app with a common integration shape (A/B/C — §5).
- **Workspace account:** a `@techbridge.edu.gh` Google Workspace identity.

### 1.4 References
TUC-ICT-SDD-2026-001 (design); TUC-ICT-SRS-2026-004 (TUC-WMS); TUC-ICT-SRS-2026-012 (TUC-NetScan);
`SSO_ONBOARDING_PLAYBOOK.md`; memory: `project_ai_tools_sso_passthrough`, `backlog_ai_lab_sso_onboarding`.

## 2. Overall Description

### 2.1 Ecosystem context
The fleet (~60 apps in `aucdt-utilities/`) spans internal staff tools and public-facing apps, on
several subdomains of the common registrable domain **`techbridge.edu.gh`**:
`wms.techbridge.edu.gh` (IdP), `techbridge.edu.gh/<app>`, `ai-tools.techbridge.edu.gh/<app>`,
`netscan.techbridge.edu.gh`. Because all share the registrable domain, an IdP session cookie scoped
to `.techbridge.edu.gh` is transmitted to every subdomain — the foundation of pass-through SSO.

### 2.2 Identity provider — TUC-WMS
TUC-WMS (Spring Boot 3, Java 21; SRS-2026-004) provides: Google OAuth2 (authorization-code), domain
gate (`@techbridge.edu.gh`), per-role + per-user TOTP MFA, first-login provisioning, RBAC, and an
append-only audit trail. It is **multi-tenant** (SDD-2026-001): it can hand authenticated users back
to any allow-listed client app, not just the WMS UI.

### 2.3 The "log in once" goal
Authenticate once (Google, + TOTP where required) at any onboarded staff app → every other onboarded
staff app silently adopts the session via the shared refresh cookie. Verified in production: a user
already signed into WMS entered TSAPro with no second login (`JWT_REFRESHED`).

## 3. Functional Requirements (FR-SSO)

- **FR-SSO-001 Domain gate.** Only `@techbridge.edu.gh` accounts may obtain an SSO session
  (enforced by the IdP; non-domain accounts are rejected, audited).
- **FR-SSO-002 App allowlist.** A client app participates only if registered server-side in the IdP
  `tucwms.auth.app-bases` (id → frontend base) and `allowed-origins`. Unknown apps fall back to IdP
  default behaviour. Redirect targets are never taken from a request value (open-redirect safe).
- **FR-SSO-003 App handoff.** `GET {IdP}/api/auth/google?app=<id>` carries the originating app via a
  short-lived `sso_app` cookie; after Google auth the IdP redirects to `<app-base>/auth/callback`
  with a one-time `code` (or `mfa_ticket`, or `error`).
- **FR-SSO-004 Token exchange.** The client exchanges the `code` at `{IdP}/api/auth/exchange` for a
  short-lived access token + an HttpOnly refresh cookie (`Domain=.techbridge.edu.gh`).
- **FR-SSO-005 Silent adoption.** On load, a client attempts `{IdP}/api/auth/refresh`; success →
  signed in with no user interaction (the pass-through behaviour).
- **FR-SSO-006 MFA.** Where the user's role or per-user `mfaRequired` flag demands it, the IdP issues
  an `mfa_ticket`; the client collects/enrols TOTP (`/api/auth/mfa/**`) before a token is issued.
- **FR-SSO-007 Logout.** Client logout clears local token and calls `{IdP}/api/auth/logout`.
- **FR-SSO-008 Roles.** Client roles derive from the IdP identity/role (clients do not maintain a
  separate password identity). Mapping is per-client (e.g. WMS `SYSTEM_ADMIN/HOD` → NetScan `ADMIN`).
- **FR-SSO-009 Audience policy.** Only **staff/internal** apps onboard. **Public-facing** apps retain
  their own login (Google/username-password/registration) — they are explicitly NOT domain-gated.
- **FR-SSO-010 Hybrid clients.** A public app MAY additionally offer a staff entry point by routing
  only its "Continue with Google" affordance through the IdP, while keeping its local accounts for
  external users (markai is the reference). The hybrid replaces any client-side Google flow — no app
  may run an unrestricted browser-side Google login (markai's old implicit flow accepted ANY Google
  account; removed 2026-06-11).
- **FR-SSO-011 Service-key custody (Gemini relay).** Fleet apps must not store the shared Gemini API
  key. A server-side relay fetches it from the IdP (`GET {IdP}/api/gemini/key`, authenticated by the
  `X-Gemini-Proxy-Key` service header; constant-time compare), caches it in memory with a TTL, and
  invalidates the cache when Google rejects the key — rotation then happens at the IdP only and
  self-heals fleet-wide. No endpoint may ever return the raw key to a browser. markai is the first
  client (2026-06-12); dmcdai/omniextract to follow.

## 4. Application Classification (NFR/policy)

The ecosystem is split by audience (decided 2026-06-09). Onboarding scope = the **staff** subset only.

| Class | Auth | Apps |
|---|---|---|
| **Staff → SSO** | WMS SSO + MFA | TSAPro (live), **UMAT tracker (live 2026-06-11)**, tuc-netscan-100 (live), analytics dashboards (Impact Ventures, Strategy, …), tuc-2026-enrollment-command-centre, techbridge-student-population-register |
| **Hybrid → SSO for staff + own login for external** | "Continue with Google" → WMS SSO; local username/password kept | **markai (live 2026-06-11)** — FR-SSO-010 reference |
| **Public → own login** | own Google / username-password / registration | glucose, rophe-care-rpms, biochemai, bionicskins, willpro, omniextract, dictation-app, ai-email-drafter, techbridge-ai-blueprint, tuc-ai-lab-catalog (hub), techbridge-ai-application-portal, all Google-gated creative/utility tools (poster-studio, luxthumb, groove-streamer, youtube-genie, midjourney-helper, brand-checker, elephant-on-parade, orbit-walk, clipai, ai-techbridge, smartscale, deliberate-magic, patois-lyricist, deep-dub, brainiac), assessments/tutorials (Group C), consumer apps |

**Rule of thumb:** any app that allows self-registration or serves students/external/anonymous users
is public. "Google-gated" alone does **not** imply staff-only.

## 5. Client Integration Archetypes

| | Archetype A — router SPA | Archetype B — no-router SPA | Archetype C — app with own backend |
|---|---|---|---|
| Example | **TSAPro** (live) | **UMAT** (live, plain JSX) · **markai** (live, TSX hybrid) | **tuc-netscan-100** (live, Express relay) |
| Frontend | Drop in WMS `auth/*` components; add `/auth/callback` route; BrowserRouter basename = subpath | Adapt `AuthContext`: on-mount read `?code`/`?mfa_ticket`/`?error` + silent refresh; MFA modal | Same as A (it is a router SPA) |
| Backend | none (static SPA) | none (static SPA) | **becomes a resource server**: validates IdP identity, issues its own session for its API |
| Callback serving | nginx `try_files` / `.htaccess` SPA fallback | same | same |

### 5.1 Archetype C detail (tuc-netscan)
NetScan keeps its own HS256 JWT + RBAC; SSO **bootstraps** that session instead of a password:
1. Frontend runs the WMS SSO flow (archetype A) → obtains a WMS access token.
2. Frontend calls **`POST /api/v1/auth/sso-exchange`** (NetScan backend) with the WMS token.
3. NetScan backend relays it to **`{IdP}/api/me`** (server-to-server) → `{email, role}`; on success it
   maps the WMS role → NetScan role and issues its **own** NetScan JWT (subject = email, `roles` claim).
   *No shared JWT secret* — trust is established by the `/api/me` relay.
4. NetScan's `JwtFilter` derives authorities from the token's `roles` claim (self-contained JWT),
   so no local user record is required. The legacy `/api/v1/auth/login` remains as break-glass.

Role map (NetScan): WMS `SYSTEM_ADMIN`/`HOD` → `ADMIN`; otherwise → `ENGINEER`.

## 6. Deployment Architecture

- **Cookie:** IdP refresh cookie `wms_refresh`, `HttpOnly`, `Secure`, `SameSite=Lax`,
  `Domain=.techbridge.edu.gh`, `path=/api/auth`. Same-site across all subdomains.
- **IdP config (`/opt/tuc-wms/application.yml`, external, additive):** `cookie-domain`,
  `allowed-origins` (each client origin), `app-bases` (each client base). Restart `tuc-wms` to apply;
  batch multiple apps per restart. Rollback = prior `.bak` jar.
- **Google console:** OAuth callback is fixed on the IdP host (`/api/auth/google/callback`) — **no
  new redirect URI per client**. A client origin needs to be a Google **JS origin** only if it runs
  Google JS client-side (the pass-through does not — it full-page-redirects to the IdP).
- **Client deploy:** static SPAs → build, `scp dist/` to the Plesk docroot, `chown <vhost-user>:psacln`,
  755/644 (root:root ⇒ 403); SPA fallback serves `/<app>/auth/callback`. Backend clients (NetScan) →
  rebuild jar + restart their own service.

### 6.1 Implementation rules (hard-won, 2026-06-11/12)
1. **IdP permitAll for controller-self-auth endpoints.** Any IdP endpoint that enforces its own auth
   in the controller (e.g. `X-Gemini-Proxy-Key` checks on `/api/gemini/key` and `/generate`) MUST be
   in Spring Security's permitAll list — otherwise Spring 401s relays before the controller runs.
2. **Env files are LF-only.** A CRLF-written value smuggles `\r` into secrets and breaks
   constant-time comparison at the IdP. On Windows write with `[IO.File]::WriteAllText` (LF), never
   `Set-Content` defaults.
3. **HTML must be no-cache at the layer that actually serves it.** Plesk nginx can serve static html
   directly, bypassing `.htaccess` headers — add `Cache-Control: no-cache` in the vhost nginx block
   (umat precedent) or users keep stale bundles through deploys.
4. **Body limits for image-bearing relays.** Base64-in-JSON inflates uploads ~33%: set BOTH nginx
   `client_max_body_size` and the app body-parser limit to ≥ 2× the advertised file cap.
5. **One env file per deployment.** dotenv loading `.env.local` before `.env` with both present makes
   fixes silently no-op; ship exactly one env file to the webroot.
6. **Allowlist entries are policy.** An app's `app-bases` entry reflects its classification — record
   removals in this document (the markai entry was deliberately removed post-classification, then
   reinstated for the hybrid; both moves looked like drift until documented).

## 7. Security Requirements
- Open-redirect safe (server-side allowlist only); explicit CORS origins + credentials (no wildcard).
- Access token in memory only (never localStorage); refresh token HttpOnly.
- All IdP config additive + defaulted → an unconfigured IdP is byte-identical to single-tenant.
- Per-user MFA decoupled from privilege (`mfaRequired`) so MFA can be required without granting admin.
- Audit retained at the IdP (provisioning, MFA, JWT issue/refresh, domain rejects).

## 8. Current State & Roadmap
- **Live SSO clients (5):** **TSAPro** (A) · **UMAT tracker** (B, staff-only; persists to the IdP
  database via `/api/umat/**`) · **markai** (B, hybrid per FR-SSO-010) · **tuc-netscan-100** (C) ·
  **LEMS** (hosted-in-WMS module, 2026-06-12: `/api/lems/**` + SPA at `{IdP}/lems/`; all-TUC
  audience — students AND staff sign in via SSO; submissions stored anonymously with a salted
  one-per-student dedupe hash, `LEMS_DEDUPE_SALT`; admin = SYSTEM_ADMIN/HOD/ADMIN_STAFF; 7/7
  Cypress e2e). Cross-app silent adoption verified in production.
- **Live service relays (3):** markai, dmcdai and omniextract all on IdP Gemini key custody
  (FR-SSO-011, completed 2026-06-12) — no fleet app stores a raw Gemini key.
- **Retired (2026-06-12):** the Spring Boot mock-data NetScan (`tuc-netscan-backend`, mock.enabled,
  ~105 MB JVM) — `netscan.techbridge.edu.gh` now 301-redirects to the real scanner at
  `ai-tools.techbridge.edu.gh/tuc-netscan-100/`; the `netscan` app-bases entry is removed (§6.1
  rule 6 — recorded here); jar + start script archived to `/root/backups/tuc-netscan-mock-retired-20260612/`;
  the `tuc_netscan` MariaDB database is retained, not dropped.
- **Open:** onboard remaining staff apps (analytics dashboards, enrollment command centre, student
  population register). Public apps: no action.

## 9. Revision History
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-06-09 | Initial baseline: ecosystem architecture, FR-SSO, classification, archetypes A/B/C, NetScan integration design, deployment, roadmap. |
| 1.1.0 | 2026-06-12 | UMAT (B) + markai (B hybrid) + netscan-100 (C) live; new FR-SSO-010 (hybrid clients) + FR-SSO-011 (Gemini key custody relay); hybrid class added to §4; §6.1 implementation rules; roadmap refreshed (stale-markai cleanup superseded by hybrid). |
| 1.1.1 | 2026-06-12 | NetScan reconciliation: Spring mock retired (301 → tuc-netscan-100; `netscan` allowlist entry removed per §6.1 rule 6; artefacts archived; DB retained); published URL added to front matter. |
| 1.1.2 | 2026-06-12 | LEMS live as the first hosted-in-WMS application module (`/api/lems/**` + SPA at `{IdP}/lems/`; all-TUC SSO incl. students; anonymous deduped evaluations); Gemini key custody complete fleet-wide (markai/dmcdai/omniextract). |
