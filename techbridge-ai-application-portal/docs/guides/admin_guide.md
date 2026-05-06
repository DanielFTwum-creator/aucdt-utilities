# Techbridge AI Portal - Administrator Guide

**Version 3.0**

## 1. Introduction

This guide provides administrators with all necessary information to manage and maintain the Techbridge AI Application Portal. It covers accessing the admin section, understanding its features, and performing routine checks.

## 2. Accessing the Admin Section

1.  Navigate to the main portal URL.
2.  In the top-right corner of the header, click the "Admin" link.
3.  You will be presented with a secure login modal.

## 3. Admin Authentication

-   **Password:** The default password is `Techbridge_Admin_2024!`.
-   **IMPORTANT:** This password is hardcoded in the application's source code (`App.tsx`). For security, it is **highly recommended** to change this value before deploying the application to a live environment.
-   **Login/Logout:** A successful login grants access to the full-page Admin Dashboard. All login attempts are recorded in the Audit Log. To exit the admin area, click the "Logout" button on the dashboard.

## 4. Admin Dashboard Features

The Admin Dashboard is organized into two main tabs: "Audit Log" and "Playwright Self-Test".

### 4.1. Audit Log Tab

This tab provides a chronological, reverse-sorted list of important administrative actions performed within the application.

-   **Purpose:** To monitor security and administrative activity.
-   **Logged Actions Include:**
    -   Admin access attempts.
    -   Successful and failed admin logins.
    -   Admin logouts.
    -   Initiation and completion of the self-test suite.
-   **Reading Logs:** Each entry includes a precise timestamp and a description of the event. The log persists between sessions.

### 4.2. Playwright Self-Test Tab

This tab contains an in-browser automated testing suite that simulates user actions to verify the portal's core functionality.

-   **Purpose:** To quickly verify that the application is working correctly after any changes or to perform routine health checks.
-   **How to Run Tests:**
    1.  Click the "Playwright Self-Test" tab.
    2.  Click the "Run Playwright Tests" button. A spinner inside the button will indicate that tests are in progress.
    3.  Test results will appear in real-time.
-   **Interpreting Results:**
    -   **PASS:** The test completed successfully.
    -   **FAIL:** The test encountered an error. The result will display an error message and a full-page screenshot of the application at the exact moment of failure for easy debugging.