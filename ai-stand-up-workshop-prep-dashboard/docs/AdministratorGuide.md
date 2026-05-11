# Administrator Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This guide provides instructions for administrators on how to access and use the administrative features of the AI Stand-up & Workshop Prep Dashboard. The primary administrative function is to review an audit log of key user actions within the application.

### 2. Accessing the Admin Panel

The administrative section is a protected area of the application.

1.  **Navigate to the Admin Tab:** Open the application in your web browser. In the main navigation bar at the top of the page, click on the **"Admin"** tab.
2.  **View the Login Form:** You will be presented with a secure login form. Access to the rest of the application is still available by clicking other tabs, but the admin features will remain locked.

### 3. Authentication

#### 3.1 Logging In

To gain access to the admin panel, you must authenticate with the correct password.

1.  **Enter Password:** In the provided password field, enter the administrator password.
    -   **Default Password:** `admin123`
2.  **Submit:** Click the "Login" button.

-   **On Success:** If the password is correct, the login form will be replaced by the Admin Panel, which displays the Audit Log. A "Login successful" message will be added to the log.
-   **On Failure:** If the password is incorrect, an "Invalid password" error message will appear below the input field. The input field will be cleared, and a "Login failed" message will be recorded in the audit log.

#### 3.2 Logging Out

For security, always log out of the admin panel when you are finished.

1.  **Click Logout:** In the top right corner of the Admin Panel, click the **"Logout"** button.
2.  **Confirmation:** You will be immediately logged out and returned to the Admin login screen. The application will also automatically navigate you back to the "Overview" tab. A "Logged out" event will be recorded in the audit log.

### 4. Using the Admin Panel

The main feature of the Admin Panel is the Audit Log.

#### 4.1 Understanding the Audit Log

The Audit Log provides a chronological record of important events that occur within the application. This is useful for monitoring user activity and troubleshooting.

-   **Layout:** The log is displayed in a table with two columns:
    -   **Timestamp:** The precise date and time the event occurred, displayed in your local timezone.
    -   **Action:** A human-readable description of the event.

-   **Tracked Actions:** The following actions are currently recorded in the audit log:
    -   `Admin login successful.`
    -   `Admin login failed.`
    -   `Admin logged out.`
    -   `Theme changed to [light/dark/high-contrast].`

-   **Scrolling:** If the log contains more entries than can fit in the view, a scrollbar will appear to allow you to review older events. The newest events always appear at the top.

### 5. Security Considerations

-   **Hardcoded Password:** In this version of the application, the administrator password (`admin123`) is hardcoded directly into the source code. For any production or security-sensitive environment, this is a major vulnerability.
-   **Recommendation:** For a real-world deployment, authentication should be handled by a secure, server-side system with encrypted password storage and user management. The current implementation is for demonstration purposes only.
