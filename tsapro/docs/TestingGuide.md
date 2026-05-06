
# Techbridge TSAP - Testing Guide

**Version 3.1**

## 1. Introduction

This guide outlines the procedures for testing the TSAP application. It covers both the powerful, built-in automated testing framework and a checklist for performing manual user acceptance testing (UAT).

## 2. Automated Testing (Recommended)

The most efficient and comprehensive way to ensure the integrity of the application is to use the built-in self-testing framework. This framework validates the application's core logic against its source data and simulates user journeys.

### 2.1. Running the Test Suites

1.  Log in to the application as an administrator.
2.  Navigate to the **"Self-Test"** page using the link in the header.
3.  The page is divided into two tabs, each representing a different test suite.

### 2.2. E2E User Journey Simulation

This suite provides a "Playwright-style" simulation of critical user workflows directly in the browser.

*   **How to Run**: Click the **"Run E2E Simulations"** button.
*   **What It Does**: The test runner programmatically simulates user actions such as logging in, selecting a grade, performing a standard calculation, and performing a calculation with an override.
*   **Interpreting Results**:
    *   The test displays a step-by-step log of its actions in real-time.
    *   Each step is marked as `Passed` or `Failed`.
    *   For key validation steps, the framework generates a "visual log"—a JSX-rendered snapshot of the relevant UI component (like the payslip), providing a lightweight "screenshot" to confirm the application's state at that moment.
    *   A summary at the top shows the total number of journeys passed and failed.
*   **Exporting Reports**: After the simulation completes, click the **Export Icon Button** (next to Run) to download a full JSON report of the user journey simulation steps and outcomes.

### 2.3. Calculation Engine Validation

This suite performs a direct and powerful validation of the salary calculation logic.

*   **How to Run**: Switch to the "Calculation Engine Validation" tab and click **"Run Full Validation"**.
*   **What It Does**:
    *   It iterates through every single `Grade/Step` record loaded into the application.
    *   For each record, it runs a full salary calculation using the record's standard values.
    *   It then compares the calculated `netMonthly` salary with the `netSalaryInSheet` value stored for that record (the source of truth).
*   **Interpreting Results**:
    *   **`Passed`**: The calculated net salary matches the expected net salary from the data sheet (within a ₵0.01 margin of error).
    *   **`Failed`**: The calculated net salary does not match. If a test fails, a detailed error section will appear, showing the inputs used, the `Expected` result, and the `Actual` (incorrect) result from the calculation engine. This immediately pinpoints any discrepancies between the logic and the source data.
*   **Exporting Reports**: Click the **Export Icon Button** to download a JSON file containing the pass/fail status and execution time for every grade verified.

## 3. Manual Testing Checklist

For ad-hoc verification or user acceptance testing (UAT), follow the checklist below.

### 3.1. Authentication
- [ ] **Test Case 1**: Navigate to the login page.
- [ ] **Test Case 2**: Enter an incorrect password. Verify an error message is displayed.
- [ ] **Test Case 3**: Enter the correct password. Verify successful login and redirection to the dashboard.
- [ ] **Test Case 4**: After logging in, click the "Logout" button. Verify redirection to the login page.

### 3.2. Salary Calculator
- [ ] **Test Case 5**: On the Dashboard, enter a recruit name and select a Grade/Step. Verify the salary/allowance fields populate and the Payslip Summary updates correctly.
- [ ] **Test Case 6**: Perform a calculation with the "Apply Student Loan" toggle enabled for a relevant grade. Verify the deduction is applied correctly in the payslip.
- [ ] **Test Case 7**: Manually enter a different "Annual Basic Salary". Verify the override is used in the calculation, a warning appears, and the input field is highlighted.
- [ ] **Test Case 8**: Manually enter a different "Monthly Consolidated Allowance". Verify the override is used and a warning appears.
- [ ] **Test Case 9**: Click the "Clear All Overrides" button. Verify all overrides are removed and standard values are restored.
- [ ] **Test Case 10**: Toggle the payslip view between "Monthly" and "Annual" and verify the figures are correct.

### 3.3. History & Admin Panel
- [ ] **Test Case 11**: Navigate to the History page. Verify that recent calculations are listed.
- [ ] **Test Case 12**: Use the search bar on the History page to filter for a specific recruit.
- [ ] **Test Case 13**: Click "View Details" on a history item and verify the full, accurate breakdown is shown.
- [ ] **Test Case 14 (Password Change)**: Navigate to the Admin Panel. Change the password successfully. Log out and log back in with the new password.
- [ ] **Test Case 15 (Grade Management)**: In the Admin Panel, add a new grade. Verify it appears in the calculator dropdown. Edit the new grade. Verify the changes are saved in the table. Delete the new grade after confirming. Verify it is removed.
- [ ] **Test Case 16 (Audit Log)**: On the Admin Panel, review the Security Audit Log. Verify that recent actions (logins, calculations, grade changes) are recorded accurately and in detail.

### 3.4. User Interface
- [ ] **Test Case 17**: Use the theme switcher in the header to cycle through all three themes (Light, Dark, High-contrast). Verify the UI updates correctly and is legible in all modes.
- [ ] **Test Case 18**: Refresh the page after selecting a theme. Verify the chosen theme persists.
