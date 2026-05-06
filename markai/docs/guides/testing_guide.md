  # MarkAI Testing Guide
  
  This document provides instructions for testing the MarkAI application using both the interactive in-app testing dashboard and the automated end-to-end (E2E) test suite.
  
  ## 1. Interactive Testing Dashboard
  
  The application includes a built-in testing dashboard for quick sanity checks and visual validation.
  
  ### 1.1 Accessing the Dashboard
  
  1.  Navigate to the MarkAI application in your browser.
  2.  Click on the **"Admin"** button in the header and log in.
  3.  Access the Testing Dashboard via the **"Go to Testing Dashboard"** link or navigate directly to `/admin/testing`.
  
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
      -   **Purpose:** Runs an interactive, in-browser simulation of the full user journey (Authentication -> Content creation -> Scheduling). This mirrors the automated Playwright test.
      -   **Action:** Click the "Run Test" button.
      -   **Result:** The application will automatically navigate through the steps, and a floating panel at the bottom of the screen will display real-time logs and capture screenshots at key stages of the process.
  
  -   **Capture Screenshot:**
      -   **Purpose:** Takes a full-page screenshot of the current application state for visual regression testing.
      -   **Action:** Click the "Run Test" button.
      -   **Result:** A preview of the screenshot will appear on the page, along with a "Download Image" button to save the `.png` file locally.
  
  ## 2. End-to-End (E2E) Test Suite
  
  The project includes an automated E2E test suite using Playwright that simulates a complete user workflow including authentication and scheduling.
  
  ### 2.1 Prerequisites
  
  -   Node.js and npm must be installed on your machine.
  -   You have cloned or downloaded the project files.
  
  ### 2.2 Setup and Execution
  
  1.  **Install Dependencies:**
      -   Open a terminal in the root directory of the project.
      -   Run `npm install`. This will download Playwright and the browser binaries it requires.
  
  2.  **Start the Application:**
      -   The test suite needs a running instance of the application to test against.
      -   **Terminal 1:** Serve the application's root directory. The server MUST run on `http://localhost:3000`.
      -   **Terminal 2:** Start the backend server by running `npm run start:server` (also on port 3000).
  
  3.  **Run the Test:**
      -   While the local servers are running, open a **new** terminal in the project's root directory.
      -   Execute the test script by running:
          ```bash
          npm run test:e2e
          ```
      -   A new browser window will open and automatically perform the following steps:
          1.  Test invalid login handling (verifies error messages).
          2.  Test invalid registration (verifies 'Passwords do not match' error).
          3.  Register and authenticate a new user.
          4.  Test explicit logout and successful login flows.
          5.  Generate new AI content.
          6.  Schedule the first piece of generated content.
          7.  Navigate to the calendar.
          8.  Verify that the scheduled post appears on the calendar.
      -   The test progress and final result (pass or fail) will be logged in your terminal. If the test fails, a screenshot named `test-failure-screenshot.png` will be saved for debugging.
