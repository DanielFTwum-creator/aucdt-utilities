# Administrator Guide
**Techbridge Media Club Platform**

## 1. Introduction
This guide is intended for the System Administrator. It covers access to the protected Admin Panel, monitoring system health via audit logs, and running diagnostics.

## 2. Accessing the Admin Panel

The Admin Panel is a restricted area of the application.

1.  Navigate to the application URL.
2.  Click the **Admin Portal** button at the bottom of the sidebar navigation.
3.  You will be presented with a login challenge.

### Credentials
*   **Password:** `admin123`

> **Note:** Failed login attempts are logged in the Audit Trail.

## 3. Features

### 3.1 Overview Dashboard
Once authenticated, the Overview tab provides a high-level snapshot of the system:
*   **System Status:** Indicates general health (uptime, latency).
*   **Security Audit:** Shows recent security scan results.
*   **Database:** Status of the connection to the data layer.
*   **Live Audit Logs:** A real-time scrolling log of all actions taken within the system (e.g., page navigation, uploads, theme toggles).

### 3.2 Diagnostics
The Diagnostics tab displays technical details about the running environment:
*   **Frontend Stack:** Verifies React version (19.2.4) and Tailwind CSS status.
*   **Service Status:** Shows the status of internal singleton services (Auth, Audit, WebSocket).

### 3.3 Testing Suite
The Testing tab allows the administrator to verify system integrity:

*   **Live User Journey:**
    *   Click **Start Test** to initiate an automated script that takes control of the UI.
    *   The script will physically click navigation buttons and verify that the correct pages load.
    *   Watch the "Test Execution Log" for `PASS`/`FAIL` results.

*   **Playwright Suite:**
    *   Provides a downloadable Node.js script for running headless E2E tests externally.
    *   Use the **Copy Script** button to copy the code to your clipboard.

*   **Quick Health Check:**
    *   Runs instantaneous DOM checks to ensure critical React roots and contexts are mounted.

## 4. Troubleshooting

**Issue:** "Root element missing" in Health Check.
**Resolution:** Ensure `index.html` contains `<div id="root"></div>`.

**Issue:** Audit Logs are empty.
**Resolution:** Interact with the application (navigate tabs, toggle theme) to generate events. The log is in-memory and clears on page refresh.
