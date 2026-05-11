# Testing Guide

## Overview
GlucoSentinel includes a comprehensive testing suite covering unit, integration, and end-to-end (E2E) tests.

## Running Tests
### Unit & Integration Tests
Run the following command to execute unit and integration tests:
```bash
npm test
```

### E2E Tests (Playwright)
E2E tests require a running instance of the application.
1.  Start the application:
    ```bash
    npm run dev
    ```
2.  Run the E2E test script:
    ```bash
    node tests/e2e.test.js
    ```
3.  Screenshots will be saved in `tests/screenshots/`.

## Test Coverage
-   **Unit Tests**: Components, utilities, and helpers.
-   **Integration Tests**: API endpoints and database interactions.
-   **E2E Tests**: Critical user flows (Login, Dashboard, Admin).
