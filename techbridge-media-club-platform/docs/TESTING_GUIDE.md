# Testing Guide
**Techbridge Media Club Platform**

## 1. Introduction
This document outlines the testing procedures for the TMCP. It covers manual acceptance testing and automated testing using the built-in tools.

## 2. Manual Testing Checklist

### 2.1 Navigation & Layout
*   [ ] Sidebar toggles correctly on mobile devices.
*   [ ] All 5 main navigation tabs (Dashboard, Content, Assets, Events, Analytics) load their respective views.
*   [ ] Theme toggle switches between Light, Dark, and High Contrast modes.
*   [ ] Hover states appear on all interactive buttons.

### 2.2 Functional Modules
*   **Dashboard:**
    *   [ ] Statistics cards display numbers.
    *   [ ] "View All" link navigates to Content tab.
*   **Content Manager:**
    *   [ ] Filters (All/Draft/Published) update the list.
    *   [ ] "Create Content" opens the Collaborative Editor modal.
*   **Asset Library:**
    *   [ ] "Upload New Asset" triggers a Toast notification (simulated).
    *   [ ] Delete button triggers a Toast notification (simulated).
*   **Admin Panel:**
    *   [ ] Login with incorrect password shows Error Toast.
    *   [ ] Login with `admin123` grants access.

### 2.3 Accessibility
*   [ ] In High Contrast mode, background is black and text is white/yellow.
*   [ ] All icon-only buttons have tooltips or `aria-label` attributes.

## 3. Automated Testing

### 3.1 Internal "Live User Journey"
This test runs inside the application browser context.

1.  Log in to **Admin Portal**.
2.  Go to the **Testing** tab.
3.  Locate the **Live User Journey** card.
4.  Click **Start Test**.
5.  **Observation:** The app will automatically switch tabs. Do not interact with the mouse during this process.
6.  **Success Criteria:** The log at the bottom displays "Journey Complete [PASS]".

### 3.2 External Playwright Suite
This is for CI/CD integration.

1.  Ensure Node.js is installed.
2.  Create a file named `e2e.js`.
3.  Copy the script content from the **Admin Portal > Testing** tab.
4.  Install Playwright:
    ```bash
    npm install playwright
    ```
5.  Run the test:
    ```bash
    node e2e.js
    ```
6.  **Artifacts:** Check the `screenshots/` folder for images of the dashboard, CMS, and admin panel.

## 4. Reporting Bugs
If a test fails:
1.  Check the **Live Audit Logs** in the Admin Overview.
2.  Note the error message.
3.  Ensure the browser console does not show React hydration errors.
