
# TUC Platform Administration Guide

## 1. Authentication
- **Entry Point:** Access via `/#/admin` (or footer Shield icon).
- **Credentials:** Institutional Admin Password (configured via env).
- **Security:** Locked out for 30 seconds after 3 failed attempts.

## 2. Audit Hub
- Monitors all critical system events.
- **Log Types:**
  - `LOGIN_SUCCESS`: Verified administrative access.
  - `LOGIN_FAILURE`: Invalid attempt tracking.
  - `SECURITY_LOCKOUT`: Brute-force prevention triggers.
  - `CLEAR_LOGS`: Log maintenance history.

## 3. System Maintenance
- Logs should be reviewed weekly for unauthorized access patterns.
- Clear logs only after manual backup if institutional policy requires it.

---
**Design and Build a Nation!**
