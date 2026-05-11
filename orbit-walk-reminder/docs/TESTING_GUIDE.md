# Orbit Walk — Testing Guide

## Automated Testing Strategy
Orbit Walk utilises a dual-layer testing approach: UI unit tests and server-side end-to-end (E2E) Puppeteer automation.

## Running the Puppeteer Suite
The suite is integrated directly into the **Admin Portal**.
1. Log in to the Admin section.
2. Select **System Tests**.
3. Click **Launch Test Suite**.

### Test Sequence Details
1. **Load Test:** Navigates to `http://localhost:3000` and verifies the `<title>` element.
2. **Component Test:** Checks for the presence of the `[role="timer"]` aria-attribute.
3. **Regressive Theme Test:** Clicks the Light Theme button and verifies `document.documentElement` data-attributes.
4. **Security Test:** Triggers the admin modal and ensures it renders in the DOM.

## Manual Testing Checklist
### 1. Rhythmic Dings
- [ ] Set interval to 5 minutes.
- [ ] Start timer.
- [ ] Verify audio plays exactly at `00:00`.
- [ ] Verify `walkCount` increments by 1.

### 2. Accessibility & Theme
- [ ] Toggle **Contrast Mode**.
- [ ] Verify text is yellow (`#ffff00`) on black background.
- [ ] Use `TAB` key to navigate all buttons. Verify the skip-link appears.

### 3. Edge Cases
- [ ] Attempt interval update while timer is active (should be disabled).
- [ ] Attempt admin login with empty password.
- [ ] Force server reload while timer is running (verify state resets gracefully).

## Debugging Test Failures
- **Headless Errors:** Ensure `chromium` is installed if running outside the AI Studio environment.
- **Timing Out:** Check the `server.ts` logs. Puppeteer might fail if the server is under heavy load or if Vite is still re-compiling assets.
