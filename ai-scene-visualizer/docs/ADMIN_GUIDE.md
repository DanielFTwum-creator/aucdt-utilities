# AI Scene Visualizer - Admin Guide

This guide provides instructions for accessing and using the Admin Panel.

## 1. Accessing the Admin Panel

The Admin Panel is a separate interface for managing and testing the application.

- **URL**: Navigate to `/admin.html` relative to the application's root URL.
- **Password**: The default password is `gemini-admin-2024`.

You will be prompted to enter the password to gain access.

## 2. Admin Dashboard Features

Once authenticated, you will have access to the following tools:

### 2.1. Testing Tools

#### System Self-Test
- **Description**: This tool runs a series of quick checks to ensure basic browser features and application data structures are functioning correctly.
- **Usage**: Click the "Run Test" button.
- **Checks Performed**:
    - **localStorage**: Verifies that the browser's `localStorage` is accessible and writable.
    - **User Data**: Checks if any user data exists, which is normal for a new deployment.
- **Results**: Test results will be displayed directly below the button, with success, warning, or error messages.

#### Clear User Cache
- **Description**: This tool completely removes all user accounts and their saved creations from the browser's `localStorage`. This is a destructive action and cannot be undone.
- **Usage**: Click the "Clear Cache" button. A confirmation prompt will appear before any data is deleted.
- **Use Case**: Useful for resetting the application to a clean state during testing or development without affecting the admin session.

### 2.2. Audit Log

- **Description**: The Audit Log records key actions performed within the Admin Panel for security and debugging purposes.
- **Usage**: The log displays recent events automatically. Click the "Refresh Logs" button to manually update the view.
- **Logged Actions**:
    - Successful admin logins
    - Failed admin login attempts
    - Admin logouts
    - Clearing of user cache
- **Persistence**: Logs are stored in `localStorage` and are persisted across sessions.

## 3. Logging Out

To securely end your session, click the "Logout" button in the header. This will clear your admin authentication status and return you to the login screen.
