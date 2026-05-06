# Test Guide

## 1. Overview
The application includes an End-to-End (E2E) test suite using Playwright to verify critical functionality.

## 2. Running Tests
To run the tests locally:

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```bash
   npm run test:e2e
   ```

## 3. Test Scenarios
The suite covers the following scenarios:

- **Home Page Load:** Verifies the application loads without errors.
- **Hero Title Verification:** Checks if the correct title is displayed.
- **Chapter Navigation:** Verifies that chapter links exist.
- **Admin Login:** Tests the login flow and redirection to the dashboard.

## 4. Screenshots
Screenshots of the test runs are saved in the `tests/screenshots` directory.

## 5. Troubleshooting
- If tests fail, ensure the dev server is running on `http://localhost:3000`.
- Check console output for specific error messages.
