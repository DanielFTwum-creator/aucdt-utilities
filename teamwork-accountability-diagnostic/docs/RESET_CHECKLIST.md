# PROJECT RESET & SYSTEM RE-AUDIT CHECKLIST
## Techbridge University College (TUC) — ICT Division
### Owner: Daniel Twum, Head of ICT
### Reference Code: TUC-INC-2026-001

This checklist outlines the standard operating procedures (SOP) to fully purge, reset, and re-audit the **TypeMaster Pro / Teamwork Diagnostic** system state. Use this before launching a new student cohort or running diagnostic re-tests.

---

## Phase 1: Local Storage & Session State Purge
- [ ] **Clear Browser Cache & Session Tokens**: Purge current user credentials, cookies, and local database connections.
- [ ] **Purge LocalStorage Variables**:
  - Run `localStorage.removeItem("tuc_diagnostic_answers");`
  - Run `localStorage.removeItem("tuc_diagnostic_theme");`
  - Run `localStorage.removeItem("tuc_diagnostic_muted");`
- [ ] **Hard Refresh (Ctrl + Shift + R)**: Terminate any active service workers or offline caches to force complete client rebuild download.

## Phase 2: Database & Analytics Reset
- [ ] **Truncate Session Telemetry Tables**: Purge all tables tracking raw keystroke intervals or diagnostic session events.
- [ ] **Reset Identity/Account Tables**: Delete test accounts; retain only master academic credentials.
- [ ] **Rebuild Schema Migrations**:
  - Run database migration seeders to restore basic curriculum blocks.
  - Check the health check endpoints (`/api/health`) to confirm zero latency.

## Phase 3: Diagnostics & Security Review
- [ ] **Revoke API Keys / Session Tokens**: Force logout on all active student nodes.
- [ ] **Re-enable Content Security Policy (CSP)**: Verify HTTP headers for script exclusions.
- [ ] **Audit Sound Synthesis**: Ensure Web Audio context is initialized properly on client input gesture.

## Phase 4: Sign-Off
- [ ] ICT Division Head review and master key configuration verification.
- [ ] Log reset in the TUC institutional ledger.
