# Testing Guide
**Project:** Techbridge AI Workshop Flyer
**Frameworks:** Jest (conceptually), Playwright (E2E), Manual Diagnostics

---

## 1. Automated E2E Testing (Playwright)
The project includes a robust End-to-End (E2E) test suite located in `tests/playwright/e2e.js`. This suite launches a headless Chrome browser to simulate user interactions.

### 1.1 Prerequisites
```bash
npm install playwright
```

### 1.2 Running the Suite
1.  Ensure the application is running locally (e.g., `http://localhost:3000`).
2.  Update `BASE_URL` in `tests/playwright/e2e.js` if utilizing a different port.
3.  Execute the test runner:
    ```bash
    node tests/playwright/e2e.js
    ```

### 1.3 Test Coverage
The E2E suite verifies:
1.  **Initial Load**: Checks Page Title and Main Container existence.
2.  **Content Rendering**: Verifies Speaker Cards (>2) are present.
3.  **Theming**: Switches to Light Mode and verifies CSS variable computation.
4.  **Security**: Simulates `Ctrl+Shift+A`, inputs admin password, and verifies Dashboard access.
5.  **Screenshots**: Captures evidence in `tests/playwright/screenshots/`.

---

## 2. Client-Side Self-Testing (Diagnostics)
The application allows administrators to run tests directly within the production environment.

### 2.1 Execution
1.  Log in to the **Admin Panel**.
2.  Navigate to the **Diagnostics** tab.
3.  Click **Run Diagnostics**.

### 2.2 Interpretation
*   **Green Check (Pass)**: The component is functioning within parameters.
*   **Red X (Fail)**: Critical failure. Check the `message` field for details (e.g., "Missing Alt Text on 2 images").

---

## 3. Manual Accessibility Testing (WCAG)
1.  **Tab Navigation**: Press `Tab` repeatedly. Verify that focus rings appear on all Buttons and Speaker Cards.
2.  **Screen Reader**: Enable VoiceOver (Mac) or NVDA (Windows). Ensure "Flyer", "Event Details", and "Speakers" sections are announced correctly.
3.  **High Contrast**: Use the Theme Switcher to enable High Contrast mode. Verify all blurred backgrounds are removed and text is strictly Yellow/White on Black.
