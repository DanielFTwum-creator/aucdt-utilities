# Admin Guide - Groove Streamer v3.0.0

## 1. Introduction
This guide provides instructions for administrators managing the Groove Streamer application.

## 2. Accessing the Admin Dashboard
The admin dashboard is located at `/admin`. Access is protected by a password.
- **Configuration**: Set the `ADMIN_PASSWORD` environment variable in your project settings.

## 3. Features
### 3.1 Audit Logging
All administrative actions (login attempts, test execution) are logged to the server console for security and traceability.

### 3.2 Test Dashboard
- **Run E2E Tests**: Triggers the automated Playwright test suite.
- **Screenshots**: Automatically captures a screenshot of the application state upon test completion.

## 4. Best Practices for Security
- **Password Management**: Keep the admin password secure and rotate it periodically.
- **Monitoring**: Regularly monitor the server console for audit logs to detect any unauthorized login attempts.
- **Environment Variables**: Ensure `ADMIN_PASSWORD` is never exposed in client-side code.

## 5. Troubleshooting
- **Login Issues**: If you cannot log in, verify that the `ADMIN_PASSWORD` environment variable is correctly set in your project configuration.
- **Test Failures**: If E2E tests fail, check the server console for detailed error logs.
