# Visual Quiz Master - Testing Guide

This document provides an overview of the testing capabilities within the Visual Quiz Master application and recommends procedures for ensuring its quality and stability.

### 1. Integrated Self-Testing

The application includes built-in diagnostic tools to perform automated checks on the application's data and to simulate end-to-end tests. These are accessed via the Admin Panel.

#### 1.1 System Diagnostics (Data Integrity)
This tool performs automated checks on the application's core data (the questions).

**How to Use:**
1.  Log into the Admin Panel (see Admin Guide).
2.  Navigate to the "System Diagnostics" section.
3.  Click the "Run Data Integrity Test" button.

**What it Tests:**
- **Data Integrity**: Verifies that every question in `constants.ts` has a valid structure, including a unique ID, at least two options, and a `correct` answer index that points to a valid option.

This test is crucial for developers when adding or modifying quiz content to prevent data-related errors.

#### 1.2 Interactive E2E Self-Test (Simulation)
The Admin Panel includes an interactive tab to demonstrate and simulate a critical-path End-to-End (E2E) test.

**How to Use:**
1.  Log into the Admin Panel.
2.  Navigate to the "Playwright E2E Self-Test (Simulation)" section.
3.  Click "Run E2E Simulation".

**What it Does:**
- **Simulates a User Journey**: It displays a real-time log that walks through a typical user journey, such as answering questions correctly, incorrectly, letting the timer expire, and verifying the results.
- **Illustrates E2E Concepts**: It mentions concepts like "screenshot capture" to show what a full, external test suite would be capable of.
- **Purpose**: This feature serves as an integrated, interactive demonstration of the E2E test plan. **It does not run an actual Playwright instance.**

### 2. Manual & Visual Testing

Due to the highly visual and interactive nature of the quiz, manual testing remains essential.

**Recommended Checklist:**
-   [ ] **Question Rendering**: Navigate through every question to ensure all elements (text, MathJax, SVGs, Charts) render correctly.
-   [ ] **Answer Interaction**: Test submitting correct and incorrect answers for each question type.
-   [ ] **Timer Functionality**: Verify the countdown, color changes, and auto-submission on timeout.
-   [ ] **Navigation**: Test all navigation methods (top bar, arrow buttons).
-   [ ] **Theming & Accessibility**: Test all three themes for visual correctness and use the keyboard to operate the entire quiz.
-   [ ] **Responsiveness**: Test on various screen sizes.

### 3. Automated End-to-End Testing (External)

For a production environment, setting up an automated E2E testing suite is highly recommended. The in-app simulation (see 1.2) is based on this concept.

-   **Recommended Tools**: Playwright or Playwright.
-   **Execution**: An E2E test suite must be created and run in an external development environment with Node.js.
-   **Critical User Journeys to Test**:
    1.  **Full Quiz Completion**: A script that launches the app, answers every question, and verifies the final score in the Admin Panel.
    2.  **Incorrect Answer Path**: A script that deliberately answers questions incorrectly and verifies the feedback mechanism.
    3.  **Timeout Path**: A script that waits for the timer to expire on a question and confirms it's marked as unanswered/incorrect.
    4.  **Visual Regression**: A script that takes screenshots of each question's visual component (SVG, Chart) and compares them against baseline images to catch rendering regressions.