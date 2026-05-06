# CreoAI - Testing Guide

## 1. Introduction

This guide details the testing procedures for the CreoAI application. It covers both the in-app interactive testing tools and the external end-to-end (E2E) test suite.

## 2. Interactive Testing (In-App)

The "Testing" tab within the application provides tools for quick diagnostics and validation.

### 2.1. System Self-Test

This test performs a basic check of the application's runtime environment.

**How to Run:**
1.  Navigate to the **"Testing"** tab.
2.  Click the **"Run Self-Test"** button.
3.  Observe the status message that appears.

**Expected Outcomes:**
-   **`Pass: API Key is configured.`:** This indicates that the `API_KEY` environment variable has been correctly configured and is accessible to the application. This is the desired outcome.
-   **`Fail: API Key not found.`:** This indicates a critical configuration error. The application will not be able to generate images. To fix this, review the `DeploymentGuide.md` and ensure the environment variable is set correctly in your hosting environment.

### 2.2. Screenshot Capture

This feature allows you to capture a high-quality PNG image of the generated flyer.

**How to Use:**
1.  First, navigate to the **"Generator"** tab and successfully generate a flyer.
2.  Once the flyer is visible on the screen, navigate to the **"Testing"** tab.
3.  Click the **"Capture Flyer Screenshot"** button. The button will be enabled only if a flyer is present.
4.  Your browser will automatically download a file named `flyer-complete.png`.

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
3.  The script will launch a headless Chromium browser, perform a series of actions, and log the results to the console. All test artifacts (screenshots, downloads) are saved in the `test-results/` directory.

### 3.4. Test Script Overview (`tests/flyer-generator.test.js`)

The test script performs the following automated actions:
1.  Launches a browser and navigates to the application.
2.  Verifies the initial page loads correctly.
3.  Cycles through all three themes (Light, Dark, High-Contrast).
4.  Navigates to the Admin tab, logs in, and verifies successful access.
5.  Navigates to the Testing tab and runs the self-test, verifying a "Pass" result.
6.  Navigates back to the Generator, initiates AI image generation.
7.  Waits for the image cropper, confirms the crop, and waits for the final flyer to render.
8.  Switches back to the Testing tab and triggers the "Capture Flyer Screenshot" action.
9.  Waits for and confirms that the `flyer-complete.png` file was successfully downloaded.