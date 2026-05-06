# Testing Guide
### Interactive Product Development Workbook

**Version:** 1.0

---

## 1. Introduction

This document outlines the testing strategy for the Interactive Product Development Workbook. It covers both the integrated automated self-test suite and a checklist for essential manual testing to ensure application quality and functionality.

## 2. Automated Testing

The application includes a built-in, simulated end-to-end (E2E) testing suite that mimics critical user journeys. This allows for quick, on-demand regression testing directly from the application's interface.

### 2.1 Accessing the Test Suite

1.  Open the application and navigate to the **Admin Panel** (see Administrator Guide for access instructions).
2.  Select the **"Self-Test"** tab.

### 2.2 Running the Tests

-   Click the **"Run Test Suite"** button.
-   The tests will execute sequentially, with their status updating in real-time.

### 2.3 Interpreting Test Results

-   **Pass (`Green Checkmark`):** The functionality is working as expected.
-   **Fail (`Red X`):** The test case failed. An error message will describe the issue, and a **"View Screenshot"** button will provide a simulated visual of the failure state.
-   **Duration:** The time taken for each test to "run" is displayed, helping to identify potentially slow operations.

This automated suite provides a high-level overview of the application's health. For more granular verification, manual testing is required.

## 3. Manual Testing Checklist

The following test cases should be performed manually to ensure a high-quality user experience.

| Test ID | Feature Area | Test Case | Expected Result | Status (Pass/Fail) |
| :--- | :--- | :--- | :--- | :--- |
| **MAN-01** | **Project Setup** | Enter a new project name in the header. | The name is accepted and displayed correctly. | |
| **MAN-02** | **Data Persistence** | Enter a project name, add a note in Stage 1, then refresh the browser page. | The project name and note should still be present after the refresh. | |
| **MAN-03** | **Navigation** | Click on three different stages in the sidebar. | The main content view updates instantly to show the correct stage content for each click. | |
| **MAN-04** | **Accordion UI** | In any stage, click on a point's title. Click the same title again. | The point's details section expands on the first click and collapses on the second. | |
| **MAN-05** | **Note Taking** | In an expanded point, type a multi-line note into the "Your Notes" textarea. | The text appears correctly. The note is saved automatically. | |
| **MAN-06** | **Progress Tracking** | In a stage with 4 points, check the "Mark as Complete" box for two points. | The progress bar in the sidebar for that stage should be at 50%, and the counter should read "2/4". | |
| **MAN-07** | **AI Critique** | Add several notes to a stage and click "Get AI Critique". | A loading state appears, followed by a formatted text block containing the AI's feedback. | |
| **MAN-08** | **AI Critique (Empty)** | On a stage with no notes, click "Get AI Critique". | An error message should appear, stating that notes are required. | |
| **MAN-09** | **AI 3D Gen (Text)** | In Stage 5, enter a valid prompt (e.g., "blue chair") and click "Generate Model". | A loading state appears, followed by a generated image of a blue chair. | |
| **MAN-10** | **AI Lifestyle Gen** | In Stage 6, fill in both "Product" and "Context" fields and click "Generate Images". | A loading state appears, followed by four generated lifestyle images. | |
| **MAN-11** | **Theming** | Click the Light, Dark, and High-Contrast theme buttons in the sidebar. | The application's UI colors should immediately and correctly switch to the selected theme. | |
| **MAN-12** | **Admin - Export** | In the Admin Panel, click "Export Data". | A JSON file containing the project data should be downloaded by the browser. | |
| **MAN-13** | **Admin - Auth** | Enter an incorrect password into the admin login. | An "Incorrect password" error message should be displayed. | |
| **MAN-14** | **Accessibility** | Navigate the entire application using only the Tab, Shift+Tab, Enter, and Space keys. | All interactive elements (buttons, inputs, links) should be focusable and operable via the keyboard. | |
| **MAN-15** | **Responsiveness** | Resize the browser window from wide (desktop) to narrow (mobile). | The layout should adapt gracefully, with the sidebar stacking or changing behavior as needed, without content overflow. | |
