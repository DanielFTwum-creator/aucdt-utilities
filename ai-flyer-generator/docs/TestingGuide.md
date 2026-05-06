# AI Flyer Generator - Testing Guide

## 1. Introduction

This guide details the testing procedures for the AI Flyer Generator application. It covers both the in-app interactive testing tools and the external end-to-end (E2E) test suite.

## 2. Interactive Testing (In-App)

The "Testing" tab within the application provides tools for quick diagnostics and validation.

### 2.1. System Self-Test

This test performs a basic check of the application's runtime environment.

**How to Run:**
1.  Navigate to the **"Testing"** tab.
2.  Click the **"Run Self-Test"** button.
3.  Observe the status message that appears.

**Expected Outcomes:**
-   **`✅ All self-tests passed. (API key is present)`:** This indicates that the `API_KEY` environment variable has been correctly configured and is accessible to the application. This is the desired outcome.
-   **`❌ Self-test failed: API_KEY is not configured.`:** This indicates a critical configuration error. The application will not be able to generate images. To fix this, review the `DeploymentGuide.md` and ensure the environment variable is set correctly in your hosting environment.

### 2.2. Screenshot Capture

This feature allows you to capture a high-quality PNG image of the generated flyer.

**How to Use:**
1.  First, navigate to the **"Generator"** tab and generate a flyer.
2.  Once the flyer is visible on the screen, navigate to the **"Testing"** tab.
3.  Click the **"Capture Flyer Screenshot"** button.
4.  Your browser will automatically download a file named `flyer-screenshot.png`.

**Note:** If you attempt to capture a screenshot before a flyer has been generated, you will receive an alert message.

## 3. End-to-End (E2E) Testing with Playwright

A Playwright test suite is provided to automate browser-based testing of the application's core user flow.

### 3.1. Prerequisites

-   [Node.js](https://nodejs.org/) installed on your machine.
-   The application must be running locally (e.g., on `http://localhost:3000`).
-   A valid `API_KEY` must be configured for the local environment.

### 3.2. Setup

1.  Open your terminal in the project's root directory.
2.  Install the required dependency (Playwright):
    ```bash
    npm install playwright
    ```

### 3.3. Running the Test

1.  Ensure your local development server is running.
2.  From the project's root directory, run the test script:
    ```bash
    node tests/flyer-generator.test.js
    ```
3.  The script will launch a headless Chromium browser, perform a series of actions, and log the results to the console.

### 3.4. Test Script Overview (`tests/flyer-generator.test.js`)

The test script performs the following actions:
1.  Launches a new browser instance.
2.  Navigates to the application URL.
3.  Verifies that the initial page loads correctly by checking the main heading.
4.  Clicks the "Generate Flyer" button.
5.  Waits for up to 30 seconds for the flyer image to appear.
6.  If generation is successful, it confirms the image `src` is a valid data URL and saves a screenshot to `test-results/successful-generation.png`.
7.  If generation fails, it logs an error and saves a screenshot to `test-results/failed-generation.png`.
8.  It tests the theme switcher by clicking the "Dark" mode button and verifying the correct class is applied to the document. A screenshot is saved to `test-results/dark-mode.png`.

All test artifacts (screenshots) are saved in the `test-results/` directory, which is created automatically if it doesn't exist.