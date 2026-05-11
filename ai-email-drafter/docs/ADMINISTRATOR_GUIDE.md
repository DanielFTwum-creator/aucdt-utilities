# Administrator Guide: AI Email Drafter

**Version 1.0**

## 1. Introduction

This guide provides comprehensive instructions for administrators to configure, manage, and secure the AI Email Drafter application. It covers security settings, audit log management, and theme configuration.

It is critical that only authorized personnel have access to the administrative functions to maintain the security and integrity of the application.

---

## 2. Accessing the Admin Panel

The Admin Panel is a secure section of the application where all administrative tasks are performed.

**To access the Admin Panel:**

1.  Launch the AI Email Drafter application.
2.  Navigate to the `Tools` > `Administrator Settings` menu item.
3.  Alternatively, use the keyboard shortcut `Ctrl+Alt+A`.
4.  You will be prompted to enter the administrator password.

Upon successful authentication, the Admin Panel will be displayed.

---

## 3. Security Configuration

### 3.1 Setting the Initial Password

On the first launch of the application, or if no administrator password is set, you will be prompted to create one. Choose a strong, unique password and store it in a secure location.

### 3.2 Changing the Password

1.  Access the Admin Panel.
2.  Navigate to the **Security** tab.
3.  Click on the "Change Password" button.
4.  Enter the current password, then enter and confirm the new password.
5.  Click "Save" to apply the changes.

---

## 4. Viewing Audit Logs

The application maintains a comprehensive audit log of all critical administrative actions to ensure accountability and assist in security investigations.

**Actions that are logged:**

*   Successful and failed login attempts to the Admin Panel.
*   Administrator password changes.
*   Changes to application-wide settings (e.g., theme enforcement).
*   Exporting or clearing of audit logs.

**To view the audit logs:**

1.  Access the Admin Panel.
2.  Navigate to the **Audit Log** tab.
3.  The log table will display the following information for each event:
    *   **Timestamp**: The date and time the event occurred.
    *   **Action**: A description of the action performed (e.g., "Admin Login Failed").
    *   **Details**: Additional context, such as the setting that was changed.
4.  You can use the search bar to filter logs by action or date.
5.  The "Export Log" button allows you to save the current log view as a CSV file for external analysis.

---

## 5. Theme Management

Administrators can control the available themes for end-users.

**To manage themes:**

1.  Access the Admin Panel.
2.  Navigate to the **Appearance** tab.
3.  You will see toggles for the following themes:
    *   Light Theme
    *   Dark Theme
    *   High-Contrast Accessibility Mode
4.  You can disable a theme to prevent users from selecting it.
5.  You can also enforce a default theme for all users, which will override their personal preference.

---

## 6. Troubleshooting

**Issue: Forgotten Administrator Password**
*   **Solution**: For security reasons, there is no password recovery mechanism. The application's configuration files must be manually reset. Please refer to the `RESET_ADMIN_PASSWORD.md` guide for platform-specific instructions. This action will require file system access to the machine where the application is installed.

**Issue: Unable to Access Admin Panel**
*   **Solution**: Ensure you are on a version of the application that has admin features enabled. Verify you are using the correct keyboard shortcut or menu path. Check the application logs for any related error messages.