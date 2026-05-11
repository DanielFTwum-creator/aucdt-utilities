# TechBridge Dashboard - Testing Guide

## 1. Testing Strategy
The dashboard employs a dual-layer testing strategy:
1.  **Internal Self-Diagnostics**: Built into the frontend for real-time health checks.
2.  **Automated E2E Testing**: Playwright scripts for critical path validation in a CI/CD pipeline.

## 2. Internal Self-Diagnostics (Manual)

### 2.1 Overview
The application includes a "System Health" module that runs unit tests against the financial logic and verifies component rendering. This module is secured within the Admin interface.

### 2.2 Execution Steps
1.  Open the Dashboard.
2.  Click the **Admin Settings** tab (Gear icon) in the sidebar.
3.  Authenticate using the admin password (default: `admin`).
4.  Select the **System Health** tab (Test Tube icon) within the Admin panel.
5.  Click the blue **Run Diagnostics** button.

### 2.3 Interpreting Results
*   **Data Integrity Check**: Verifies that budget items sum to the Total Investment (1.746M GHS) and that the Break-even logic (Year 2) holds true.
*   **Critical Path Journey**: Simulates the availability of the Admin module and Charting library.
*   **Success**: All suites show a Green Checkmark.
*   **Failure**: A Red X indicates a logic error or a broken dependency.

## 3. Automated E2E Testing (Playwright)

### 3.1 Prerequisites
*   Node.js installed.
*   Chrome installed (Playwright downloads a local version).

### 3.2 Setup
1.  Install dependencies:
    ```bash
    npm install playwright
    ```

### 3.3 Running the Suite
Execute the core journey test script:
```bash
node tests/playwright/core-journey.js
```

### 3.4 Test Coverage
The `core-journey.js` script validates:
1.  **Initial Load**: Checks page title and HTTP status.
2.  **Metric Rendering**: Ensures "Current Enrollment" and other key cards are visible.
3.  **Navigation**: Simulates clicks to "Strategic Plan" and verifies Pie Chart rendering.
4.  **Admin Security**:
    *   Navigates to Admin Settings.
    *   Injects credentials.
    *   Verifies successful login state.
5.  **Theme Toggle**: Toggles Dark Mode and verifies class injection on the `<html>` tag.

### 3.5 Test Reports
*   **Console Output**: Real-time logs of test steps.
*   **Screenshots**: Generated in `tests/playwright/reports/screenshots/`:
    *   `1-dashboard-load.png`
    *   `2-strategy-view.png`
    *   `3-admin-dashboard.png`
    *   `4-dark-mode.png`
    *   `FAILURE-trace.png` (if an error occurs).

## 4. Accessibility Testing
To verify WCAG 2.1 compliance:
1.  Enable **High Contrast Mode** in the sidebar (Contrast Icon).
2.  Use a screen reader (VoiceOver/NVDA) to navigate.
3.  Ensure all buttons have `aria-label` or descriptive text (implemented in `Sidebar.tsx` and `AdminView.tsx`).
