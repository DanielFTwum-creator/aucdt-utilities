# Administrator Guide

## Accessing the Admin Panel
1. Navigate to `/admin` in the browser.
2. Enter the secure password (default: `admin123`).
3. Upon successful login, you will be redirected to the Dashboard.

## Features

### Dashboard
- **Diagnostics:** View real-time system health, environment variables, and audit logs.
- **Testing Suite:** Run automated synthetic tests to verify application integrity.

### Diagnostics
- **System Info:** Displays browser and environment details.
- **Audit Logs:** Tracks critical actions like submissions and login attempts.
  - Logs are stored locally in the browser.
  - Click "Clear Logs" to reset the history.

### Testing Suite
- **Run All Tests:** Executes a predefined set of tests:
  - LocalStorage availability
  - API connectivity
  - DOM integrity
- **Screenshots:** Captures a visual snapshot of the application state during testing.

## Troubleshooting
- **Login Issues:** Ensure `sessionStorage` is enabled in your browser.
- **API Errors:** Check the Network tab in DevTools if submissions fail.
