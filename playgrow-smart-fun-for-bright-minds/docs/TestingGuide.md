# PlayGrow - Testing Guide

This document provides instructions for testing the PlayGrow application using both its integrated automated testing framework and manual testing procedures.

---

## 1. Automated Testing

The application includes a "Playwright Self-Test" dashboard that simulates critical user journeys and provides real-time feedback without requiring any external tools.

### 1.1 Accessing the Self-Test Dashboard

1.  Navigate to the **Admin Dashboard** (see the Administrator Guide for access instructions).
2.  Click the **"Run Self-Tests"** button, located in the header.

### 1.2 Running the Test Suite

1.  On the "Playwright Self-Test" dashboard, click the large green **"Run Full Test Suite"** button.
2.  The button will become disabled, and the tests will begin executing sequentially.

### 1.3 Interpreting Results

The dashboard provides three panels for monitoring the test run:

-   **Test Suites:** This panel lists all available test suites. Next to each title is a status indicator:
    -   **Gray:** Pending (not yet run).
    -   **Pulsing Blue:** Running.
    -   **Green Check (✓):** Passed.
    -   **Red Cross (✗):** Failed.
-   **Live Log:** This panel displays a real-time log of the exact step the test runner is currently executing. A progress bar at the top shows the overall completion percentage.
-   **Screenshot Viewer:** This panel shows a visual representation (a mock screenshot in SVG format) of the application's UI at each step of the test, helping you visualize the user journey.

---

## 2. Manual Testing Checklist

Manual testing is crucial for verifying user experience and accessibility nuances. Use the following checklist to ensure core functionalities are working as expected.

### ✅ General Functionality

| Test Case                 | Steps                                                                      | Expected Result                                       | Status      |
| ------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | ----------- |
| **Zone Navigation**       | 1. On World Map, click each of the 7 zones. 2. Use the back button.        | Navigates to the correct Zone Detail page and back.   | `[ ] Pass` |
| **Theme Switching**       | 1. Click the theme switcher. 2. Cycle through Light, Dark, & High-Contrast. | The UI correctly applies the styles for each theme.   | `[ ] Pass` |
| **Mini-Game Interaction** | 1. Go to a Zone Detail page. 2. Click on a mini-game card.                | A console log indicates the game is "starting".       | `[ ] Pass` |

### ✅ Admin Section

| Test Case                    | Steps                                                              | Expected Result                                                           | Status      |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------- |
| **Admin Login (Failure)**    | 1. Go to Admin Login. 2. Enter an incorrect password.              | An error message appears, and access is denied.                           | `[ ] Pass` |
| **Admin Login (Success)**    | 1. Go to Admin Login. 2. Enter `playgrow_admin`.                   | Successfully navigates to the Admin Dashboard.                            | `[ ] Pass` |
| **Admin Logout**             | 1. From the Admin Dashboard, click "Logout".                       | Returns to the World Map; admin session is terminated.                    | `[ ] Pass` |
| **Audit Logging**            | 1. On Admin Dashboard, click a "System Controls" button.           | A new log entry appears in the "Audit Log" panel.                         | `[ ] Pass` |
| **Self-Test Navigation**     | 1. On Admin Dashboard, click "Run Self-Tests". 2. Click back button. | Navigates to the test dashboard and successfully returns to the admin page. | `[ ] Pass` |

### ✅ Accessibility

| Test Case                  | Steps                                                                     | Expected Result                                                         | Status      |
| -------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------- |
| **Keyboard Navigation**    | 1. Use the `Tab` key to navigate through all buttons and interactive cards. | All interactive elements are focusable in a logical order.              | `[ ] Pass` |
| **Focus Indicators**       | 1. As you `Tab` through elements.                                         | A clear, visible ring appears around the currently focused element.     | `[ ] Pass` |
| **Keyboard Activation**    | 1. Focus on a zone or button. 2. Press `Enter` or `Space`.                | The element's action (e.g., navigation) is triggered.                   | `[ ] Pass` |
