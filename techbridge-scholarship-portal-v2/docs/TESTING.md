# Testing Guide

## End-to-End (E2E) Testing

This project includes a comprehensive E2E test suite using Playwright to verify the critical path of the scholarship application.

### Prerequisites

- Node.js installed
- Application running on `http://localhost:3000` (default dev server)

### Running the Test

To execute the test suite, run:

```bash
npm run test:e2e
```

### Test Coverage

The test (`tests/playwright/scholarship_form.test.js`) covers:

1.  **Navigation**: Loading the application and switching to the "Bond / Undertaking" tab.
2.  **Step 1 (Scholar Details)**: Filling out personal information (Name, ID, Email, Phone, etc.).
3.  **Step 2 (Programme Details)**: Entering academic details and verifying the mandatory service bond clause (10 years).
4.  **Step 3 (Guarantor & Witnesses)**: Populating guarantor and witness information.
5.  **Step 4 (Review & Sign)**: Agreeing to terms and generating a digital signature.
6.  **Submission**: Submitting the form and verifying the "Bond Executed" success message.
7.  **Email Verification**: The test captures the simulated email payload logged to the console.

### Troubleshooting

-   **Timeout Errors**: If the test fails with a timeout, ensure your computer is not under heavy load. You can increase timeouts in the test file.
-   **Selector Errors**: If the UI changes, selectors in the test file might need updates.
-   **Signature Error**: You might see `Signature rasterisation failed` in logs due to colour space issues with `html2canvas` and Tailwind v4. This does not block submission in the test environment.

## Internal Simulation

You can also run a visual simulation directly in the browser:

1.  Navigate to the **Admin Panel** (click the "Staff Portal" link or append `?view=admin` to URL).
2.  Login with code: `TUC-SEC-01`.
3.  Go to the **Simulator** tab.
4.  Click **Run Simulation**.

This will auto-fill the form in real-time for visual verification.
