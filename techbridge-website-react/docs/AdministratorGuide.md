# Administrator Guide
## AUCDT Website Replica System

### 1. Accessing the Admin Dashboard

The Admin Dashboard is a secure area for managing system settings and viewing audit logs.

1.  Navigate to the website footer.
2.  Click the **Admin** link (Shield icon) located in the bottom right corner.
3.  **Default Credentials**:
    *   Password: `admin123`

### 2. Dashboard Overview

Upon successful login, you will see the Dashboard Overview tab.

#### Security Settings
*   **Current Password**: Enter the password you used to log in.
*   **New Password**: Enter a new secure password (minimum 6 characters).
*   Click **Update Password** to save changes.
    *   *Note: This password is stored locally in your browser. Clearing browser data will reset it to default.*

#### System Status
Displays the current version of the application and the total number of recorded audit logs.

#### Audit Logs
A chronological table of all sensitive actions taken within the system.
*   **Timestamp**: When the event occurred.
*   **Action**: Type of event (e.g., `LOGIN_SUCCESS`, `PASSWORD_CHANGE`).
*   **Details**: Additional context.
*   **Clear Logs**: Use the button in the top right of the table to wipe the log history.

### 3. System Self-Test

The **System Self-Test** tab allows administrators to verify the health of the frontend application without external tools.

1.  Click the **System Self-Test** tab in the top navigation bar of the dashboard.
2.  Click **Run Live Test Suite**.
3.  The application will return to the Homepage overlay and perform the following checks:
    *   **DOM Integrity**: Checks for Header, Main, and Footer existence.
    *   **Theme System**: Cycles through Light, Dark, and High Contrast modes.
    *   **Navigation**: Verifies menu links are present.
    *   **Virtual Agent**: Opens the chat widget and checks input availability.
    *   **Accessibility**: Checks for the "Skip to main content" link.
4.  Once complete, click **Return to Admin** to view the results.

### 4. Troubleshooting

**I forgot my admin password.**
Since the application relies on LocalStorage:
1.  Open your browser's Developer Tools (F12).
2.  Go to the **Application** tab -> **Local Storage**.
3.  Delete the key `aucdt_admin_pass`.
4.  Refresh the page. The password will reset to `admin123`.

**The logs are empty.**
Logs are stored locally. If you access the site from a different browser or device, you will not see logs generated on another device.
