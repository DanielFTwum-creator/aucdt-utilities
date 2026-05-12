# Testing Guide - TUC Blueprint OS

## 1. Overview
The TUC Blueprint OS includes a hybrid testing strategy:
1. **Internal Health Probes:** Real-time diagnostics of backend services.
2. **Automated E2E Tests:** Playwright suite for critical user journeys.
3. **Interactive Test Tab:** UI-triggered verification with screenshot evidence.

## 2. Running Automated Tests
The Playwright suite is located in `/tests/e2e`.

### From the Command Line:
```bash
npx playwright test
```

### From the UI:
1. Access the **System Verification** tab in the sidebar.
2. Click **Run All Tests**.
3. Observe real-time pass/fail status and the generated **Capture Manifest** (screenshot).

## 3. Test Cases Covered
| ID | Title | Description |
|---|---|---|
| CUJ-01 | Admin Authentication | Verifies password protection on the ICT Oversight panel. |
| CUJ-02 | Theme Persistence | Ensures theme choices survive hard reloads. |
| CUJ-03 | Audit Logging | Confirms that user actions are correctly recorded. |
| CUJ-04 | A11y Standards | Checks for ARIA compliance and keyboard navigation. |

## 4. Artifacts
* **Screenshots:** Captured on test completion/failure and displayed in the UI.
* **Trace Logs:** Detailed browser traces for debugging (found in `test-results/`).
