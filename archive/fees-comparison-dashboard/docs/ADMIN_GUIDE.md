# EduData Ghana - Administrator Guide

## 1. Introduction
This guide is intended for system administrators responsible for managing the EduData Ghana University Fees Dashboard. It covers authentication, data management, audit monitoring, and system diagnostics.

## 2. Accessing the Admin Panel
1. Navigate to the application homepage.
2. Click the **"Admin Login"** button located in the top-right corner of the header.
3. Enter the administrator password.
   - **Default Password:** `admin123`
   - *Security Note: It is mandatory to change this password immediately upon first login.*

## 3. Security Management
### Changing the Password
1. Log in to the Admin Dashboard.
2. Navigate to the **"Security"** tab.
3. Enter your new password in the input field.
4. Click **"Update Password"**.
5. A confirmation alert will appear. The new password is effective immediately for the current session.
   - *Note: Since this is a client-side demo, password changes persist only for the duration of the session/reload unless a backend is connected.*

## 4. Managing Data
The application allows real-time updates to fee structures without redeployment.

1. Navigate to the **"Manage Data"** tab.
2. Select the category you wish to edit (Currently defaults to 'Undergraduate').
3. Locate the institution/program you wish to modify.
4. Update the **Fees** input field with the new numeric value.
5. Changes are reflected immediately on the public dashboard.
6. **Audit Trail:** Every data change is automatically logged with a timestamp and the old/new values.

## 5. System Monitoring (Audit Logs)
To view the history of actions taken within the system:

1. Navigate to the **"Audit Logs"** tab.
2. The table displays:
   - **Time:** Exact timestamp of the event.
   - **Action:** Type of event (e.g., LOGIN, DATA_UPDATE, SECURITY_UPDATE).
   - **Details:** Specifics of what changed (e.g., "Updated UG fees...").
   - **Actor:** Identity of the user (currently 'Admin').

## 6. System Diagnostics (Self-Test)
The application includes a built-in "System Health" module to verify integrity.

1. Navigate to the **"System Health"** tab (added in Phase 3).
2. Click the **"Run Diagnostic Suite"** button.
3. The system will perform:
   - **Context Integrity Check:** Verifies data providers are active.
   - **Data Availability Check:** Ensures fee arrays are populated.
   - **Theme System Check:** Verifies theme switching logic.
4. Results are displayed in real-time. If any test fails, consult the browser console for stack traces.

## 7. Troubleshooting
- **Login Fails:** Ensure Caps Lock is off. If the page was reloaded, the password resets to `admin123`.
- **Chart Not Updating:** Try switching tabs (e.g., to International and back) to force a re-render.
- **Blank Screen:** Check browser console (F12) for JavaScript errors. Ensure your browser supports React 18+.

---
*Generated for EduData Ghana v1.1 - Phase 4*