# Administrator Guide

## 1. Introduction
This guide provides instructions for managing the Countdown Timer application via the Admin Dashboard.

## 2. Accessing the Admin Dashboard
1. Navigate to the `/admin` route of the application.
2. Enter the administrator password: `admin123`.
3. Click "Login".

## 3. Dashboard Features
The Admin Dashboard provides access to several key features:

### 3.1 Theme Settings
Administrators can change the application's visual theme.
- **Light Theme:** A bright, high-contrast theme suitable for well-lit environments.
- **Dark Theme:** A darker theme suitable for low-light environments (default).
- **High-Contrast Theme:** A specialized theme designed for maximum visibility, featuring yellow text and borders on a black background.

### 3.2 System Diagnostics
The dashboard displays real-time system information:
- **React Version:** Confirms the application is running React 19.2.4.
- **User Agent:** Displays browser and operating system details.
- **Screen Resolution:** Shows the current viewport dimensions.
- **Current Theme:** Indicates the active visual theme.
- **System Time:** Displays the current local time.

### 3.3 Audit Logs
The application maintains a log of administrative actions (e.g., logins, logouts, theme changes, test executions).
- The logs are displayed in a table with timestamps and action descriptions.
- Click "Clear Logs" to permanently delete the audit history.

### 3.4 Automated Testing Suite (Playwright Self-Test)
The application includes a built-in testing framework.
1. Click the "Playwright Self-Test" tab.
2. Click "Run Playwright Tests" to execute the test suite.
3. The system will launch a headless browser, navigate through critical user journeys, and capture screenshots.
4. Results, including pass/fail status and screenshots, will be displayed in the UI.

## 4. Security Notes
- The admin session is stored in `sessionStorage` and will expire when the browser tab is closed.
- Audit logs are stored in `localStorage` and persist across sessions until manually cleared.
