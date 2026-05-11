# MarkAI Testing Guide

This document provides instructions for testing the MarkAI application using both the interactive in-app testing dashboard and the automated end-to-end (E2E) test suite.

## 1. Interactive Testing Dashboard

The application includes a built-in testing dashboard for quick sanity checks and visual validation.

### 1.1 Accessing the Dashboard

1.  Navigate to the MarkAI application in your browser.
2.  In the main header navigation, click on the **"Testing"** button, identifiable by a test tube icon.

### 1.2 Available Tests

The dashboard contains several test cards that can be run on demand.

-   **API Key Check:**
    -   **Purpose:** Verifies that the Google Gemini API key is correctly configured as an environment variable for the backend server.
    -   **Action:** Click the "Run Test" button.
    -   **Success:** Displays a "pass" message indicating the key is present.
    -   **Failure:** Displays a "fail" message if the `API_KEY` environment variable is missing or empty on the server.

-   **Local Storage Access:**
    -   **Purpose:** Confirms that the browser's local storage is working correctly, which is essential for persisting scheduled posts, logs, and user settings.
    -   **Action:** Click the "Run Test" button.
    -   **Success:** Displays a "pass" message if data can be successfully written, read, and deleted.
    -   **Failure:** Displays a "fail" message if the browser restricts local storage access or if there is a data mismatch.

-   **E2E Workflow Simulation:**
    -   **Purpose:** Runs an interactive, in-browser simulation of the full user journey from content creation to scheduling. This mirrors the automated Puppeteer test.
    -   **Action:** Click the "Run Test" button.
    -   **Result:** The application will automatically navigate through the steps, and a floating panel at the bottom of the screen will display real-time logs and capture screenshots at key stages of the process.

-   **Capture Screenshot:**
    -   **Purpose:** Takes a full-page screenshot of the current application state for visual regression testing.
    -   **Action:** Click the "Run Test" button.
    -   **Result:** A preview of the screenshot will appear on the page, along with a "Download Image" button to save the `.png` file locally.

## 2. End-to-End (E2E) Test Suite

The project includes an automated E2E test suite using Puppeteer that simulates a complete user workflow.

### 2.1 Prerequisites

-   Node.js and npm must be installed on your machine.
-   You have cloned or downloaded the project files.

### 2.2 Setup and Execution

1.  **Install Dependencies:**
    -   Open a terminal in the root directory of the project.
    -   Run `npm install`. This will download Puppeteer and the Chromium browser it requires.

2.  **Start the Application Servers:**
    -   The test suite requires both the frontend and backend servers to be running.
    -   **Terminal 1 (Backend):** Start the backend server by running:
        ```bash
        npm run start:server
        ```
    -   **Terminal 2 (Frontend):** Start the frontend server, which must run on `http://localhost:5173`.
        ```bash
        # We recommend using the 'serve' package
        npx serve -l 5173
        ```

3.  **Run the Test:**
    -   While both local servers are running, open a **new (third) terminal** in the project's root directory.
    -   Execute the test script by running:
        ```bash
        npm run test:e2e
        ```
    -   A new Chromium browser window will open and automatically perform the following steps:
        1.  Navigate to the Generator view and create new AI content.
        2.  Schedule the first piece of generated content.
        3.  Navigate to the Calendar view.
        4.  Verify that the scheduled post appears on the calendar.
    -   The test progress and final result (pass or fail) will be logged in your terminal. If the test fails, a screenshot named `test-failure-screenshot.png` will be saved to the project root for debugging.
