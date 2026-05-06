# Admin Guide — PLCRP

## Accessing the Admin Panel

Navigate to `/#/admin` or click **Admin Panel** in the sidebar.

**Admin Password:** `plcrp-admin-2025`

Standard users (TUC email login) will see a password prompt when visiting `#/admin`.

---

## Audit Log Tab

Displays all system events in reverse chronological order:
- Track additions, promotions, and denials
- Release creation attempts (including blocked NON_COMMERCIAL attempts)
- Admin logins and logouts
- Navigation events
- Diagnostic runs

Events tagged `denied` are highlighted red; `allowed` events are highlighted green.

**Refresh** button reloads from localStorage. **Clear All** purges the log (with confirmation).

---

## Diagnostics Tab

| Check | What it verifies |
|---|---|
| S2 NON_COMMERCIAL block | Gate is enforced in `canPromote()` |
| S4 Authorship ≥2 | Human authorship gate is active |
| Distribution COMMERCIAL-only | Only COMMERCIAL S5 tracks reach DSPs |
| Audit chain hash verification | Track `auditHash` is computed on every save |

Click **Run Diagnostic** to execute a simulated check and append the result to the audit log.

---

## localStorage Keys

| Key | Contents |
|---|---|
| `plcrp-audit-logs` | Audit log entries (max 500, LIFO) |
| `plcrp-tracks` | Track catalogue (seeded on first load) |
| `plcrp-releases` | Release records |
| `plcrp-theme` | Selected display theme |

Clear these in DevTools → Application → Local Storage to reset the sandbox.
