# PrimeValuer Pro - Testing Guide

This document outlines how to run the end-to-end (E2E) test suite for the PrimeValuer Pro application. The tests are written using **Playwright**, which automates browser interactions to simulate a real user.

## What Do The Tests Cover?

The E2E test suite (`e2e.test.mjs`) validates the core user-facing functionality of the application, including:

-   **Initial State**: Verifying that the application loads with the correct default data.
-   **Form Interaction**: Changing values in input fields and confirming that the application state updates accordingly.
-   **Dynamic Calculations**: Modifying data (e.g., room dimensions) and ensuring that dependent calculations (e.g., Total Internal Floor Area) are updated in real-time.
-   **Component Management**: Adding and removing dynamic elements like "Property Components" and verifying the UI reflects these changes.

> **Note**: The tests do not cover the PDF export functionality, as testing file downloads can be complex and environment-dependent.

---

## Setup and Execution

Follow these steps to run the tests on your local machine.

### 1. Prerequisites

-   **Node.js**: Ensure you have Node.js installed (version 16 or newer is recommended). You can download it from [nodejs.org](https://nodejs.org/).

### 2. Install Dependencies

Open your terminal in the project's root directory and install Playwright:

```bash
npm install playwright
```

This command downloads Playwright and a recent version of Chromium that is guaranteed to work with the library.

### 3. Run the Application Locally

The test suite needs a running instance of the application to connect to. Since this is a static HTML/React project, you can use any simple local web server. The `serve` package is a great, no-configuration option.

First, install `serve` globally (or use `npx`):

```bash
# Recommended: Install globally for easy access
npm install -g serve

# Then, run the server from the project's root directory
serve .
```

Alternatively, you can run it directly with `npx`:
```bash
npx serve .
```

The server will start and provide you with a local URL. By default, it's usually `http://localhost:3000`. The test script is pre-configured for this URL.

### 4. Run the Test Suite

With the local server running, open a **new terminal window** and navigate to the project root. Run the test script using Node:

```bash
node e2e.test.mjs
```

### 5. Expected Output

You will see a series of logs in your terminal as the test script executes each step. If all tests pass, the output will look like this:

```
ℹ️ Launching Playwright...
ℹ️ Navigating to http://localhost:3000...
✅ App loaded successfully.
ℹ️ Test 1: Verifying the main property name...
✅ Property name is correct.
ℹ️ Test 2: Modifying the "Property Name" field...
✅ "Property Name" field updated correctly.
ℹ️ Test 3: Testing dynamic area calculation...
✅ Total Internal Floor Area calculated correctly.
ℹ️ Test 4: Adding a new property component...
✅ Successfully added a new component.
ℹ️ Test 5: Removing a property component...
✅ Successfully removed the component.

-----------------------------
✅ All E2E tests passed!
-----------------------------
ℹ️ Browser closed.
```

If a test fails, the script will stop and print a detailed error message indicating which assertion failed.
