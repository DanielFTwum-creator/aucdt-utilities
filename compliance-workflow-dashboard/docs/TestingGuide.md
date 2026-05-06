# Testing Guide
## for the Compliance Workflow Dashboard

### Version 1.0

---

### 1. Introduction

The Compliance Workflow Dashboard includes a unique and powerful built-in testing framework. This framework leverages the Gemini AI to generate and simulate a Playwright test suite on demand, directly within the application's user interface.

This guide explains how to use the "Playwright Self-Test" feature to verify the application's critical user journeys.

### 2. Accessing the Testing Panel

1.  Load the Compliance Workflow Dashboard in your browser.
2.  At the top of the main content area, you will see two tabs: "Dashboard" and "Playwright Self-Test".
3.  Click on the **"Playwright Self-Test"** tab to switch to the testing view.

### 3. Running the Test Suite

The core of the testing feature is a single button that initiates the entire process.

1.  In the Playwright Self-Test view, locate the **"Generate & Run Tests"** button.
2.  Click this button to start the test suite.

#### What Happens When You Click "Run"?

-   The application sends a carefully crafted prompt to the Gemini API.
-   This prompt instructs the AI to act as a QA engineer and generate a Playwright test suite covering the application's core features.
-   The AI then "simulates" the execution of these tests.
-   As the AI simulates each test, it streams the results back to the application in real-time.
-   The "Generate & Run Tests" button will become disabled and show a "Running Tests..." state while the process is active.

### 4. Interpreting the Test Results

The test results are displayed in a list as they are received from the AI. Each test case in the list includes:

-   **Status Icon:** A visual indicator of the test's status.
    -   **Green Checkmark:** The test passed successfully.
    -   **Red X:** The test failed.
    -   **Spinning Loader:** The test is currently running.
-   **Test Name:** A descriptive name for the test case (e.g., "Framework Switching", "Admin Panel Access").
-   **Error Message (if failed):** If a test fails, a detailed error message from the simulated test run will be displayed in a red box below the test name. This helps diagnose the issue.
-   **"View Screenshot" Button:** For each test case (both passed and failed), the AI generates a simplified, wireframe-style screenshot representing the application's state at the moment the test concluded.

### 5. Viewing Screenshots

Screenshots provide valuable visual context for understanding what happened during a test.

1.  Click the **"View Screenshot"** button next to any completed test result.
2.  A modal dialog (overlay) will appear, displaying the generated screenshot image.
3.  This allows you to visually confirm the UI state, which is especially useful for debugging failed tests or verifying the outcome of successful ones.
4.  To close the screenshot viewer, click the "×" button in the corner or click on the dark background area outside the image.

### 6. Test Coverage

The AI-generated test suite is designed to cover the following critical user journeys:

-   Initial application load.
-   Switching between different compliance frameworks.
-   Updating the status of a compliance phase.
-   Correctness of the overall progress bar calculation.
-   Switching between light, dark, and high-contrast themes.
-   Admin Panel security (both failed and successful login attempts).
-   Functionality of the "Copy Directive" button.

This automated, on-demand testing provides a quick and powerful way to perform regression testing and ensure the core functionality of the dashboard remains stable.
