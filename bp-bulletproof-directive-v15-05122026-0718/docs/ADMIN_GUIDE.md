# Administrator Guide

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-004

## 1. Overview
This comprehensive guide provides instructions for the system administrator to manage the TUC Project Refresh Framework application, including session management, reading audit logs, and troubleshooting.

## 2. Admin Login & Session Management
The application features a secure, password-protected administrative interface designed to safeguard access to diagnostic tools and logs.

### 2.1 Accessing the Admin Panel
1. Navigate to the main application interface.
2. Locate the **Admin** button (represented by a padlock or shield icon) in the top right corner.
3. Upon clicking, a secure modal will appear.
4. Enter the required administrative password to gain access to the `Admin Dashboard`.

### 2.2 Session Management
- **Token Life Cycle**: Authentication relies on robust client-side/session tokens. Ensure that you manually log out after concluding your tasks to avoid unauthorised access.
- **Log Out**: Within the `Admin Dashboard`, click the **Log Out** button to terminate the session immediately.

## 3. User Management Procedures
*Future Iteration Note*: Currently, the system uses a shared administrative password. In upcoming versions, Role-Based Access Control (RBAC) and explicit user management procedures will be provisioned.

## 4. Audit Log Access and Interpretation
The system automatically logs all critical actions performed by the administrator to ensure accountability and traceability.

### 4.1 Viewing Logs
Once inside the `Admin Dashboard`, navigate to the **Activity Audit Log** section.
The logs display a chronological list of events.

### 4.2 Interpreting Log Entries
Each log entry contains the following data points:
- **Timestamp**: The exact time of the event (e.g., `2026-05-12T08:00:00Z`).
- **Action**: The technical operation performed (e.g., `ADMIN_LOGIN`, `THEME_TOGGLE`, `PHASE_TOGGLE`).
- **Target/Resource**: The entity affected by the action.
- **Status**: The outcome of the action (success or failure).

## 5. Common Troubleshooting Steps

### 5.1 Login Failures
- **Issue**: "Invalid password" error.
- **Resolution**: Ensure Caps Lock is disabled. Verify with the Lead Developer that the environmental password configuration has not been altered in the latest deployment.

### 5.2 Missing Logs
- **Issue**: Audit logs appear empty or reset.
- **Resolution**: Since logs are currently stored in `localStorage` for the client, clearing your browser cache or switching devices will present a fresh log interface.

### 5.3 Diagnostic Tools Unresponsive
- **Issue**: Playwright Runner or DocViewer fails to load content.
- **Resolution**: Force refresh the application (`Ctrl+F5` or `Cmd+Shift+R`). If issues persist, check the browser console for JavaScript exceptions and escalate to the engineering team.
