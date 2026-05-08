# SashMade Administrator Guide

**Version:** 2.0
**Date:** 2026-04-14
**Required React Version:** 19.2.5

## 1. Introduction
This guide provides instructions for administrators to manage the SashMade e-commerce platform. The Admin Console is a secure, password-protected area for monitoring system health, managing inventory, and viewing audit logs.

## 2. Accessing the Admin Console
1. Navigate to `/admin/login`.
2. Enter your credentials:
   - **Username:** `admin`
   - **Password:** `sashmade2026`
3. Upon successful login, you will be redirected to the Dashboard.

> **Security note:** Change the password before any public deployment by updating `src/pages/admin/AdminLogin.tsx` line 19.

## 3. Dashboard Overview
The Dashboard (`/admin/dashboard`) provides a high-level view of platform performance:
- **Total Sales:** Cumulative revenue from all orders.
- **Active Users:** Current session count.
- **System Health:** Overall status (Healthy / Degraded).
- **Weekly Sales Chart:** Revenue trend for the last 6 weeks (Recharts bar chart).

## 4. Inventory Manager
Navigate to `/admin/inventory` to:
- View all products with live price and stock status.
- Edit prices inline and toggle stock availability.
- Download full inventory as an `.xlsx` file (ExcelJS).
- Changes persist to `localStorage` and are reflected on the Shop page immediately.

## 5. System Diagnostics
Navigate to `/admin/diagnostics` to view:
- **Service Status:** Health checks for Gemini AI API, Hubtel Gateway, PostgreSQL, and Redis.
- **Latency:** Current system response time.
- **Uptime:** System uptime percentage.

## 6. Testing Framework
Navigate to `/admin/testing` to run the automated E2E suite:
1. Click **"Run All Tests"** to execute all 5 Playwright specs sequentially.
2. Click **"Rerun"** on any individual test card to re-execute just that spec.
3. Real-time logs appear in the terminal pane below each test card.
4. If a test fails, a failure screenshot is captured and displayed for debugging.

**Test specs (Playwright / Chromium):**

| ID | Name | File |
|---|---|---|
| E2E-01 | Homepage Load & Navigation | `homepage.test.ts` |
| E2E-02 | Shop / Collections | `shop.test.ts` |
| E2E-03 | About Page Content | `about.test.ts` |
| E2E-04 | AI Studio Tabs | `ai-studio.test.ts` |
| E2E-05 | Admin Console Auth & Inventory | `admin.test.ts` |

Run from the terminal: `pnpm test:e2e`

## 7. Audit Logs
Navigate to `/admin/audit` to view security events stored in `localStorage`:
- **Login Events:** Successful and failed login attempts (with timestamp and IP).
- **Logout Events:** User session terminations.
- **System Actions:** Critical changes (inventory edits, etc.).

## 8. Troubleshooting
- **Login Issues:** Verify credentials. Check the browser console for errors.
- **Test Failures:** Review logs and screenshots in the Testing tab. Common causes: network latency, API key not set, dev server not running.
- **Inventory not saving:** Confirm `localStorage` is not blocked (private/incognito mode).
