# Pama Realtor - Testing Guide

## 1. Introduction
This application includes a built-in **Self-Diagnostic Testing Suite** for verifying system integrity and generating external automation scripts.

## 2. Internal Self-Diagnostics

### Accessing the Suite
1. Log in to the **Admin Dashboard** (Password: `pama123`).
2. Click the floating **Flask Icon** in the bottom right corner of the screen.

### Running Tests
1. In the "Self-Diagnostic Suite" tab, click the green **RUN TESTS** button.
2. The system will perform the following checks:
   - **DOM Mount:** Verifies React root attachment.
   - **Component Check:** Ensures critical UI blocks are rendered.
   - **Theme Context:** Verifies Tailwind class injection.
   - **API Config:** Checks for `process.env.API_KEY` presence.
   - **Logic Verification:** Validates cart math (Subtotal + 5% Service Charge).
   - **AI SDK:** Confirms Google GenAI module loading.

### Capturing Results
Click **Capture Results** to download a screenshot (`test-results.png`) of the diagnostics report for documentation.

## 3. External Automation (Playwright)

### Generating the Script
1. Open the Testing Suite.
2. Switch to the **Playwright Script Generator** tab.
3. Click **Copy Code** to get the Node.js script.

### Running the Script
1. Ensure you have Node.js installed locally.
2. Create a file named `test.js` and paste the code.
3. Install Playwright:
   ```bash
   npm install playwright
   ```
4. Run the test:
   ```bash
   node test.js
   ```
5. The script will verify navigation, search functionality, cart interaction, and theme toggling, then save a screenshot.
