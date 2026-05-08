# Testing Guide - TalentVerify

**Version:** 1.0
**Date:** 2026-03-01

## 1. Introduction
TalentVerify includes a comprehensive automated testing suite designed to ensure system stability and verify critical user journeys. The testing framework is built using **Playwright** and is integrated directly into the application.

## 2. Testing Framework
- **Tool**: Playwright (Headless Chrome Node.js API).
- **Integration**: Server-side execution via Express API.
- **Frontend**: Interactive runner at `/admin/testing`.
- **React Version**: Validates compatibility with **React 19.2.5**.

## 3. Test Coverage
The current test suite covers the following scenarios:

### 3.1 Public Interface
- **Login Page Load**: Verifies the application renders the landing page.
- **Role Selection**: Checks for the presence of "Recruiter" and "Candidate" entry points.
- **UI Snapshot**: Captures a screenshot of the initial state.

### 3.2 Administrative Functions
- **Admin Access**: Simulates clicking the "System Admin Access" button.
- **Authentication**: Automates password entry (`admin123`) and submission.
- **Dashboard Redirection**: Verifies successful login redirects to `/admin/diagnostics`.
- **Navigation**: Tests routing between Admin Dashboard and Audit Logs.

## 4. Running Tests

### 4.1 Via Admin UI (Recommended)
1. Log in as an Administrator.
2. Navigate to **Testing Suite** (`/admin/testing`).
3. Click **"Run Test Suite"**.
4. Wait for execution (approx. 5-10 seconds).
5. Review the results card:
   - **Green Check**: Test Passed.
   - **Red X**: Test Failed (with error message).
   - **Screenshot**: Click to view the visual state at the time of the test.

### 4.2 Via API (Headless/CI)
You can trigger tests programmatically by sending a POST request:
```http
POST /api/admin/run-tests
Content-Type: application/json
```
**Response:**
```json
{
  "results": [
    {
      "name": "Load Login Page",
      "status": "pass",
      "screenshot": "base64_string..."
    },
    ...
  ]
}
```

## 5. Interpreting Results

### Pass
- The feature is functional and accessible.
- Visual layout matches expectations (verify via screenshot).

### Fail
- **Network Error**: The server or database might be slow/unreachable.
- **Selector Error**: UI elements changed, breaking the test script (e.g., button text changed).
- **Timeout**: The page took too long to load.

## 6. Maintenance
- **Test Script Location**: `src/services/testRunner.ts`.
- **Modifying Tests**: When changing UI text or IDs, update the corresponding Playwright selectors in `testRunner.ts`.
- **Adding Tests**: Follow the existing pattern in `runSystemTests()` to add new `try/catch` blocks for additional scenarios.
