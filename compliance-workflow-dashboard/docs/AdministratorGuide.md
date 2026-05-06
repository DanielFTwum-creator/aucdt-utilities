# Administrator Guide
## for the Compliance Workflow Dashboard

### Version 1.0

---

### 1. Introduction

This guide provides instructions for using the secure Admin Section of the Compliance Workflow Dashboard. The Admin Section is designed for managing application-level settings and viewing audit trails of important actions.

Access to this section is protected by a password to prevent unauthorized changes.

### 2. Accessing the Admin Panel

1.  Locate the **Lock icon** in the header section of the dashboard, typically at the top right corner.
2.  Click the Lock icon to open the Admin Section modal dialog.

![Lock Icon Location](https://i.imgur.com/placeholder.png "Image showing lock icon location -- placeholder")

### 3. First-Time Setup: Creating a Password

If you are accessing the Admin Section for the first time on a new browser or after clearing your browser's data, you will be prompted to create a password.

1.  After clicking the Lock icon, the "Create Admin Password" dialog will appear.
2.  Enter a secure password into the input field.
    -   **Requirement:** The password must be at least **8 characters** long.
3.  Click the **"Set Password"** button.
4.  Upon successful creation, you will be automatically authenticated and taken to the main admin view. An audit log entry, "Admin password set," will be created.

**Important:** This password is for this browser only. It is stored as a secure hash in your browser's local storage. For security, the application **never** stores the plaintext password.

### 4. Logging In

On subsequent visits, you will be prompted to log in.

1.  After clicking the Lock icon, the "Admin Login" dialog will appear.
2.  Enter the password you created.
3.  Click the **"Login"** button.
    -   If the password is correct, you will be granted access. An audit log entry, "Admin logged in," will be created.
    -   If the password is incorrect, an error message will be displayed. An audit log entry, "Failed login attempt," will be created.

### 5. Admin Panel Features

Once authenticated, you have access to the following features:

#### 5.1. Change Password

You can change the admin password at any time.

1.  In the "Change Password" section, enter your new password in the "New Password" field.
2.  Re-enter the same password in the "Confirm New Password" field to ensure accuracy.
3.  Click the **"Update Password"** button.
4.  If the passwords match and meet the length requirement, a success message will appear, and the password will be updated. An audit log entry, "Admin password changed," will be created.

#### 5.2. View Audit Log

The Audit Log provides a chronological record of all significant actions performed within the Admin Section.

-   The log is displayed in a read-only view, with the most recent events at the top.
-   Each entry includes a timestamp and a description of the action.

Actions that are logged include:
-   Admin password set
-   Admin logged in
-   Failed login attempt
-   Admin logged out
-   Admin password changed
-   Audit logs cleared

#### 5.3. Clear Logs

You can clear the audit log history.

1.  Click the **"Clear Logs"** button located at the top right of the audit log section.
2.  A confirmation dialog will appear. Click "OK" to proceed.
3.  All log entries will be deleted, except for a new entry stating, "Audit logs cleared." This ensures that the act of clearing the logs is itself recorded.

#### 5.4. Logout

To securely exit the Admin Section:

1.  Click the **"Logout"** button at the top of the panel.
2.  You will be de-authenticated, and the Admin Section will close.
3.  An audit log entry, "Admin logged out," will be created.
