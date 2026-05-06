# Patois Lyricist - Administrator Operations Manual

## 1. Governance Overview
This manual provides instructions for managing the Patois Lyricist laboratory environment in compliance with SOC 2 Phase 2 standards.

## 2. Administrative Identity
The system designates any user with the handle `admin` as a superuser.
*   **Permissions**: Access to global identity lists, audit logs, and data purge controls.
*   **Brute Force Guard**: Administrators are subject to the same 3-strike lockout as standard users.

## 3. The Governance Dashboard
Accessible via the navigation bar after `admin` verification.

### 3.1 Forensic Audit Trail
*   **Capture**: Every login, generation, and deletion is recorded.
*   **Metadata**: Logs include User Agent and Screen Resolution to verify environmental consistency during sessions.
*   **CSV Export**: Use the "Export CSV" button for regular offline compliance archiving.

### 3.2 Data Management (Right to be Forgotten)
*   **Purge Protocols**: Administrators can wipe any user's local history.
*   **Authorization**: Every destructive action requires re-verifying the administrative token (password) to ensure intentional execution.

## 4. Troubleshooting & Security
*   **Storage Quota**: LocalStorage is limited to 5MB. If users report "Storage Error," administrators should execute a history purge for inactive accounts.
*   **Session Guard**: Sessions expire after 15 minutes of inactivity. Ensure admins are aware of this during long auditing sessions.
