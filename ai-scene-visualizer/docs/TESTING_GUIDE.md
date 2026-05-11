# AI Scene Visualizer - Testing Guide

This guide outlines the testing procedures for the AI Scene Visualizer application, including manual and automated tests.

## 1. Manual Testing

### 1.1. Core Functionality
- **User Authentication**:
    - Test user registration with a new username/password.
    - Test login with valid and invalid credentials.
    - Verify that user sessions persist after reloading the page.
    - Verify that creations are specific to each user account.
- **Image Generation**:
    - Test the "Generate Scene" button with various prompts (short, long, detailed).
    - Verify the loading state and overlay appear correctly.
    - Test with different resolutions.
    - Confirm that generated images appear in the "Your Creations" gallery.
- **Gallery**:
    - Test the image filters (Grayscale, Sepia, etc.).
    - Test the "Show/Hide Prompt" functionality.
    - Test the image download button.

### 1.2. Admin Panel
- Access `/admin.html` and test login with the correct and incorrect password.
- Run the "System Self-Test" and verify its output.
- Use the "Clear User Cache" function and confirm that all user data is deleted (after confirming the prompt).
- Check the Audit Log for records of your admin actions.

## 2. Automated Testing

### 2.1. System Self-Test
The Admin Panel includes a basic self-test tool that checks for fundamental browser capabilities required by the app. See `ADMIN_GUIDE.md` for more details.

### 2.2. End-to-End (E2E) Testing with Playwright

The project includes an E2E test suite using Playwright. These tests simulate user interactions in a real browser environment.

#### Prerequisites
- Node.js and npm installed.
- Install Playwright: `npm install playwright`

#### Running Tests
- The test file is located at `tests/e2e.test.js`.
- You will need a local web server to serve the application files. A simple option is `serve`:
  - `npm install -g serve`
  - `serve .` (run from the project root)
- Run the test script using Node.js:
  - `node tests/e2e.test.js`

#### Test Coverage
The `e2e.test.js` script covers the following user flow:
1. Launches a headless Chromium browser.
2. Navigates to the application.
3. Registers a new user.
4. Logs out and logs back in with the new user's credentials.
5. Enters a prompt into the textarea.
6. Clicks the "Generate Scene" button.
7. Waits for the image to be generated and appear in the gallery.
8. Takes a screenshot of the final page with the generated image.
9. Cleans up by closing the browser.
