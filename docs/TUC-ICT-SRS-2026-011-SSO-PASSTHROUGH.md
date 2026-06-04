# Design — Google SSO Pass-Through Across ai-tools Apps

| Field | Value |
|---|---|
| **Document ID** | TUC-ICT-SRS-2026-011 |
| **Title** | Single Sign-On (SSO) Pass-Through for the ai-tools App Suite |
| **Author** | Daniel Frempong Twum / TUC ICT |
| **Status** | DRAFT — design for review (no code yet) |
| **Date** | 2026-06-04 |
| **Standard** | IEEE 29148 |

---

## 1. Problem & Goal
Users authenticate with **"Continue with Google"** on ai-lab, then must repeat it on every
other ai-tools app (biochemai, glucose, dmcdai, omniextract, willpro, …). Goal: **log in
once, and the other apps adopt the session silently** — no repeated Google button.

Today all apps **share one Google OAuth client** (`537671076222-…`, see shared-OAuth note),
but each app keeps its **own** session (sessionStorage/per-app cookie) and re-runs the full
OAuth dance independently. That independence is the entire cause.

## 2. Key fact that makes this tractable
**All ai-tools apps are served from a single origin:** `https://ai-tools.techbridge.edu.gh/<app>/`.
A cookie scoped to that origin with `Path=/` is visible to **every** sub-app. That is the
foundation of the recommended approach. (Note: `wms.techbridge.edu.gh` and
`rms.techbridge.edu.gh` are SEPARATE origins — see §6 cross-subdomain.)

## 3. Recommended approach (best practice): central session at the shared origin
A small **central auth service** (or the existing ai-lab backend) owns the Google OAuth dance
and issues a **shared session** the whole origin can read.

1. **One callback owner.** Google redirects to a single callback (e.g. `/ai-lab/auth/google/callback`
   or a dedicated `/auth/...`). Only this endpoint exchanges the code.
2. **Shared session cookie.** On success it sets an **HttpOnly, Secure, SameSite=Lax** session
   cookie at domain `ai-tools.techbridge.edu.gh`, `Path=/` — so `/biochemai/`, `/glucose/`, etc.
   all send it automatically. Cookie holds an opaque session id (server-side store) or a signed
   short-lived token; never the Google tokens.
3. **Silent adoption.** Each sub-app, on load, calls `GET /<central>/api/session` (credentials:
   include). If the shared cookie is valid → returns the user → the app logs in **without showing
   the Google button**. If not → the app shows "Continue with Google", which routes to the central
   start endpoint.
4. **Single logout.** Clearing the shared cookie at the origin logs the user out of all apps
   (combine with each app's local cleanup — see dual-auth logout note).

**Why this over per-app OAuth:** one callback, one session, one place to reason about security;
sub-apps become thin consumers. Matches how SSO is done in practice (shared cookie + session
introspection), not N independent flows.

### Alternative considered — `prompt=none` silent re-auth
Each app could call Google with `prompt=none` to silently get a token if the Google session is
alive. Works, but: still N flows, more redirects, and depends on Google session cookies/3rd-party
cookie policy. **Rejected** in favour of the shared-origin session (simpler, fewer round-trips,
not subject to 3rd-party-cookie deprecation).

## 4. Security requirements
- Shared cookie: `HttpOnly; Secure; SameSite=Lax; Domain=ai-tools.techbridge.edu.gh; Path=/`.
- CSRF: state param on the OAuth start; for the session-introspection GET, no state needed (read-only).
- Session store with idle + absolute expiry; server-side revocation on logout.
- The single callback must keep all existing per-app `redirect_uri`s working during migration
  (do NOT delete other apps' URIs from the Google console — see OAuth multi-app callback note).
- WAF rule 210580 (OAuth `scope` param) exemption on the callback path, as for current apps.

## 5. Migration / rollout (incremental, low-risk)
1. Stand up the central session endpoints (`/start`, `/callback`, `/api/session`, `/logout`) —
   additive; nothing else changes yet.
2. Pilot ONE app (e.g. biochemai): on load it calls `/api/session`; if logged-in, skip the button.
   Keep its existing OAuth as fallback. Verify.
3. Roll the same thin client to the other apps one at a time.
4. Once all adopt the shared session, retire the per-app OAuth flows.

## 6. Open decisions (need Daniel)
1. **Central owner:** new dedicated tiny auth service, or extend the existing ai-lab backend
   (which already owns a hardcoded `/ai-lab/` callback)?
2. **Session token:** opaque id + server store (Redis/DB) vs. signed stateless cookie (JWT)?
   Server store gives instant revocation; stateless is simpler but revocation is harder.
3. **Cross-subdomain scope:** do `wms.techbridge.edu.gh` / `rms.techbridge.edu.gh` (separate
   origins) need to share this SSO too? If yes, the cookie must be at the parent
   `.techbridge.edu.gh` and every participating app must trust it — bigger blast radius, decide
   explicitly. tuc-wms currently has its own JWT auth (SRS 2026-004) — reconcile or keep separate.
4. **Identity source of truth:** the shared session maps a Google account to which app-side user
   record? Each app has its own user model today.

## 7. Acceptance criteria (when built)
- AC-SSO-1: After logging in on app A, opening app B on the same origin lands authenticated with
  NO Google button shown.
- AC-SSO-2: Logout on any app clears the shared session; all apps then require re-login.
- AC-SSO-3: A user with no/expired session sees "Continue with Google" and the flow still works.
- AC-SSO-4: No existing app's login breaks during the phased rollout.

---
*Status: DESIGN ONLY. Sequenced after rms login fix (done) + tuc-wms OAuth Phase 1 (done).
Next: Daniel resolves §6, then build the central session service + pilot on one app.*
