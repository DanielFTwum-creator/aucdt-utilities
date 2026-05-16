# E2E Testing Guide — Glucose Blood Glucose Monitoring App

## Overview

The Glucose app includes a comprehensive E2E test suite that captures **real browser screenshots** of critical user journeys using Playwright browser automation.

## Test Coverage

### Test Suites Implemented

1. **OAuth Login Journey** (4 tests)
   - LoginView renders with Google sign-in button
   - OAuth popup opens on sign-in click
   - User authenticated via Google, App renders with patient data
   - Patient Name auto-populated from authenticated user fullName

2. **Admin Access Journey** (4 tests)
   - Admin panel opens password modal on click
   - Incorrect password shows error message
   - Correct password grants admin access
   - Admin panel displays audit log entries

3. **Image Scanning Journey** (4 tests)
   - Scan Photo button opens file picker
   - Loading overlay shows scanning progress
   - Gemini API extracts glucose readings from image
   - Extracted readings appear in data table

4. **Data Management Journey** (5 tests)
   - Manual Entry button opens add reading modal
   - Date picker allows selecting reading date
   - New readings save to IndexedDB successfully
   - Data table updates with newly saved readings
   - Delete button removes reading from table

5. **Theme & Logout Journey** (4 tests)
   - High contrast toggle enables accessible theme
   - Unit selector switches between mmol/L and mg/dL
   - Logout button clears OAuth and admin sessions
   - Page returns to LoginView after logout

6. **Dashboard & Analytics Features** (5 tests)
   - Stats cards display current month averages and total reading count
   - PERIOD dropdown enables filtering data view by calendar month
   - Ambulatory Glucose Profile (AGP) tab renders time-series trend chart
   - Help button (?) opens comprehensive user guide modal
   - Export/Import buttons provide data backup and recovery workflows

**Total: 26 end-to-end test scenarios**

## Running Tests

### In the UI (Interactive)

1. Start the dev server:
   ```bash
   pnpm run dev
   ```

2. Navigate to the app at `http://localhost:3000`

3. Click the **E2E Test** tab

4. Click **Run Full Test Suite** button

5. Watch each test run with visual mockups of each state

### Capturing Real Screenshots (Playwright)

To capture actual browser screenshots of all test scenarios:

```bash
# Start dev server in one terminal
pnpm run dev

# In another terminal, capture screenshots
pnpm run test:e2e:screenshots
```

This will:
- Launch a headless Chromium browser
- Navigate through the app
- Capture real screenshots of each UI state
- Save screenshots to `public/screenshots/e2e/`
- Generate a `manifest.json` with screenshot metadata

### Screenshot Output

Screenshots are saved as PNG files in `public/screenshots/e2e/`:

```
public/screenshots/e2e/
├── oauth-login-view.png
├── oauth-authenticated.png
├── admin-modal.png
├── admin-success.png
├── scanning-progress.png
├── scan-complete.png
├── data-manual-entry-modal.png
├── dashboard-stats-overview.png
├── dashboard-month-selector.png
├── dashboard-agp-graph.png
├── dashboard-help-guide.png
├── dashboard-export-import.png
├── theme-high-contrast.png
├── theme-unit-switch.png
└── manifest.json
```

## Test Architecture

### Mock Screenshots (UI Visualization)

The test UI uses mock screenshots generated in `src/components/test/MockScreenshot.tsx`. These are **visual representations** of each test state to help understand what's being tested.

### Real Screenshots (Playwright)

The capture script in `scripts/capture-screenshots.ts` uses **Playwright** to:
1. Launch a headless browser
2. Navigate to the running app
3. Interact with UI elements (click buttons, fill forms, etc.)
4. Capture real screenshots of the browser viewport
5. Save to disk and generate manifest

## Key Features Tested

### ✅ Authentication
- OAuth 2.0 Google Sign-In integration
- Patient name auto-population from Google profile
- Admin password gate with audit logging
- Dual-auth logout (OAuth + local session)

### ✅ Data Management
- Manual entry of glucose readings (6 time points per day)
- AI-powered image scanning with Gemini API
- IndexedDB persistence
- Export/import JSON backups

### ✅ Analytics & Visualization
- Stats cards (Average Fasting, Post-Meal, Total Readings)
- Month selector for time-based filtering
- Ambulatory Glucose Profile (AGP) trend chart
- Color-coded reading ranges (Green/Blue/Red)

### ✅ Accessibility
- High contrast theme toggle
- Unit conversion (mmol/L ↔ mg/dL)
- Keyboard navigation
- Screen reader support

### ✅ User Guidance
- Comprehensive help modal with instructions
- Color legend explanation
- Quick tips for data entry
- Print report workflow

## Troubleshooting

### Screenshots not being captured
- Ensure dev server is running on `http://localhost:5173`
- Check that the app loads successfully before running screenshot capture
- Verify Playwright is installed: `npm list @playwright/test`

### Tests failing in UI
- Clear IndexedDB: Open DevTools → Storage → IndexedDB → Clear
- Refresh the page with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check browser console for errors

### Playwright version mismatch
```bash
# Reinstall Playwright browsers
npx playwright install chromium
```

## CI/CD Integration

To integrate E2E testing into CI/CD:

```yaml
# .github/workflows/e2e-test.yml
- name: Install dependencies
  run: pnpm install

- name: Build app
  run: pnpm run build

- name: Start server
  run: pnpm run dev &

- name: Capture E2E screenshots
  run: pnpm run test:e2e:screenshots

- name: Upload artifacts
  uses: actions/upload-artifact@v3
  with:
    name: e2e-screenshots
    path: public/screenshots/e2e/
```

## Next Steps

1. Extend test coverage to edge cases (empty state, errors, etc.)
2. Add visual regression testing with Playwright
3. Implement performance benchmarks
4. Add mobile viewport testing
5. Integrate with Percy or Chromatic for visual diff monitoring

---

*Last updated: May 2026 — Daniel Frempong Twum / TUC ICT*
