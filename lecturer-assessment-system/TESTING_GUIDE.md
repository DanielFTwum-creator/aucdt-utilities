# Testing Guide for the Lecturer Assessment System

**Version 1.1**

---

### Introduction

This document outlines the testing strategy for the Lecturer Assessment System. The goal is to ensure the application is reliable, functional, and user-friendly. It covers both automated and manual end-to-end (E2E) testing.

### Table of Contents
1. [Automated End-to-End Testing](#1-automated-end-to-end-testing-with-playwright)
2. [Manual End-to-End Test Cases](#2-manual-end-to-end-test-cases)

---

### 1. Automated End-to-End Testing (with Playwright)

The project includes an automated E2E test suite built with Jest and Playwright. This suite automatically launches a browser, interacts with the application like a real user, and verifies that key features are working correctly.

#### 1.1 Setup

Before running the tests, you need to install the development dependencies.

1.  **Open your terminal** in the project's root directory.
2.  **Run the installation command:**
    ```bash
    npm install
    ```
    This will download Jest, Playwright, and all other required packages defined in `package.json`.

#### 1.2 Running the Tests

Once the setup is complete, you can run the entire test suite with a single command.

1.  **Open your terminal** in the project's root directory.
2.  **Execute the test script:**
    ```bash
    npm test
    ```
    This command will:
    -   Start a local web server to host the application.
    -   Launch a new instance of the Chromium browser.
    -   Run the automated tests defined in `e2e/app.test.ts`.
    -   Print the test results to the console.
    -   Automatically shut down the server and browser when finished.

#### 1.3 What is Tested?

The automated suite currently covers:
-   **Initial Load:** Verifies that the application loads and displays the home page correctly.
-   **Assessment Submission:** Automates filling out and submitting the assessment form and confirms the result appears.
-   **Admin Login:** Tests both incorrect and correct password submissions and verifies the audit log is displayed and contains the expected entries.

---

### 2. Manual End-to-End Test Cases

Perform these tests in a clean browser session (e.g., incognito mode) to ensure there is no cached data.

#### Test Case 1: Student Submits a Lecturer Assessment

- **Objective:** Verify that a student can successfully fill out and submit an assessment form.
- **Steps:**
    1. Open the application. The "Home" tab should be active.
    2. Click the **"Submit Assessment"** tab.
    3. **Precondition Check:** The "Lecturer Name" dropdown should be disabled.
    4. Select a **Programme** from the dropdown (e.g., "Digital Media").
    5. **Verification:** The "Lecturer Name" dropdown is now enabled and populated with lecturers for that programme.
    6. Select a **Lecturer Name**.
    7. Enter a **Subject/Course** name (e.g., "Web Design").
    8. Select a **Semester**.
    9. For each of the four rating categories, click on the stars to provide a rating (e.g., 4 stars for Teaching Quality).
    10. Enter a comment in the **"Additional Comments"** textarea.
    11. Select an option from the **"Would you recommend this lecturer?"** dropdown.
    12. Click the **"Submit Assessment"** button.
- **Expected Result:**
    - A success modal appears with the message "Assessment Submitted!".
    - The form fields are cleared after submission.
    - Clicking "Continue" on the modal closes it.
    - The new assessment appears correctly in the "View Results" tab.
    - The lecturer's rating is updated in the "Lecturer Directory" tab.
    - A new `ASSESSMENT_SUBMIT` entry appears in the "Admin" tab's audit log.

---

#### Test Case 2: Student Takes a Course Quiz

- **Objective:** Verify the self-testing/quiz functionality works correctly.
- **Steps:**
    1. Open the application.
    2. On the "Home" tab, click on a programme that has courses with quizzes (e.g., "Digital Media").
    3. In the curriculum view, find a course with a **"Start Quiz"** button (e.g., "Introduction to Digital Media").
    4. Click **"Start Quiz"**.
    5. **Verification:** A quiz modal opens, displaying the course title, a timer, and the first question.
    6. Answer the question by clicking on one of the options.
    7. **Verification:** The quiz proceeds to the next question (if any).
    8. Complete all questions.
- **Expected Result:**
    - The timer should count down every second.
    - After the last question is answered, a results screen appears showing the final score (e.g., "You scored 1 / 1").
    - Clicking "Close" dismisses the modal.
    - If the timer runs out before completion, the quiz should end automatically and show the score.

---

#### Test Case 3: Administrator Access and Audit Log Verification

- **Objective:** Verify that the Admin panel is secure and the audit log functions correctly.
- **Steps:**
    1. Open the application and navigate to the **"Admin"** tab.
    2. **Verification:** A password modal appears. The admin content is not visible.
    3. Enter an incorrect password (e.g., "password") and click "Login".
    4. **Verification:** An alert/error message indicates the password is incorrect. The modal remains open.
    5. Enter the correct password (`admin`) and click "Login".
    6. **Verification:** The modal closes, and the Admin Panel is displayed, showing the "Audit Log".
    7. The log should contain one entry for the successful `ADMIN_LOGIN`.
    8. Go to the "Submit Assessment" tab and submit a new assessment.
    9. Return to the "Admin" tab.
- **Expected Result:**
    - The audit log now contains a new `ASSESSMENT_SUBMIT` entry at the top of the list, with the correct timestamp and details.

---

#### Test Case 4: Data Import and Export

- **Objective:** Verify that assessment data can be exported and imported correctly.
- **Steps:**
    1. **Precondition:** Submit at least two assessments.
    2. Navigate to the **"Analytics"** tab.
    3. Click the **"Export to JSON"** button.
    4. **Verification:** A JSON file is downloaded to your computer.
    5. Open the downloaded file and verify its contents match the submitted assessments.
    6. Now, click the **"Import from JSON"** button.
    7. Select the file you just downloaded.
    8. **Verification:** A browser confirmation dialog appears, warning that data will be replaced.
    9. Click "OK".
    10. Go to the "View Results" tab.
- **Expected Result:**
    - The results tab shows the same data that was imported from the file.
    - The "Admin" tab shows a `DATA_EXPORT` log entry followed by a `DATA_IMPORT` entry.

---

#### Test Case 5: AI-Powered PDF Data Extraction

- **Objective:** Verify the PDF upload and data extraction workflow.
- **Steps:**
    1. Navigate to the **"Upload Programmes"** tab.
    2. **Precondition Check:** Attempt to upload a file without selecting a programme first.
    3. **Verification:** An alert should appear prompting you to select a programme.
    4. Select a **Programme** from the dropdown.
    5. Upload a sample PDF file.
    6. **Verification:** A processing indicator appears while the AI is working.
    7. After a few moments, an "Extracted Information" section appears, showing lists of lecturers and courses found in the PDF.
    8. Click the **"Save to System"** button.
- **Expected Result:**
    - An alert confirms the data has been saved.
    - The new lecturer names are now available in the "Submit Assessment" dropdown for that programme.
    - The new lecturers appear in the "Lecturer Directory".
    - The "Admin" tab's audit log shows a `PDF_PROCESSED` entry.
