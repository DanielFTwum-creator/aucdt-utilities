# Testing Guide

## Puppeteer E2E Automation
This project implements a fully headless E2E testing framework utilizing **Puppeteer**.

### Running Tests Locally
To execute the tests from your terminal:
```bash
node scripts/run-tests.js
```
*Note: The application must be running locally on port 3000 before executing the script.*

### Admin Dashboard Execution
Tests can be simulated via the UI:
1. Log in to the Admin Portal (`/login`).
2. Navigate to the **Testing** tab (`/admin/testing`).
3. Click **Run Tests**.
4. A live execution report will appear detailing test status and screenshot capture metadata.

### Screenshot Captures
The Puppeteer suite captures visual states for layout regression testing.
- Output directory: `/dist/screenshots/`
- Key captures:
  - `01-main-app.png`: Verifies the builder UI and WebGL video context load correctly.
  - `02-login-page.png`: Verifies the TUC branded security gateway.

### Extending the Suite
To add new tests, modify the `runTests()` function within `scripts/run-tests.js`. Ensure you capture screenshots for any new interactive flows and push the status objects to the `results` array.
