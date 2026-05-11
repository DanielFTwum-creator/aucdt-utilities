# Testing Guide
## for AI Stand-up & Workshop Prep Dashboard

### Version 1.0

---

### 1. Introduction

This document outlines the testing procedures for the AI Stand-up & Workshop Prep Dashboard. It covers both the built-in automated self-testing capabilities and a checklist for essential manual tests to ensure application quality and functionality.

### 2. Automated Self-Testing Framework

The application includes an integrated self-testing panel that simulates a Playwright test suite, allowing for quick verification of critical user journeys directly within the browser.

#### 2.1 Accessing the Test Panel

1.  Open the application in your web browser.
2.  In the main navigation bar, click on the **"Playwright Self-Test"** tab.

#### 2.2 Running the Test Suite

1.  Click the **"Run Self-Test Suite"** button located in the top right of the panel.
2.  The button will become disabled and change its text to "Running..." while the tests are in progress.
3.  The test results will appear and update in real-time as the suites are executed.

#### 2.3 Interpreting the Results

The results panel provides a summary and a detailed breakdown of the test run.

-   **Test Summary:** A top-level summary shows the overall progress and the final count of passed vs. total test suites.
-   **Test Suites:** Each test suite is displayed in a collapsible accordion panel.
    -   **Status Icon:**
        -   `✔` (Green Check): The entire suite passed successfully.
        -   `✖` (Red X): The suite failed because one of its steps failed.
        -   `●` (Spinning Circle): The suite is currently running.
    -   **Title:** Describes the user journey being tested (e.g., "User Journey: Theme Switching").
-   **Test Steps:** Expanding a suite reveals the individual steps.
    -   **Status Icon:**
        -   `✔` (Green Check): The step's assertion passed.
        -   `✖` (Red X): The step's assertion failed.
        -   `●` (Spinning Circle): The step is currently running.
        -   `○` (Empty Circle): The step is pending execution.
    -   **Log:** A descriptive message provides context for the result.
        -   **On Pass:** `✅ OK - Screenshot: [Description] completed.` (The log simulates a screenshot capture upon success).
        -   **On Fail:** `❌ FAIL - [Error message]`.

### 3. Manual Testing Checklist

Manual testing should be performed to catch issues that automated tests might miss, especially related to visual presentation and usability.

#### TC-1: Theme Switching
| Step | Action                                             | Expected Result                                                                                               |
| :--- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| 1.1  | Click the **"Dark"** theme button in the header.       | The application smoothly transitions to a dark color scheme. All text, backgrounds, and components are legible. |
| 1.2  | Click the **"Contrast"** theme button.                 | The application transitions to a high-contrast (black and white with bright accents) theme.                   |
| 1.3  | Click the **"Light"** theme button.                    | The application returns to the default light theme.                                                           |
| 1.4  | Refresh the page after selecting a theme.          | The selected theme (e.g., Dark) should persist after the refresh.                                             |

#### TC-2: Tab Navigation & Content
| Step | Action                                             | Expected Result                                                                   |
| :--- | :------------------------------------------------- | :-------------------------------------------------------------------------------- |
| 2.1  | Click the **"Team Status"** tab.                     | The "Team Status & Blockers" content is displayed. The tab is visually highlighted. |
| 2.2  | In the Team Status view, click on "Mandela".       | The content updates to show Mandela's status. The "Mandela" button is highlighted.  |
| 2.3  | Click the **"AI Workshop"** tab.                     | The "AI Workshop Deep Dive" content is displayed.                                 |
| 2.4  | On the Workshop tab, change a value in a dropdown. | The "Generated Prompt" text block updates instantly to reflect the change.        |
| 2.5  | Click the **"Tech Concepts"** tab.                   | The "Technical Concepts" content is displayed.                                    |
| 2.6  | On the Concepts tab, click a concept title.        | The details for that concept expand. Clicking again collapses it.                 |

#### TC-3: Admin Authentication
| Step | Action                                                               | Expected Result                                                                      |
| :--- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| 3.1  | Navigate to the **"Admin"** tab.                                     | The admin login form is displayed.                                                   |
| 3.2  | Enter an incorrect password (e.g., "password") and click "Login".    | An "Invalid password" error message appears. The input field is cleared.             |
| 3.3  | Enter the correct password (`admin123`) and click "Login".           | The Admin Panel with the Audit Log table is displayed.                               |
| 3.4  | While logged in, switch to another theme.                          | The Audit Log should show a new entry: "Theme changed to [new theme]".               |
| 3.5  | Click the **"Logout"** button.                                       | You are returned to the login screen. The app navigates to the "Overview" tab.       |
| 3.6  | Log back in and check the Audit Log.                                 | The log should contain entries for the failed login, successful login, and logout.   |
