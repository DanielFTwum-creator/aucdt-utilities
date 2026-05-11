# Testing Guide
## AUCDT Quality Assurance

This project utilizes a dual-layer testing strategy: a visual in-browser runner for quick checks and a Playwright suite for CI/CD integration.

### 1. Interactive Self-Test (Visual)
*Designed for Administrators and QA manual testers.*

This test runs directly within the deployed application. It simulates user actions visually.

**How to Run:**
1.  Log in to the **Admin Dashboard**.
2.  Go to the **System Self-Test** tab.
3.  Click **Run Live Test Suite**.
4.  Watch the overlay as it checks:
    *   DOM Structure
    *   Theme Toggling
    *   Navigation Links
    *   Chat Widget
    *   Accessibility Features

### 2. Automated Playwright Suite (Headless)
*Designed for Developers and CI/CD pipelines.*

This suite uses Google's Playwright to control a headless Chrome instance, performing end-to-end validation.

**Location:** `tests/playwright_suite.js`

**Prerequisites:**
```bash
npm install playwright
```

**How to Run:**
1.  Ensure the local development server is running:
    ```bash
    npm start
    ```
2.  Open a new terminal window.
3.  Execute the test script:
    ```bash
    node tests/playwright_suite.js
    ```

**Test Coverage:**
1.  **Homepage Load**: Verifies `<title>` and Hero Slider presence.
2.  **Theme Switching**: Programmatically clicks theme buttons and verifies `<html>` class changes (Light -> Dark -> High Contrast).
3.  **Navigation**: Simulates hovering over "About Us" to check dropdown visibility.
4.  **Virtual Assistant**: Opens chat, types "Admissions", and validates the bot's automated response text.
5.  **Screenshots**: Captures PNG screenshots of every stage in the `screenshots/` directory.

### 3. Accessibility Testing
The application is designed with the following accessibility features, which should be manually verified periodically:
*   **Skip Links**: Press `Tab` immediately after load. A "Skip to main content" link should appear.
*   **High Contrast Mode**: Use the Eye icon in the header. Text should be Yellow/White on Black.
*   **ARIA Labels**: All interactive buttons (Socials, Menu, Sliders) utilize `aria-label`.
