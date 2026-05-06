# Administrator Guide - AUCDT Website

**Version: 1.0**

## 1. Introduction

This guide provides instructions for accessing and using the administrative functions of the AsanSka University College of Design & Technology (AUCDT) website. The admin panel provides access to theme controls, a self-testing suite, and security functions.

## 2. Accessing the Admin Section

The admin section is secured and can only be accessed via the login modal.

1.  Navigate to the website homepage.
2.  Scroll down to the footer at the bottom of the page.
3.  Click the **"Admin Login"** button.
4.  A login modal will appear, overlaying the page content.

## 3. Logging In

To gain access to the dashboard, you must provide the correct administrative password.

1.  In the login modal, locate the "Password" input field.
2.  Enter the administrator password. The default password is `password123`.
3.  Click the **"Sign In"** button.
4.  If the password is correct, you will be redirected to the Admin Dashboard.
5.  If the password is incorrect, an "Invalid password" error message will be displayed.

*Security Note: This is a client-side application. The password is hardcoded and should be changed to a more secure value stored as an environment variable in a real-world production environment.*

## 4. Using the Admin Dashboard

The Admin Dashboard is a tabbed interface providing access to different administrative functions.

### 4.1 Overview Tab

This is the default view after logging in. It provides a welcome message and access to the global Theme Switcher.

*   **Theme Control:** Use the dropdown menu to select a theme for the entire website. The available options are:
    *   **Light:** The default theme.
    *   **Dark:** A darker theme for low-light environments.
    *   **High Contrast:** A WCAG-compliant theme for users with visual impairments.
*   The selected theme is automatically saved and will persist on your browser for future visits.

### 4.2 Playwright Self-Test Tab

This tab contains an interactive dashboard for running a suite of simulated end-to-end tests. See the **Testing Guide** for more details on this feature.

## 5. Viewing Audit Logs

For security and monitoring, all critical administrative actions are logged to the browser's developer console.

1.  Open your browser's developer tools (usually by pressing `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`).
2.  Navigate to the **"Console"** tab.
3.  Perform an admin action, such as logging in or out.
4.  A new message will appear in the console, prefixed with `[AUDIT LOG]`, followed by a timestamp and a description of the action.
    *   Example: `[AUDIT LOG] 2024-10-27T12:00:00.000Z: Admin successfully logged in.`

## 6. Logging Out

To securely end your session, always use the logout button.

1.  From anywhere within the Admin Dashboard, locate the **"Log Out"** button in the top-right corner of the header.
2.  Click the button.
3.  You will be immediately logged out and returned to the public-facing homepage. An audit log entry will be created for this action.
