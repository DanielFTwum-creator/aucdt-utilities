# Testing Guide - AUCDT Website

**Version: 1.0**

## 1. Introduction

This guide provides instructions for testing the AUCDT website. It covers both manual testing procedures for quality assurance and instructions for using the built-in automated self-test suite.

## 2. Manual Testing

Manual testing should be performed after any significant change to the codebase to ensure core functionality and visual integrity.

### 2.1 Test Environment

*   **Browsers:** Latest versions of Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge.
*   **Devices:** Desktop (various screen sizes), Tablet (portrait/landscape), and Mobile (portrait/landscape).

### 2.2 Test Cases

| ID    | Feature                | Test Steps                                                                                                                                                                                            | Expected Result                                                                                                                              |
| :---- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **TC-1**  | **Responsive Layout**    | 1. Open the website on desktop. 2. Gradually resize the browser window from wide to narrow. 3. Observe the layout changes. 4. Verify on actual tablet and mobile devices.                             | The layout adjusts smoothly without breaking. The navigation bar collapses into a hamburger menu on smaller screens. Content remains readable. |
| **TC-2**  | **Navigation**         | 1. Click on each link in the main navigation ("Home", "Programmes", etc.). 2. On mobile, open the hamburger menu and click each link. 3. Click the "Explore Programmes" button in the hero section. | All links navigate to the correct section or page. The hero button scrolls to the "Our Programmes" section. The mobile menu opens and closes correctly. |
| **TC-3**  | **Theme Switching**    | 1. Locate the theme switcher dropdown in the header. 2. Select "Dark" mode. 3. Select "High Contrast" mode. 4. Select "Light" mode. 5. Refresh the page.                                            | The website's color scheme changes instantly to the selected theme. The chosen theme persists after a page refresh. All text remains legible.    |
| **TC-4**  | **Accessibility**      | 1. Use the `Tab` key to navigate through all interactive elements (links, buttons, inputs). 2. Use a screen reader (e.g., NVDA, VoiceOver) to navigate the page.                                      | A visible focus indicator appears on every interactive element. The focus order is logical. The screen reader correctly announces content and element roles. |
| **TC-5**  | **Admin Login (Fail)** | 1. Open the admin login modal. 2. Enter an incorrect password (e.g., "test"). 3. Click "Sign In".                                                                                                    | An error message "Invalid password" appears. The user is not logged in. The modal remains open.                                              |
| **TC-6**  | **Admin Login (Success)**| 1. Open the admin login modal. 2. Enter the correct password (`password123`). 3. Click "Sign In".                                                                                                 | The modal closes and the Admin Dashboard is displayed. A success message is logged to the console.                                           |
| **TC-7**  | **Admin Logout**       | 1. Log in as an administrator. 2. Click the "Log Out" button in the dashboard header.                                                                                                                   | The user is returned to the public homepage. The session is terminated. A logout message is logged to the console.                           |

## 3. Automated Self-Testing

The application includes a built-in test runner that simulates a Playwright end-to-end test suite. This allows for a quick, automated health check of critical user journeys.

### 3.1 Accessing the Test Dashboard

1.  Log in to the Admin Dashboard (see **Administrator Guide**).
2.  Click on the **"Playwright Self-Test"** tab.

### 3.2 Running the Tests

1.  On the self-test dashboard, click the **"Run All Tests"** button.
2.  The button will become disabled, and the status of each test will change from "Pending" to "Running..." in sequence.
3.  As each test completes, its status will update to either **"Pass"** (green) or **"Fail"** (red).

### 3.3 Interpreting the Results

*   **Status:** A clear "Pass" or "Fail" indicator shows the outcome of each test.
*   **Logs:** Below each test description, a log panel will appear, detailing the steps the automated test performed. This includes navigation, interactions, and verification checks.
*   **Screenshot Confirmation:** The logs include entries like `<- Screenshot captured: test-step.png`. This confirms that in a real Playwright environment, a visual snapshot of the UI was taken at that step for debugging and verification.

### 3.4 Test Suite Coverage

The automated suite covers the following critical user journeys:
*   Initial page render and hero content verification.
*   Theme switching functionality.
*   Responsive mobile menu availability.
*   Admin login failure with an incorrect password.
*   Admin login success with the correct password.
*   Admin logout functionality.

If any test fails, review the logs for that specific test to identify the point of failure. The logs provide a trace of the simulated actions that can help pinpoint the issue.
