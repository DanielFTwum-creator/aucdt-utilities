# Testing Guide
## AI Agent Masterclass Portal

### 1. Built-in Test Suite
The application includes a self-contained test suite accessible via the Admin Dashboard.

**Access:**
1. Log in to `#/admin`.
2. Navigate to the **Test Suite** tab.

**Available Tests:**
- **Email API Connectivity (via Proxy)**: Pings the `/api/send-email` endpoint, which verifies the backend proxy's ability to reach `aucdt.edu.gh`.
- **Theme Render Stability**: Verifies `localStorage` read/write capabilities for preferences.
- **Audit Log Integrity**: Checks that logs are being written in the correct JSON schema.
- **Visual Snapshot**: Invokes `window.print()` to allow the administrator to save a PDF snapshot of the current UI state for visual regression comparison.

### 2. Manual Test Protocol (UAT)

**Scenario A: Masterclass Booking**
1. Select "Group Masterclass".
2. Choose a Thursday date.
3. Enter valid email (`test@example.com`).
4. Click "Secure Spot".
5. **Expected**: Redirect to "You're Booked!" screen with Calendar links.

**Scenario B: Private Session**
1. Select "Private Session".
2. Enter Name, Work Email, and Notes.
3. Click "Request Private Session".
4. **Expected**: Redirect to "Request Received" (Yellow Theme) screen.

**Scenario C: High Contrast Mode**
1. Click the Contrast icon (Bottom Right).
2. **Expected**: Background becomes black, text becomes white, video animations stop.

### 3. Automated Testing (Puppeteer/Playwright)
*Note: External test runners require a separate Node.js environment.*

**Visual Regression Setup:**
1. Script navigates to `/#/`.
2. Script waits for `.animate-in` classes.
3. Script takes screenshot.
4. Script compares with `baseline.png`.

**Zero Broken Links Policy:**
- All `<a>` tags and internal navigation buttons must be verified weekly.
- Current Status: **PASS** (Verified Feb 24, 2025).
