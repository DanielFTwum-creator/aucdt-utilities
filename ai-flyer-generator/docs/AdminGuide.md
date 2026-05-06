# AI Flyer Generator - Administrator's Guide

## 1. Introduction

This guide provides instructions for accessing and using the administrative features of the AI Flyer Generator application. The admin panel is designed for monitoring application activity and performing basic administrative tasks.

## 2. Accessing the Admin Panel

1.  Navigate to the main application URL.
2.  In the header, click on the **"Admin"** tab.
3.  You will be presented with a login screen.
4.  Enter the administrator password into the password field.

    -   **Default Password:** `password123`

5.  Click the "Sign In" button.

Upon successful authentication, you will be redirected to the Admin Panel.

## 3. Admin Panel Features

The Admin Panel provides a centralized view of key application information and actions.

### 3.1. Welcome Section

The top-right of the panel displays a welcome message with the current user's name (e.g., "Welcome, admin!"). It also contains the **Logout** button. Clicking this button will immediately end your session and return you to the login screen.

### 3.2. Actions

This section contains buttons for performing administrative tasks.

-   **Clear Cache (Simulated):** This is a demonstrative action. In a real-world application, this could be used to clear server-side caches or perform other maintenance tasks. Clicking it will log the action in the Audit Log and display a confirmation alert.

### 3.3. Audit Log

The Audit Log is a critical feature for monitoring application usage. It displays a real-time, reverse-chronological list of significant events that occur within the application.

Each log entry contains the following information:

-   **Timestamp:** The date and time the event occurred.
-   **User:** The user who performed the action. This will be "admin" for actions performed in the panel, "System" for automated actions, or potentially other usernames if the application is expanded.
-   **Action:** A description of the event that occurred.

**Examples of Logged Actions:**

-   `Admin login successful.`
-   `Flyer generation started.`
-   `Flyer generation failed: The provided API Key is invalid.`
-   `Admin triggered "Clear Cache".`
-   `Admin logged out.`

The log is scrollable, allowing you to review the history of actions performed during the current application session. **Note:** The log is stored in-memory and will reset if the browser page is refreshed.

## 4. Security Considerations

-   The default password `password123` is for demonstration purposes only. In a production environment, this must be changed to a strong, unique password and managed through a secure configuration system (e.g., environment variables, a secrets manager).
-   The current authentication system is client-side. For a production application, authentication should be handled by a secure backend service.