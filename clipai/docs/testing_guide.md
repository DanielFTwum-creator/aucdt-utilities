# ClipAI - Testing Guide

This document explains how to use the built-in self-testing panel in the ClipAI application to verify core functionalities.

## 1. Accessing the Testing Panel

The testing panel is located within the administrative section of the application.

1.  Navigate to the main ClipAI application.
2.  Click the "Admin" link in the footer.
3.  Log in using the administrative password.
4.  From the Admin Panel, click the **"Go to Testing"** button.

## 2. The Testing Panel Interface

The panel consists of three main parts:

-   **Controls:** Buttons to run and reset the tests.
-   **Test List:** A list of all available automated tests.
-   **Results Display:** Each test case shows its status, description, messages, and a visual screenshot of the canvas state.

## 3. Running Tests

1.  Click the **"Run All Tests"** button to start the automated test suite.
2.  The tests will execute sequentially. You can observe the status of each test in real-time.

### Understanding Test Statuses

-   **Running:** A spinner icon indicates the test is currently in progress.
-   **Pass:** A green checkmark indicates the test completed successfully and all its assertions passed.
-   **Fail:** A red 'X' icon indicates that an assertion failed during the test. The error message will provide more details.
-   **Skipped:** A yellow 'S' indicates the test was skipped, typically due to a missing prerequisite (e.g., the `API_KEY` is not set for the AI generation test).

## 4. Interpreting Results

For each test, the following information is provided:

-   **Test Name:** A short, descriptive name (e.g., "Image Upload and Display").
-   **Description:** A sentence explaining what the test verifies.
-   **Status & Duration:** The final pass/fail/skipped status and how long the test took to run in seconds.
-   **Message:** A success message or a detailed error message explaining the reason for failure.
-   **Screenshot:** A small image capture of the application's canvas at the end of the test run. This is extremely useful for visually verifying the UI state and debugging failures.

## 5. Resetting Tests

-   Click the **"Reset"** button to clear all test results and return the panel to its initial state, ready for another test run.