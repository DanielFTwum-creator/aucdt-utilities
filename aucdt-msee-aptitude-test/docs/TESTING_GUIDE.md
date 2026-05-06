# Testing Guide

This guide outlines the testing strategy for the AUCDT MSEE Mathematics Aptitude Test application and provides instructions for running end-to-end (E2E) tests using Playwright.

## Table of Contents
1. [Testing Philosophy](#1-testing-philosophy)
2. [Self-Test Demonstration Mode](#2-self-test-demonstration-mode)
3. [End-to-End Testing with Playwright](#3-end-to-end-testing-with-playwright)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Sample Playwright Test Script](#sample-playwright-test-script)
    - [Running the Test](#running-the-test)

---

### 1. Testing Philosophy

The application's testing approach focuses on ensuring the critical user journeys are robust and reliable.
-   **Unit/Component Testing (Manual):** Individual React components are built to be modular. Formal unit testing is outside this project's scope but could be added with Jest and React Testing Library.
-   **End-to-End (E2E) Testing:** The primary focus is on E2E testing, which simulates a real user's workflow from start to finish. This ensures all parts of the application (UI, backend APIs, state management) work together correctly.

### 2. Self-Test Demonstration Mode

For a quick, visual confirmation that the application's core functionality is working, use the built-in self-test mode.

-   **How to Access:** Navigate to the application URL and append `?selftest`. Example: `http://localhost:3000/?selftest`.
-   **What it Does:** This mode automatically runs a scripted sequence of actions that mimics the student journey. It provides a visual log of each step, serving as an excellent tool for demos or a quick smoke test.

### 3. End-to-End Testing with Playwright

The following script validates the complete student examination flow, including authentication.

#### Prerequisites
-   Node.js and npm installed.
-   The application must be running locally (`npm start`).
-   A student test user must exist in the database. You can create one by registering through the application's UI.

#### Setup
1.  Create a new folder for your tests (e.g., `e2e-tests`).
2.  Navigate into that folder and initialize a new Node.js project:
    ```bash
    mkdir e2e-tests
    cd e2e-tests
    npm init -y
    ```
3.  Install Playwright and Assert:
    ```bash
    npm install playwright assert
    ```

#### Sample Playwright Test Script
Create a file named `student-flow.test.js` and paste the following code. **Remember to update the `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` variables.**

```javascript
const playwright = require('playwright');
const assert = require('assert');

// --- Configuration ---
const APP_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'student@test.com'; // CHANGE THIS
const TEST_USER_PASSWORD = 'password123';   // CHANGE THIS
const TEST_TIMEOUT = 45000; // 45 seconds

async function runStudentExamTest() {
  let browser;
  console.log('🚀 Starting E2E test for the Student Examination Flow...');

  try {
    browser = await playwright.launch({ 
      headless: true, // Set to false to watch the test run
      slowMo: 25,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });

    console.log('✅ [PASS] Navigated to the application login page.');

    // 1. Log In
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', TEST_USER_EMAIL);
    await page.type('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    console.log('✅ [PASS] Submitted login credentials.');

    // 2. Start the Examination
    const startButtonSelector = 'button'; // The main button on the start screen
    await page.waitForSelector(startButtonSelector, { timeout: 10000 });
    const startButtonText = await page.$eval(startButtonSelector, el => el.innerText);
    assert.strictEqual(startButtonText, 'Start Examination', 'Start screen did not load after login.');
    await page.click(startButtonSelector);
    console.log('✅ [PASS] Logged in and clicked "Start Examination".');

    // 3. Verify Exam Interface is loaded
    await page.waitForSelector('.progress-bar', { timeout: 5000 });
    console.log('✅ [PASS] Exam interface loaded successfully.');

    // 4. Answer a few questions
    const questionCount = (await page.$$('.question-grid button')).length;
    assert.ok(questionCount > 0, 'Question grid should have questions.');
    console.log(`- Found ${questionCount} questions in the exam.`);

    for (let i = 0; i < 3; i++) {
        // Select the first radio button option
        await page.waitForSelector('input[type="radio"][value="0"]');
        await page.click('input[type="radio"][value="0"]');
        
        // Click "Next" or "Review"
        const nextButton = await page.waitForSelector('.flex.justify-between button:last-child');
        await nextButton.click();
    }
    console.log('✅ [PASS] Answered the first 3 questions.');

    // 5. Review and Submit
    const reviewButton = await page.waitForSelector('button:last-child');
    const reviewButtonText = await page.$eval('button:last-child', el => el.innerText);
    if (reviewButtonText === 'Review Answers') {
        await reviewButton.click();
        console.log('✅ [PASS] Clicked "Review Answers".');
        const finalSubmitButton = await page.waitForSelector('button:last-child');
        await finalSubmitButton.click();
        console.log('✅ [PASS] Clicked "Submit Final Answers" from review screen.');
    } else {
        // If already on the last question, the button might be "Submit"
        await reviewButton.click();
    }
    
    // 6. Confirm Submission in Modal
    const confirmButtonSelector = '.fixed.inset-0 button:last-child';
    await page.waitForSelector(confirmButtonSelector);
    await page.click(confirmButtonSelector);
    console.log('✅ [PASS] Confirmed submission in modal.');

    // 7. Verify Results Page
    await page.waitForSelector('#results-summary h1', { timeout: 10000 });
    const resultsTitle = await page.$eval('#results-summary h1', el => el.innerText);
    assert.strictEqual(resultsTitle, 'Examination Results', 'Results page title is incorrect.');
    
    const scoreText = await page.$eval('.text-6xl', el => el.innerText);
    console.log(`- Final Score: ${scoreText}`);
    assert.ok(scoreText.includes('%'), 'Score percentage is not displayed correctly.');
    
    console.log('✅ [PASS] Verified results page successfully.');
    console.log('🎉 E2E Test for Student Flow Completed Successfully!');

  } catch (error) {
    console.error('❌ [FAIL] An error occurred during the E2E test:');
    console.error(error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runStudentExamTest().catch(console.error);

```

#### Running the Test
1.  Make sure your application is running (`npm start`).
2.  From your `e2e-tests` directory, run the script from the command line:
    ```bash
    node student-flow.test.js
    ```
3.  The console will log the progress and final result of the test.