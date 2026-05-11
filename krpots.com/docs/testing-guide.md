# TechBridge University College - Testing Guide

## Overview
The Retrospective Archive application includes a robust testing framework designed to ensure the reliability of core user flows, accessibility standards, and administrative security.

## Testing Architecture
- **Framework**: Jest + Playwright
- **Scope**: End-to-End (E2E) UI Testing
- **Location**: `/tests/e2e.test.js`

## Test Suites

### 1. Navigation Routing & Links
Verifies that the React Router correctly navigates between the Home page and the Collection archive, ensuring critical content is rendered.

### 2. Theme Switching
Validates the AppContext state management by logging into the Admin portal and toggling between Light, Dark, and High-Contrast themes, verifying the HTML class updates.

### 3. Admin Authentication Flow
Tests the security of the `/admin` route. It verifies that unauthenticated users are prompted for a password, invalid passwords show an error, and valid passwords grant access to the Dashboard.

### 4. Collection Filtering
Ensures that the interactive filters on the Collection page correctly update the UI state and ARIA attributes (`aria-pressed`).

## Running Tests Locally

### Prerequisites
Ensure the development server is running on port 3000:
```bash
npm run dev
```

### Execution
Run the test suite using npm:
```bash
npm test
```

## Admin Test Dashboard
For non-technical stakeholders, the application includes an interactive Test Dashboard within the Admin Portal (`/#/admin/testing`).
- This dashboard simulates the execution of the Playwright suite.
- It provides a visual readout of test status, duration, and overall pass rate.
- **Note**: In the current prototype, this dashboard provides a simulated visual representation of the tests defined in `/tests/e2e.test.js`.
