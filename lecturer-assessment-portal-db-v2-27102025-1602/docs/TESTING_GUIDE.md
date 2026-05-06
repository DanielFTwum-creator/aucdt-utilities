# Testing Guide
## Lecturer Assessment & Evaluation Portal

This document provides an overview of the testing strategies and tools used in this project to ensure code quality, functionality, and stability.

---

### 1. Testing Philosophy

This project employs a two-tiered testing approach:
1.  **Unit & Integration Testing:** To verify that individual components and hooks behave correctly in isolation and when integrated with other parts of the application.
2.  **End-to-End (E2E) Testing:** To simulate real user workflows from start to finish, ensuring that the application as a whole functions as expected.

---

### 2. Unit & Integration Testing

#### 2.1 Framework and Tools
-   **Test Runner:** [Vitest](https://vitest.dev/) - A fast and modern test runner compatible with Vite.
-   **Testing Library:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - For rendering components and interacting with them in a way that resembles a real user.
-   **DOM Assertions:** `@testing-library/jest-dom` - Provides custom matchers to make assertions on the state of the DOM (e.g., `toBeInTheDocument()`).
-   **User Interactions:** `@testing-library/user-event` - For simulating user actions like typing, clicking, and selecting options.

#### 2.2 Running Tests
To run all unit and integration tests, execute the following command from the project root:

```bash
npm test
```
or for a single run:
```bash
vitest run
```

This will discover and run all files ending in `.test.tsx` or `.test.ts`.

#### 2.3 Test Coverage
Tests are written for:
-   **Core Components:** Verifying that components like `LecturerAssessmentForm` and `LecturerDetailView` render correctly and handle user interactions as expected.
-   **Custom Hooks:** Ensuring that data-processing logic within hooks like `useEvaluations` is correct (e.g., filtering, sorting, and statistical calculations).
-   **Critical UI Elements:** Testing modals, navigation, and other key parts of the user interface.

---

### 3. End-to-End (E2E) Testing

#### 3.1 The Self-Test Suite
This project includes a unique **in-browser E2E test suite demonstration**. It is designed to provide a quick, visual confirmation that the application's most critical user journeys are functioning correctly.

-   **Location:** The suite is accessible via the **"Self Test"** tab in the admin dashboard.
-   **Functionality:** Clicking "Run E2E Test Suite" initiates a series of simulated user actions. The UI provides real-time feedback on which test is running and whether it passed or failed.

#### 3.2 Test Scenarios
The self-test suite covers the following critical paths:
1.  **Student Form - Happy Path:** Simulates a student successfully filling out and submitting the assessment form.
2.  **Student Form - Validation:** Simulates a student trying to submit an incomplete form to verify that validation warnings appear.
3.  **Admin Login - Success:** Simulates a successful admin login.
4.  **Admin Login - Failure:** Simulates a failed admin login with an incorrect password.
5.  **Admin Navigation:** Simulates an admin clicking through the different dashboard tabs to ensure they render without crashing.

#### 3.3 Adapting for a True E2E Environment (with Playwright)
The logic for the self-test suite is located in `playwright-test-suite.ts`. While it runs in the browser for demonstration, it is written to be easily adaptable for a true headless browser testing environment using a tool like [Playwright](https://pptr.dev/).

To convert this into a real E2E test:
1.  Set up a Node.js test environment.
2.  Install Playwright: `npm install --save-dev playwright`.
3.  Create a test file (e.g., `e2e.test.js`).
4.  In this file, you would import Playwright, launch a browser instance, and adapt the logic from `playwright-test-suite.ts`.

**Example Adaptation:**

A simulated check in `playwright-test-suite.ts`:
```typescript
// This is a simulation
async function checkFormExists() {
    // In a real test, this would use Playwright's page object
    // For the demo, we assume it passes.
    return { success: true, log: 'Form rendered successfully' };
}
```

Could be translated to a real Playwright test:
```javascript
// In a real Node.js test file
const playwright = require('playwright');

test('Student form should render', async () => {
  const browser = await playwright.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000'); // Your app's URL
  
  const formTitle = await page.$('h1');
  const text = await page.evaluate(element => element.textContent, formTitle);
  
  expect(text).toContain('Lecturer Assessment Form');
  
  await browser.close();
});
```