# Rophe RPMS: Clinical Integrity Testing Guide

## 1. Automated Integration Suite
The **Self-Test** tab contains a custom-built Playwright-style test runner designed for internal validation.

### Execution Procedure:
1. Click **Run Integration Suite**.
2. **Status Colors:**
   - <span style="color: #10b981;">Emerald</span>: Pass.
   - <span style="color: #f43f5e;">Rose</span>: Fail (check XHR Monitor logs).
   - <span style="color: #3b82f6;">Indigo</span>: Execution in progress.

### Automated Test Definitions:
- **Registry Flow:** Tests data binding and persistence across views.
- **Security Check:** Validates passphrase logic and access control gates.
- **AI Handshake:** Simulates a real symptom analysis to verify model responsiveness.

## 2. Manual User Acceptance Testing (UAT)
Physicians and Admins should perform these manual checks weekly:

| Scenario | Expected Result |
| :--- | :--- |
| **New Encounter** | Clinical notes area should auto-save drafts every 60s. |
| **Alert Trigger** | Entering BP 190/110 should show a **CRITICAL** red flag in the Dashboard. |
| **Video Latency** | Remote stream should initialize within 3 seconds of joining. |
| **Diagnosis Parsing** | AI should suggest at least 3 ICD-10 codes for complex complaints. |

## 3. Accessibility Audit (WCAG 2.1)
- **High Contrast Mode:** Verify that all text remains readable and focus indicators are visible with 4px borders.
- **Screen Readers:** Navigate via keyboard (Tab/Shift+Tab) and ensure `ARIA-label` attributes provide sufficient context for all clinical icons.

## 4. Recovery Testing
- **Offline Mode:** Disconnect network during an AI analysis. Verify that a "gracefully degraded" response is provided instead of a UI crash.