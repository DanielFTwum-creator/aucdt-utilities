# myVBCI Camper App - Testing Guide

**Version: 1.0**

---

## 1. Introduction

This guide provides instructions for testing the myVBCI Camper App. It covers both the integrated automated test suite and provides a checklist for manual user acceptance testing (UAT).

## 2. Automated Testing: Playwright Self-Test Suite

The application includes a built-in, simulated end-to-end testing framework. This allows administrators to quickly verify that critical user journeys are working as expected without leaving the application.

### 2.1 Accessing the Test Suite

1.  Log in to the application as an **Administrator**.
2.  From the sidebar navigation, click on the **"Testing"** item (with the flask icon).

### 2.2 Running the Tests

1.  On the "Playwright Self-Test Suite" page, you will see a list of test suites (e.g., "Authentication Flow", "Admin Panel Operations").
2.  Click the **"Run All Tests"** button at the top of the page.
3.  The tests will begin to execute sequentially. You will see the status of each test case update in real-time.

### 2.3 Interpreting the Results

Each test case will display one of the following statuses:

-   <span style="color: blue;">**RUNNING:**</span> The test is currently in progress. An animated loader icon will be visible.
-   <span style="color: green;">**PASSED:**</span> The test completed successfully. A green checkmark icon will be visible, along with the execution time in milliseconds.
-   <span style="color: red;">**FAILED:**</span> The test encountered an error. A red 'X' icon will be visible.
-   <span style="color: gray;">**PENDING:**</span> The test has not yet been run. A clock icon will be visible.

### 2.4 Handling Failures

If a test fails:
-   An error message describing the reason for the failure will be displayed in a red box below the test case.
-   A link titled **"View Screenshot"** will appear. Clicking this link will open a new tab showing a dynamically generated image that simulates what the screen might have looked like at the moment of failure. This helps in diagnosing the issue.

## 3. Manual Testing Checklist

Manual testing is recommended to verify usability and catch issues not covered by automated tests. Log in with both **Admin** and **Camper** demo accounts to test role-specific functionality.

### 3.1 Admin Role Test Cases

| # | Test Case Description | Steps | Expected Result |
|---|---|---|---|
| 1 | Create and Verify a New Camp | 1. Go to Manage Camps. 2. Click "Add Camp". 3. Fill out and submit the form. | The new camp appears in the list with correct details. |
| 2 | Add a Room to the New Camp | 1. Go to Room Allocation. 2. Select the new camp. 3. Click "Add Room". 4. Fill out and submit. | The new room appears under the correct camp. |
| 3 | Edit an Existing Room | 1. Hover over the new room. 2. Click the Edit icon. 3. Change the capacity and save. | The room's capacity is updated on the card. |
| 4 | Send a Notification to Campers | 1. Go to Notifications. 2. Create a new alert with "Campers Only" audience. | The notification appears in the list. (Verify a camper user can see it). |
| 5 | Delete a Room and a Camp | 1. Delete the created room. 2. Delete the created camp. | Both items are removed after confirmation. |

### 3.2 Camper Role Test Cases

| # | Test Case Description | Steps | Expected Result |
|---|---|---|---|
| 1 | Successful Registration Flow | 1. Log in as a Camper. 2. Select an available camp. 3. Select an available, gender-appropriate room. 4. Proceed to payment and confirm. | A success modal appears with a booking confirmation number. |
| 2 | View Profile Information | 1. Navigate to "My Profile". | The user's correct name, email, and role are displayed. |
| 3 | Interact with AI Assistant | 1. Open the AI Assistant widget. 2. Ask "How much is the Youth Camp?". | The AI provides a correct and relevant answer based on camp data. |
| 4 | Verify Full Room is Not Selectable | 1. Check if any camp has a full room. 2. Attempt to register for that camp and select the full room. | The full room should not be visible or should be disabled in the selection list. |
