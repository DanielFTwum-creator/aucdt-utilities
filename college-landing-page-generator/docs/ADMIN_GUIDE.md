# TUC Administrator Guide

## Overview
This guide provides instructions for accessing and utilizing the `/admin` portal of the College Landing Page Generator. The Admin Portal houses diagnostic tools, testing runners, and audit logs.

## Accessing the Portal
1. Navigate to `http://localhost:3000/login`.
2. Enter the standard TUC administrator password (`admin`).
3. Upon successful authentication, you will be redirected to the Admin Dashboard.

## Dashboard Capabilities
- **System Overview**: Check current React version compliance and system uptime.
- **Audit Logs**: View recent administrative actions (e.g., logins, test executions). The logs are stored securely in `localStorage` under `tuc_audit_logs`.
- **Theme Testing**: Toggle the global accessibility theme (Light, Dark, High-Contrast) directly from the dashboard to verify contrast ratios.

## Testing Integration
Navigate to the "Testing" tab to execute the Puppeteer E2E suite.
- Clicking "Run Tests" triggers a headless browser diagnostic.
- A live report is generated displaying passed/failed assertions.
- Screenshots of the flows are captured and logged to `/dist/screenshots`.

> **Note:** Do not share the administrator password. Audit logs are immutable during the active session.
