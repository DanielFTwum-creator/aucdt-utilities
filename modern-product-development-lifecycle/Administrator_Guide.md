# Administrator Guide
### Interactive Product Development Workbook

**Version:** 1.0

---

## 1. Introduction

This guide provides comprehensive instructions for using the Administrator Panel within the Interactive Product Development Workbook. The Admin Panel is a secure area designed for application management, data handling, and system diagnostics.

## 2. Accessing the Admin Panel

1.  Navigate to the main application page.
2.  In the bottom-left corner of the sidebar, locate and click the **"Admin"** button next to the cog icon (`<Cog6ToothIcon />`).
3.  A modal window will overlay the application, prompting you for authentication.

## 3. Authentication

The Admin Panel is protected by a password to prevent unauthorized access to sensitive actions.

-   **Password:** For the current version of the application, the password is hardcoded as: `admin_password_123`
-   **Login:** Enter the password into the input field and click the "Login" button.
-   **Session:** A successful login creates a session that remains active until you click "Logout" or close the browser tab. The session is stored in `sessionStorage`, not `localStorage`, for enhanced security.

If you enter an incorrect password, an error message will be displayed.

## 4. Admin Panel Features

The Admin Panel is organized into two main tabs: **Actions & Logs** and **Self-Test**.

### 4.1 Actions & Logs Tab

This tab provides tools for data management and tracks all administrative activities.

#### 4.1.1 Actions

-   **Export Data**:
    -   **Function:** Clicking this button compiles all current project data (`projectName` and `projectProgress`) from `localStorage` into a single JSON file.
    -   **Usage:** This is useful for creating backups of a user's work or for migrating data.
    -   **Result:** The browser will initiate a download of a file named `pdl-export-[timestamp].json`.

-   **Clear All Data**:
    -   **Function:** This button permanently removes the `projectName` and `projectProgress` keys from the browser's `localStorage`.
    -   **Usage:** Use this to reset the application to its default state for a new project.
    -   **⚠️ Warning:** This action is irreversible. A confirmation dialog will be displayed to prevent accidental data loss.

#### 4.1.2 Audit Log

-   **Purpose:** The Audit Log provides a chronological record of all actions performed within the Admin Panel. This is essential for tracking administrative changes.
-   **Logged Actions Include:**
    -   Admin panel accessed
    -   Admin logged out
    -   Cleared all project data
    -   Exported project data
    -   Started/Finished self-test suite
-   **Details:** Each log entry includes a precise timestamp and a description of the action. The log is stored in `localStorage` and is capped at the most recent 100 entries.

### 4.2 Self-Test Tab

This tab contains an integrated, simulated testing framework to verify the application's core functionalities.

#### 4.2.1 Running the Test Suite

-   Click the **"Run Test Suite"** button to begin.
-   The system will execute a series of simulated end-to-end tests based on the Playwright testing framework.
-   The button will be disabled while the tests are in progress.

#### 4.2.2 Interpreting Results

-   **Real-time Updates:** The test results are displayed in a list and update in real-time as each test completes.
-   **Status Indicators:**
    -   `Clock Icon (Pending)`: The test has not yet been run.
    -   `Spinning Info Icon (Running)`: The test is currently in progress.
    -   `Green Checkmark (Pass)`: The test completed successfully.
    -   `Red X (Fail)`: The test encountered an error.
-   **Failure Details:**
    -   If a test fails, a descriptive error message will be shown.
    -   A **"View Screenshot"** button will appear. Clicking this will open a modal displaying a simulated screenshot of the application state at the moment of failure, providing valuable context for debugging.

## 5. Logging Out

To securely exit the Admin Panel, click the **"Logout"** button in the bottom-right corner of the panel. This will clear your authentication session and close the modal.
