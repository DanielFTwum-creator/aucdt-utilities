# Testing Guide - EduData Ghana

## 1. Overview
This project employs a two-tiered testing strategy:
1. **Internal Self-Diagnostics:** Runs within the application admin panel for quick health checks.
2. **External E2E Testing:** Uses Playwright to simulate user interactions and verify critical flows in a headless browser environment.

## 2. Internal Self-Diagnostics (Manual)
The "System Health" tab in the Admin Panel allows administrators to verify the application state without technical tools.

### How to Run:
1. Log in to the Admin Panel.
2. Click the **"System Health"** tab.
3. Click **"Run Diagnostic Suite"**.

### Test Coverage:
- **Context Integrity:** Checks if Auth, Data, and Theme contexts are initialized.
- **Data Availability:** Verifies that fee arrays (Undergraduate, International) are not empty.
- **Theme System:** Simulates a theme switch and verifies the state update.
- **Admin Session:** Verifies the current session is marked as authenticated.

## 3. Automated E2E Testing (Playwright)
We use Playwright to perform End-to-End testing. This suite launches a headless Chrome instance and interacts with the app like a real user.

### Prerequisites:
- Node.js installed.
- Dependencies installed (`npm install playwright`).

### Test Suite File:
- Location: `tests/e2e.js`

### Scenarios Covered:
1. **Homepage Render:** Verifies the page loads and title is correct.
2. **Tab Navigation:** Clicks "International Students" and verifies chart data updates.
3. **Theme Toggling:** Clicks "Dark Mode" and checks for CSS class application.
4. **Admin Login:** Navigates to Admin, enters password, and verifies Dashboard load.

### How to Run:
1. Ensure the application is running locally (usually on port 3000):
   ```bash
   npm start
   ```
2. In a new terminal window, run the test script:
   ```bash
   node tests/e2e.js
   ```

### Interpreting Results:
- **Pass:** console will log `[PASS] Test Name`.
- **Fail:** Console will log `[FAIL] Test Name` with an error message.
- **Screenshots:** The test script captures screenshots of critical states (e.g., `screenshot_home.png`, `screenshot_admin.png`) in the root directory for visual debugging.

## 4. Reporting Issues
If a test fails:
1. Check the console output for specific error messages.
2. Review the generated screenshots to see the UI state at the time of failure.
3. Verify that the application is running on the expected port (`http://localhost:3000`).

---
*Generated for EduData Ghana v1.1 - Phase 4*