# Testing Guide: GhanaRide Platform

**Version 1.0**

## 1. Introduction

This guide outlines the testing procedures for the GhanaRide Car Rental application. It covers both manual testing checklists and instructions for using the integrated self-testing framework to ensure quality and stability.

---

## 2. Interactive Self-Testing Framework

The application includes a built-in testing suite accessible from the Admin Panel. This should be the first step in any regression testing process.

**How to Use:**
1.  Log in to the Admin Panel.
2.  Navigate to the **"Self-Testing"** tab.
3.  Click the **"Run All Tests"** button.
4.  Observe the results as they are populated in real-time.
5.  **Expected Outcome**: All tests should complete with a "passed" status.
6.  Any "failed" status indicates a regression and should be investigated immediately. The test details and simulated screenshot name provide context for the failure.

---

## 3. Manual Testing Checklist

Perform these manual checks, especially after changes that might not be covered by the automated suite.

### 3.1 Core Functionality

-   [ ] **Page Load**: Verify the main application page loads correctly, displaying the header, search bar, and a list of mock vehicles.
-   [ ] **Search Bar**:
    -   [ ] Verify the "Pick-up Location" input field is present and accepts text.
    -   [ ] Verify the "Pick-up Date" input is a date picker and functions correctly.
    -   [ ] Confirm the "Search Cars" button is visible and clickable.
-   [ ] **Vehicle Listings**:
    -   [ ] Confirm a grid of "Popular Vehicles" is displayed on load.
    -   [ ] Check that each vehicle card displays an image, name, type, rating, price, and a "Book Now" button.
    -   [ ] Hovering over a vehicle card should trigger a subtle zoom effect.
    -   [ ] Clicking "Book Now" should (for now) have no effect, but should not cause an error.

### 3.2 Gemini API Interaction (AI Suggestions)

-   [ ] **Component Rendering**: Verify the "AI-Powered Trip Suggestions" section is visible.
-   [ ] **Successful Suggestion (with Geolocation)**:
    -   [ ] When prompted, allow the browser to access your location.
    -   [ ] Type a query into the input field (e.g., "best beaches near me").
    -   [ ] Click "Get Ideas" and confirm a loading state appears.
    -   [ ] Verify that a text summary and a list of clickable place cards are returned.
    -   [ ] Clicking a place card should open the location in Google Maps in a new tab.
-   [ ] **Successful Suggestion (without Geolocation)**:
    -   [ ] When prompted, block the browser from accessing your location.
    -   [ ] Type a query into the input field (e.g., "tourist sites in Accra").
    -   [ ] Click "Get Ideas".
    -   [ ] Verify that a response is generated without location-specific context.
-   [ ] **Error Handling**:
    -   [ ] Click "Get Ideas" with an empty input field. Confirm no API call is made.
    -   [ ] (Requires setup) Test with an invalid API key to ensure a user-friendly error message is displayed.

### 3.3 Accessibility (A11y) & UI

-   [ ] **Keyboard Navigation**:
    -   [ ] Use the `Tab` key to navigate through all interactive elements (inputs, buttons, vehicle cards) in a logical order.
    -   [ ] A clear focus outline should be visible on the focused element.
    -   [ ] Use `Enter` to activate buttons and links.
    -   [ ] Use `Escape` to close the Admin Login modal.
-   [ ] **Responsiveness**:
    -   [ ] Resize the browser window to simulate mobile, tablet, and desktop views.
    -   [ ] Confirm the layout adjusts cleanly at each breakpoint (e.g., vehicle cards stack vertically on mobile).
-   [ ] **Visuals & Theming**:
    -   [ ] Use the theme switcher to cycle through Light, Dark, and High-Contrast modes.
    -   [ ] Confirm all UI elements, text, and backgrounds adapt correctly for each theme.
    -   [ ] Check for sufficient color contrast across all themes, especially in High-Contrast mode.