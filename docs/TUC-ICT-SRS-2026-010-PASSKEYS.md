# Software Requirements Specification — Passkey (WebAuthn) Authentication

| Field | Value |
|---|---|
| **Document ID** | TUC-ICT-SRS-2026-010 |
| **Title** | Passkey (WebAuthn / FIDO2) Authentication for TUC AI-Tools Apps |
| **Author** | Daniel Frempong Twum / TUC ICT |
| **Status** | DRAFT — design for review (no code yet) |
| **Date** | 2026-06-04 |
| **Standard** | IEEE 29148 |

---

## 1. Introduction

### 1.1 Purpose
Define requirements to add **passkey (WebAuthn/FIDO2)** sign-in to TUC AI-Tools apps as a phishing-resistant, passwordless alternative to the current **magic-link** flow. Passkeys let users authenticate with a device biometric/PIN (Face ID, Windows Hello, Android screen-lock) or a roaming authenticator, with no shared secret transmitted.

### 1.2 Scope
- **In scope:** passkey **registration** (enrolment) and **authentication** ceremonies; credential storage; UI for "Sign in with a passkey" + "Add a passkey"; magic-link retained as fallback.
- **Out of scope (v1):** removing magic-link entirely; cross-app single-sign-on; passkey-based admin step-up beyond normal login.
- **Pilot app:** TBD (candidates: `tuc-rms` — highest-stakes auth; or `dmcdai` — magic-link backend already in place). Decide before implementation.

### 1.3 Why now
Passkeys are the current industry standard (Apple/Google/Microsoft + FIDO Alliance), eliminate phishing and credential reuse, and remove the 15-minute magic-link email round-trip. They complement — not replace — the existing magic-link flow in v1.

---

## 2. Overall Description

### 2.1 Current state
TUC apps (e.g. dmcdai, tuc-rms) authenticate via **magic link + OTP**: user submits a TUC username → backend resolves `…@techbridge.edu.gh`, looks up `tuc_rms_users`, emails a one-time link (15-min, single-use). No password store. (See dmcdai `server.js /api/auth/login`.)

### 2.2 Proposed model
Layer WebAuthn on top of the existing user table. A signed-in user can **enrol** one or more passkeys; thereafter they can **sign in with a passkey** instead of waiting for an email. Magic-link remains for: first-time users, new/unenrolled devices, and recovery.

### 2.3 Constraints & assumptions
- **Library:** `@simplewebauthn/server` (backend) + `@simplewebauthn/browser` (frontend) — well-maintained, TS-native, fits the Express/tsx stack. Pinned version (no `latest`, per the SDK-pinning lesson).
- **Relying Party (RP) ID:** the registrable domain. All apps share `ai-tools.techbridge.edu.gh` origin under sub-paths — **RP ID must be `techbridge.edu.gh` or `ai-tools.techbridge.edu.gh`** (decision needed; affects whether a passkey works across sub-apps). Per-app `rpId` is simplest for a pilot.
- **HTTPS required** (already satisfied via Plesk).
- **DB:** MariaDB (port 3307), existing `tuc_rms_users` table reused for identity.
- Backend stays a pnpm Express/tsx pm2 app; deploy via the app's `deploy.ps1 -Build`.

---

## 3. System Features (Functional Requirements)

### FR-PK-001 — Passkey registration (enrolment)
A signed-in user requests to add a passkey. Backend issues a registration challenge (`generateRegistrationOptions`) bound to the user + RP. Browser invokes `startRegistration`; backend verifies (`verifyRegistrationResponse`) and stores the credential.

### FR-PK-002 — Passkey authentication
At login, user chooses "Sign in with a passkey". Backend issues an authentication challenge (`generateAuthenticationOptions`); browser `startAuthentication`; backend `verifyAuthenticationResponse`, checks the signature counter, and on success issues the same session token the magic-link flow issues today.

### FR-PK-003 — Challenge lifecycle
Challenges are single-use, server-stored (or signed), and expire (≤5 min). Reject reused/expired challenges.

### FR-PK-004 — Multiple credentials per user
A user may enrol several passkeys (phone, laptop, security key) and list/remove them.

### FR-PK-005 — Magic-link fallback (retained)
If the user has no passkey, is on a new device, or passkey auth fails, the existing magic-link flow remains fully available. No regression to current login.

### FR-PK-006 — Counter / clone detection
Persist and validate the WebAuthn signature counter; a counter regression flags possible credential cloning → reject + alert.

---

## 4. Data Requirements

New table (illustrative — MariaDB):

```sql
CREATE TABLE webauthn_credentials (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,                 -- FK -> tuc_rms_users.id
  credential_id   VARBINARY(255) NOT NULL UNIQUE,  -- raw credential ID
  public_key      VARBINARY(1024) NOT NULL,        -- COSE public key
  counter         BIGINT NOT NULL DEFAULT 0,
  transports      VARCHAR(255),                    -- e.g. "internal,hybrid"
  device_label    VARCHAR(120),                    -- user-friendly name
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at    DATETIME,
  INDEX (user_id)
);
```
Plus a short-lived challenge store (table or signed cookie). No private keys ever touch the server (that is the point of WebAuthn).

---

## 5. External Interface Requirements (API)

| Endpoint | Purpose |
|---|---|
| `POST /<app>/api/auth/passkey/register/options` | Issue registration challenge (auth required) |
| `POST /<app>/api/auth/passkey/register/verify`  | Verify + store credential |
| `POST /<app>/api/auth/passkey/auth/options`      | Issue authentication challenge (by username) |
| `POST /<app>/api/auth/passkey/auth/verify`       | Verify assertion → issue session token |
| `GET  /<app>/api/auth/passkey/credentials`       | List the user's passkeys |
| `DELETE /<app>/api/auth/passkey/credentials/:id` | Remove a passkey |

UI: "Sign in with a passkey" button on the login modal (alongside magic-link); "Add a passkey" in account/settings.

---

## 6. Non-Functional Requirements
- **Security:** phishing-resistant (origin-bound); challenges single-use + expiring; counter validation; RP ID locked; no secret transmitted.
- **Compatibility:** graceful detection of WebAuthn support; magic-link fallback when unsupported.
- **Performance:** auth round-trip < 2 s (no email wait).
- **Privacy:** store only public key + metadata; biometrics never leave the device.

---

## 7. Verification & Acceptance Criteria
1. A user can enrol a passkey while signed in and see it listed.
2. That user can sign in with the passkey on the same device with no email.
3. A user with no passkey still completes the magic-link flow unchanged (no regression).
4. Reused/expired challenge is rejected; counter regression is rejected.
5. Passkey works on the pilot app's exact origin/RP ID; documented behaviour across sub-apps.
6. Removing a passkey prevents its further use.

---

## 8. Open Decisions (need Daniel's input before build)
1. **Pilot app** — tuc-rms (highest-stakes) vs dmcdai (magic-link backend ready)?
2. **RP ID scope** — per-app vs shared `techbridge.edu.gh` (affects cross-app passkey reuse on the shared ai-tools origin; relates to the shared-OAuth and nginx-proxy layout).
3. **Recovery policy** — if a user loses all passkeys, is magic-link the sole recovery, or also an admin re-enrol?
4. **Enrolment prompt** — opt-in from settings only, or prompt after a magic-link login ("add a passkey for faster sign-in")?

---

*Status: DESIGN ONLY — no implementation started. Next step: Daniel resolves §8, then a contained pilot per the design.*
