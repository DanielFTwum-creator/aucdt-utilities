
# Testing Guide
**Project**: TVET Assessment Progress Dashboard  
**Tooling**: Integrated Playwright Simulator

## 1. Overview
The application includes a built-in "Self-Testing Framework" that simulates user interactions directly in the live browser DOM. This ensures that the actual rendering and logic are functioning correctly without needing external Selenium/Cypress infrastructure.

## 2. Running the Test Suite
1. Login to the **Admin Panel** (Key: `admin123`).
2. Navigate to the **Test Suite** tab via the toggle switch in the top right.
3. Click the **Launch Diagnostics** button.

## 3. Test Scenarios
The suite executes the following sequential tests:

### Test 1: DOM Integrity Check
- **Action**: Selects the main `<h1>` element.
- **Verification**: Checks if the title text follows the format "X of Y [Label]".
- **Purpose**: Ensures the Dashboard View mounted correctly.

### Test 2: Config Panel Interaction
- **Action**: Opens the "Config" panel, selects the "Total Scope" input, updates it to `100`, and closes the panel.
- **Verification**: Checks if input elements are reachable and interactive.
- **Purpose**: Verifies the Control Panel visibility and state binding.

### Test 3: State Logic Verification
- **Action**: Waits for React re-render.
- **Verification**: Reads the main title again to see if it now says "... of 100 ...".
- **Purpose**: Confirms that changing an input triggers a state update and DOM re-render.

### Test 4: Quick Action (Increment)
- **Action**: Clicks the "+" button on the "Completed" Hero Stat.
- **Verification**: Compares the value before and after the click.
- **Purpose**: Verifies click handlers and complex state reducers.

## 4. Interpreting Results
- **Pass (Green)**: The feature is working as expected.
- **Fail (Red)**: The test agent encountered an error or assertion failure.
  - *Error Message*: Displayed below the test name.
  - *Resolution*: Check the browser console for detailed stack traces.

## 5. Manual Testing Checklist
In addition to automated tests, manually verify:
- [ ] **PDF Export**: Click the "Download" icon and verify the PNG is generated.
- [ ] **Copy Report**: Click the "Clipboard" icon and paste into Notepad.
- [ ] **Theme Switching**: Cycle through Dark, Light, and Contrast themes in Admin.
