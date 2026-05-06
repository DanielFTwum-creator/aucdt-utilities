# Testing Guide: AI Email Drafter

**Version 1.0**

## 1. Introduction

This guide outlines the testing procedures for the AI Email Drafter application. It covers both the integrated automated test suite and a checklist for manual testing to ensure application quality, functionality, and stability.

---

## 2. Automated End-to-End Testing

The application includes a built-in, simulated Playwright test suite to quickly verify critical user journeys without needing a separate testing environment.

### 2.1 Using the Playwright Self-Test Tab

1.  Launch the AI Email Drafter application.
2.  Click on the **"Playwright Self-Test"** tab in the main navigation.
3.  The test suite interface will be displayed, showing a list of all tests in a "pending" state.
4.  Click the **"Run All Tests"** button to start the simulation.

### 2.2 Interpreting Test Results

As the tests run, the UI will update in real-time:

*   **Running**: A spinner icon indicates the test is currently being executed.
*   **Passed**: A green checkmark icon appears. The time taken for the test to complete is shown.
*   **Failed**: A red X icon appears. The row expands to show failure details, an error message, and a placeholder "screenshot" that simulates what Playwright would capture upon failure.

The summary at the top provides a quick overview of the test run, including total tests, pass/fail counts, and the total execution time.

---

## 3. Manual Testing Checklist

Perform these manual checks before any major release to cover scenarios not easily automated or to verify the user experience.

### 3.1 Core Functionality

-   [ ] **Compose View**: Verify all UI elements (To, CC, BCC, Subject, Body) are present and rendered correctly.
-   [ ] **Recipient Input**:
    -   [ ] Add a single valid email address to "To".
    -   [ ] Add multiple valid email addresses using commas, spaces, and tabs as separators.
    -   [ ] Add an invalid email address and confirm it is highlighted in red.
    -   [ ] Paste a list of mixed valid/invalid emails and confirm they are parsed correctly.
    -   [ ] Remove a recipient by clicking the 'x' on its pill.
    -   [ ] Use backspace in an empty input to remove the last recipient.
-   [ ] **Subject & Body**:
    -   [ ] Type text into the Subject field.
    -   [ ] Type a multi-paragraph message into the Body field.
-   [ ] **Attachments**:
    -   [ ] Attach a single image using the "Attach Image" button.
    -   [ ] Attach multiple images at once.
    -   [ ] Verify the attachment preview shows the correct image, name, and size.
    -   [ ] Remove an attachment and confirm it disappears from the list.

### 3.2 Gemini API Interaction

-   [ ] **Successful Draft**: Fill in all fields with valid data and at least one image, then click "Generate Draft". Confirm a professional email draft is generated.
-   [ ] **Copy Draft**: Click the "Copy Draft" button and paste the content into a text editor to verify it was copied correctly.
-   [ ] **Error - No Recipient**: Click "Generate Draft" without any recipients. Confirm an alert appears.
-   [ ] **Error - No Content**: Click "Generate Draft" with recipients but no subject or body. Confirm an alert appears.
-   [ ] **Loading State**: Click "Generate Draft" and confirm the button enters a "Generating..." loading state and is disabled.

### 3.3 Accessibility (A11y)

-   [ ] **Keyboard Navigation**:
    -   [ ] Use the `Tab` key to navigate through all interactive elements (buttons, inputs, links) in a logical order.
    -   [ ] Use `Shift+Tab` to navigate backward.
    -   [ ] Use `Enter` or `Space` to activate buttons and controls.
-   [ ] **Screen Reader**:
    -   [ ] Use a screen reader (e.g., NVDA, JAWS, VoiceOver) to navigate the application.
    -   [ ] Confirm that all controls have appropriate labels and roles.
    -   [ ] Confirm that dynamic content changes (like generated drafts) are announced.
-   [ ] **Visuals**:
    -   [ ] Ensure there is sufficient color contrast between text and background.
    -   [ ] Confirm that information is not conveyed by color alone.
