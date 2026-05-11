# TechBridge Dashboard - Administrator Guide

## 1. Introduction
This guide provides instructions for accessing and managing the administrative functions of the TechBridge Strategic Dashboard. The Admin module is designed for securing sensitive audit logs and monitoring system integrity.

## 2. Access Control

### 2.1 Accessing the Admin Panel
1. Navigate to the dashboard URL.
2. In the Sidebar, click the **Settings** icon (labeled "Admin Settings").
3. You will be presented with a "Restricted Access" login screen.

### 2.2 Authentication
*   **Default Credentials**:
    *   Password: `admin`
*   **Note**: In a production environment, this hardcoded password must be replaced with a secure authentication provider integration (e.g., Auth0 or Firebase).

## 3. Dashboard Features

### 3.1 Security Audit Log
Once authenticated, the Admin View displays the Security Audit Log. This table tracks:
*   **Timestamp**: Exact time of the event.
*   **User**: `Admin` or `System`.
*   **Action**: Event type (e.g., `AUTH_LOGIN`, `AUTH_FAIL`, `AUTH_LOGOUT`).
*   **Details**: Contextual information about the event.

**Important**: Currently, logs are stored in *session memory*. Refreshing the browser will clear the audit history.

### 3.2 System Self-Diagnosis (Testing Module)
Admins should regularly check the **System Health** tab (Test Tube icon):
1.  Navigate to the "System Health" tab.
2.  Click **Run Diagnostics**.
3.  Observe the Console Output for `✓ PASS` or `✗ FAIL` indicators.
4.  Ensure "Data Integrity Check" passes to verify financial calculations are accurate.

## 4. Troubleshooting

### 4.1 "Invalid administration credentials"
*   Ensure Caps Lock is off.
*   Verify you are using the correct password configured in `App.tsx`.

### 4.2 Empty Audit Logs
*   If the table says "No events logged yet," it means no actions have been taken in the current browser session. Logs are ephemeral in this version.

### 4.3 Charts Not Rendering
*   If charts in other views appear empty, check the **System Health** tab and run diagnostics to verify if the rendering engine (Recharts) is loading correctly.