# Administrator Guide - TalentVerify

**Version:** 1.0
**Date:** 2026-03-01

## 1. Introduction
This guide provides instructions for System Administrators to manage the TalentVerify platform. The system is built on **React 19.2.4** and utilizes a secure, role-based architecture.

## 2. Accessing the Admin Console

### 2.1 Login
To access the administrative features:
1. Navigate to the `/login` page.
2. Click the **"System Admin Access"** button.
3. Enter the administrator password.
   - **Default Password:** `admin123`
4. Click **Authenticate**.

### 2.2 Dashboard Overview
Upon successful login, you will be redirected to `/admin/diagnostics`. The admin dashboard provides access to:
- **System Diagnostics**: Real-time health checks.
- **Audit Logs**: Security and activity monitoring.
- **Testing Suite**: Automated system verification.

## 3. System Diagnostics
Located at `/admin/diagnostics`, this page displays:
- **Server Status**: Uptime and memory usage.
- **Database Health**: Connection status and entity counts (Users, Candidates, Applications).
- **Environment**: Node version and active configuration.

## 4. Audit Logging
Located at `/admin/logs`, the audit log viewer provides an immutable record of critical system actions.
- **Logged Actions**: Login events, settings changes, data modification.
- **Features**:
  - Filter by User, Action, or Details.
  - Real-time refresh.
  - Server-side persistence in the `audit_logs` table.

## 5. Automated Testing
Located at `/admin/testing`, the integrated Playwright testing suite allows you to verify system integrity.
- **Running Tests**: Click the **"Run Test Suite"** button.
- **Scope**:
  - Public Login Page availability.
  - Role Selection UI.
  - Admin Authentication flow.
  - Admin Navigation.
- **Results**:
  - **Pass/Fail** status for each test.
  - **Screenshots** captured automatically for visual verification.

## 6. Security Best Practices
- **Password Management**: The default password `admin123` is hashed using SHA-256. For production, ensure the seed in `src/db/index.ts` is updated with a strong password hash.
- **Access Control**: Only authorized personnel should possess the admin password.
- **Monitoring**: Regularly review Audit Logs for suspicious activity.

## 7. Troubleshooting
- **Login Failure**: Ensure you are using the correct password. Check the browser console for network errors.
- **Test Failures**: Review the error message and screenshot in the Testing Suite. Common causes include network latency or database locks.
- **Database Issues**: Check the Diagnostics page. If the database is unreachable, verify the `talentverify.db` file permissions.
