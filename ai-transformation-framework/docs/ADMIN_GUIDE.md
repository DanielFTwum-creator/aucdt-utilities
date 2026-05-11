# Admin Guide

## 1. Accessing the Admin Panel
- Navigate to `/admin/login`.
- Default credentials:
  - Password: `admin` (Note: This is for demonstration purposes only. In production, use a secure authentication system.)

## 2. Dashboard Overview
The Admin Dashboard provides access to several monitoring tools:

### 2.1 Diagnostics
- **Purpose:** View system environment variables and operational status.
- **Key Metrics:** `NODE_ENV`, `REACT_VERSION`, Build Time.

### 2.2 Database Monitor
- **Purpose:** Monitor database connection status and pool usage.
- **Note:** Currently simulated as there is no backend database.

### 2.3 Test Suite
- **Purpose:** View results of automated tests.
- **Action:** Run `npm run test:e2e` locally to execute the Playwright suite.

### 2.4 System Logs
- **Purpose:** View application logs (info, warnings, errors).
- **Note:** Currently displays simulated logs.

### 2.5 Performance Metrics
- **Purpose:** Monitor Core Web Vitals (FCP, LCP, CLS).
- **Note:** Currently displays simulated metrics.

## 3. Security
- The admin routes are protected by a simple client-side authentication check (`localStorage`).
- Ensure `isAdmin` flag is cleared upon logout (not implemented in UI, clear browser data to reset).
