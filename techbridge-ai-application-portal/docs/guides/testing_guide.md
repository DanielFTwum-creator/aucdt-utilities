# Techbridge AI Portal - Testing Guide

**Version 3.0**

## 1. Introduction

This guide outlines the testing procedures for the Techbridge AI Portal, covering both automated and manual testing strategies to ensure application quality, functionality, and usability.

## 2. Automated Testing (Playwright Self-Test)

The primary method for automated testing is the built-in self-test suite available in the Admin Dashboard. This provides a quick and reliable way to perform regression testing on critical features.

### 2.1. Access and Execution
1.  Log in to the Admin Dashboard.
2.  Navigate to the "Playwright Self-Test" tab.
3.  Click "Run Playwright Tests" to execute the entire suite.

### 2.2. Scope of Tests
The suite covers the following critical user journeys as defined in `tests/selfTests.ts`:
-   **Initial Load:** Verifies that the initial page of application cards is rendered correctly.
-   **Search Functionality:** Tests filtering by a specific search term.
-   **Category Filtering:** Ensures category buttons work correctly.
-   **Error States:** Confirms the "No applications found" message is displayed correctly.
-   **Theme Switching:** Validates that changing themes applies the correct CSS styles.

### 2.3. Reviewing Results
-   Monitor the real-time results as they appear.
-   For any **FAIL** status, analyze the **Error Message** and the accompanying **Failure Screenshot** to identify the root cause of the issue.

## 3. Manual Testing

Manual testing is essential to cover usability, cross-browser compatibility, and visual aspects not covered by the automated suite.

### 3.1. Functional Testing Checklist

-   [ ] **Search:**
    -   [ ] Test with various keywords (single word, multiple words).
    -   [ ] Test with keywords that match titles and descriptions.
    -   [ ] Test with no results and verify the "No applications found" message.
-   [ ] **Filtering:** Click each category filter and verify the correct apps are shown.
-   [ ] **App Cards:**
    -   [ ] Hover over a card to verify animations and tooltips.
    -   [ ] Verify image loading indicators (shimmer) appear and are replaced by the image or SVG fallback on error.
    -   [ ] Click "Launch App" and verify the correct URL opens in a new tab.
-   [ ] **Admin Panel:**
    -   [ ] Test login with correct and incorrect passwords.
    -   [ ] Verify the audit logs are created correctly for admin actions.
    -   [ ] Run the self-test and verify the loading spinner appears and results are displayed.

### 3.2. UI & Responsiveness Testing

-   [ ] **Desktop, Tablet, Mobile:** Check the layout on various viewports. Ensure all components are responsive and usable.

### 3.3. Accessibility Testing

-   [ ] **Keyboard Navigation:**
    -   [ ] Navigate the entire site using **Tab**. Ensure all interactive elements are focusable and operable.
    -   [ ] Verify the "Skip to main content" link works correctly.
-   [ ] **Screen Reader:**
    -   [ ] Use a screen reader to verify that search results are announced and interactive elements have proper labels.
-   [- ] **High-Contrast Theme:**
    -   [ ] Switch to the high-contrast theme and ensure all text is legible and UI elements are clearly distinguishable.