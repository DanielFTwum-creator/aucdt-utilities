# Testing Guide

**Institution:** Techbridge University College (TUC)
**Document ID:** TUC-INC-2026-006

## 1. Overview
This generic testing guide covers testing protocols for the TUC Project Refresh Framework application, combining automated Playwright end-to-end tests with manual test checklists.

## 2. Playwright Test Suite

### How to Run Tests
The test suite utilises Playwright for complete browser automation.
```bash
# Execute the test suite
npx playwright test tests/playwright.test.ts
```

### In-Browser Interactive Self-Test
The application features an integrated test runner in the frontend logic:
1. Open the application.
2. Click the Terminal icon (`Test Dashboard`) in the top right corner.
3. Select "Playwright Self-Test" and click "Run Full Playwright Suite". 
4. View the real-time test execution logs and snapshots.

### Interpreting Results & Screenshots
- **Green Checks:** Test executed via logical parameters successfully.
- **Red Crosses:** Logical failure or timeout.
- **Screenshots:** If an internal diagnostic run fails, `html2canvas` captures the current viewport. Review the captured Base64 image in the interface below the error module to identify layout occlusions or broken states.

## 3. Manual Testing Checklist

For environments where browser automation is heavily blocked, use this manual procedure:

### Authentication & Authorisation
- [ ] Attempt login with invalid credentials -> ensure rejection with generic error message.
- [ ] Attempt login with valid Administrator credentials -> verify routing to `Admin Dashboard`.
- [ ] Refresh page -> verify auth session is maintained.
- [ ] Click "Logout" -> verify tokens/cookies are invalidated.

### Audit & Security
- [ ] Make a data change in the Admin panel.
- [ ] Load the Audit Logs interface.
- [ ] Verify the action is clearly documented with the correct timestamp and user ID.

### Themes & Accessibility
- [ ] Navigate to the main menu and use 'Tab' -> ensure focus rings are visible on all interactive elements.
- [ ] Use a screen reader (e.g., VoiceOver or NVDA) -> confirm all actionable buttons correctly narrate their `aria-label`.
- [ ] Toggle Light/Dark mode -> confirm background and text colours invert appropriately.
- [ ] Refresh page -> verify theme persists via `localStorage`.
