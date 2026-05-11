# Visual Quiz Master - Admin Guide

This guide provides instructions on how to access and use the administrative features of the Visual Quiz Master application.

### 1. Accessing the Admin Panel

1.  Click the **Settings icon** (sliders) located at the top-right of the application header.
2.  An admin login screen will appear.
3.  Enter the administrator password and click "Login".
    - The default password is: `admin`
4.  Upon successful login, the Admin Panel will open from the right side of the screen.

### 2. Admin Panel Features

The Admin Panel provides access to diagnostics, real-time statistics, and session logs.

#### 2.1 Quiz Summary
This section provides a live summary of the current quiz session's progress:
- **Correct**: The number of questions answered correctly.
- **Incorrect**: The number of questions answered incorrectly.
- **Unanswered**: The number of questions that have not yet been attempted or where time ran out.

#### 2.2 Playwright E2E Self-Test (Simulation)
This feature simulates the execution of an external Playwright test suite to verify critical user journeys.
1. Click the **"Run E2E Simulation"** button.
2. Observe the real-time log output, which demonstrates a typical test run including actions and verifications.
3. This is an illustrative tool; the actual test suite runs in a separate environment.

#### 2.3 System Diagnostics
This feature validates the integrity of the question data loaded into the application.
1.  Click the **"Run Data Integrity Test"** button.
2.  The system will check all questions for common issues, such as missing IDs, an insufficient number of options, or an invalid index for the correct answer.
3.  The results will be displayed below the button. A success message is shown if all tests pass.

#### 2.4 Audit Log
The audit log provides a timestamped record of all significant actions taken during the current session. This is useful for tracking user interaction and debugging.
- The log is displayed in reverse chronological order (most recent actions at the top).
- Logged actions include: question navigation, answer submissions, theme changes, and admin login attempts.