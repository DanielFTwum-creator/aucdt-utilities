# Testing Guide

## 1. Introduction
This guide outlines the testing strategy and procedures for the Countdown Timer application.

## 2. Overview
The application incorporates a built-in automated testing suite using Playwright. This suite is designed to verify critical user journeys and ensure the application functions correctly across different environments.

## 3. Test Suite Description
The Playwright test suite is accessible via the Admin Dashboard under the "Playwright Self-Test" tab.

### 3.1 Test Scenarios
The suite executes the following scenarios:
1. **Timer Page Load:** Verifies the main countdown timer page loads successfully and the timer component is visible.
2. **Navigate to Admin Login:** Simulates a user clicking the "Admin" link and verifies the login form is displayed.
3. **Admin Login:** Simulates entering the correct password (`admin123`) and submitting the form. Verifies the Admin Dashboard is successfully loaded.

### 3.2 Test Execution
1. Log in to the Admin Dashboard (`/admin`).
2. Navigate to the "Playwright Self-Test" tab.
3. Click the "Run Playwright Tests" button.
4. The system will launch a headless Chrome browser instance on the server.
5. The browser will navigate through the defined scenarios, capturing screenshots at key points.
6. The test results, including pass/fail status, error messages (if any), and base64-encoded screenshots, will be returned to the client and displayed in the UI.

## 4. Manual Testing Checklist
In addition to the automated suite, the following manual checks should be performed after significant changes:
- Verify React version 19.2.5 is actively in use (check `package.json` and the Admin Dashboard diagnostics).
- Verify all links (e.g., "Admin", "Return to Timer") are functional and lead to the correct destinations.
- Verify the countdown timer updates every second without requiring a page refresh.
- Verify the theme settings (Light, Dark, High-contrast) apply correctly and persist across page loads (using `localStorage`).
- Verify the audit logs accurately record administrative actions (login, logout, theme changes, test executions).
- Verify the application is fully accessible, including keyboard navigation and screen reader compatibility (ARIA labels, `aria-live` regions).
