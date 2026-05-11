# Testing Guide

## Overview
The testing framework for the Fraud Detection Engine is split into two complementary paradigms: **Internal Diagnostics** (Backend validation) and **E2E Automation** (Frontend Playwright tests). Both can be triggered and reviewed directly via the Admin Console (`/#/admin/testing`).

## 1. Internal Diagnostics (Backend)
These tests execute directly within the Node.js context and validate the integrity of the data layer and memory heap.

- **Trigger:** Click "Run Diagnostics" in the Admin Testing panel, or send a `POST /api/v1/admin/run-diagnostics` request.
- **Coverage:**
  1. Database Connectivity (SQLite status)
  2. Entity Table Integrity (Row counts)
  3. Metrics Write Test (I/O validation)
  4. Health Score Computation
  5. Audit Log Write (Permissions test)
  6. Memory Usage (Heap < 512MB threshold)
  7. API Endpoints Availability (Express routing check)
  8. Sentinel Integration

## 2. Playwright E2E Automation (Frontend)
These tests spin up a headless Chromium browser to evaluate the React DOM exactly as a user experiences it.

### Test Suites
Located in `/tests/*.spec.ts`:
- **`dashboard.spec.ts`**: Validates the presence of metric cards and sidebar navigation to Entities and Health pages.
- **`admin.spec.ts`**: Ensures the `/login` route functions correctly and blocks unauthenticated access to the Admin Dashboard.
- **`theme.spec.ts`**: Cycles the `<html class="dark | high-contrast">` utility via the UI button and ensures DOM states are correctly applied.
- **`alerts.spec.ts`**: Simulates the acknowledgment flow of system alerts.

### Running E2E Tests Locally
If you wish to bypass the GUI and run tests in your terminal:
```bash
# Ensure dev server is running on port 3000
pnpm run dev

# Run Playwright tests
npx playwright test

# View HTML report
npx playwright show-report
```

### CI/CD Integration
Playwright tests are configured to fail on `process.env.CI` if any `.only` blocks are left. By default, CI mode sets `workers: 1` to prevent parallel collision during SQLite reads, and retries failing tests twice.

## 3. PDF Reporting
All diagnostic runs (Backend + E2E) generate an aggregated JSON result object. The "Download PDF Report" button in the Testing UI serves this object through a format generator to satisfy institutional compliance auditing requirements.
