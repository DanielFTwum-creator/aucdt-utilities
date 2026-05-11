# PlayGrow - Administrator Guide

This guide provides instructions for accessing and using the administrative features of the PlayGrow application.

---

## 1. Accessing the Admin Dashboard

The Admin Dashboard is a secure area for managing and testing the application.

1.  **Navigate to the World Map:** Open the application to the main home screen (the World Map).
2.  **Locate the Admin Icon:** In the top-left corner of the screen, you will find a **lock icon (🔒)**.
3.  **Click the Icon:** Click the lock icon to be taken to the Admin Login page.

## 2. Authentication

Access to the dashboard is password-protected to prevent unauthorized entry.

-   **Password:** `playgrow_admin`

Enter this password into the input field and click the "Authenticate" button to proceed. If you enter an incorrect password, an error message will be displayed.

## 3. Dashboard Features

Once authenticated, you will have access to the Admin Dashboard, which is split into two main sections.

### 3.1 System Controls

This panel contains buttons for performing high-level administrative actions. These are currently mock actions for demonstration purposes.

-   **Reset All Progress:** Simulates resetting all user data.
-   **Push Content Update:** Simulates deploying a new content package to the app.
-   **Trigger System Backup:** Simulates a manual backup of application data.
-   **Flush Cache:** Simulates clearing the application's content cache.

### 3.2 Audit Log

Every action performed in the "System Controls" panel is logged here for auditing purposes. Each log entry includes:
-   A precise timestamp (in ISO format).
-   A description of the action performed.

This log provides a clear, real-time trail of all administrative activities. Logs are also sent to the browser's developer console.

## 4. Running Self-Tests

The dashboard provides access to an integrated, automated testing framework that simulates user journeys.

1.  **Navigate to the Test Dashboard:** Click the **"Run Self-Tests"** button at the top of the Admin Dashboard.
2.  **Run the Suite:** On the "Playwright Self-Test" screen, click the **"Run Full Test Suite"** button to begin.
3.  **Monitor Results:** You can monitor the progress in real-time via the "Test Suites" status panel, the "Live Log," and the "Screenshot Viewer."

## 5. Logging Out

To securely exit the admin session:

1.  Click the **"Logout"** button in the top-right corner of the Admin Dashboard.
2.  You will be returned to the main World Map, and your administrative session will be terminated.