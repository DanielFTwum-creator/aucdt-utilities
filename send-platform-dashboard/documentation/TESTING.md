# Testing Guide
**Project:** SEND Platform Admin Console  

## 1. Overview
The application includes a built-in **Testing Framework** accessible via the Admin Console (`/admin/testing`). This allows operators to verify system integrity without external CI/CD tools during the "Middle Tier" development phase.

## 2. Accessing Tests
1.  Log in as `admin`.
2.  Navigate to **Test Suites** in the sidebar.

## 3. Test Types

### 3.1 Unit & Integration
These tests verify the internal consistency of the application's data structures and mock services.
*   **Validate Job Schema**: Checks if all Job objects in memory match the `ReportJob` interface.
*   **Gateway Route Integrity**: Ensures API Gateway routes point to valid upstream services.
*   **Mock Data Consistency**: Verifies foreign key relationships (e.g., Job ID in Schedule matches an existing Job).

**To Run:**
1.  Select the **Unit & Integration** tab.
2.  Click the **Play** button next to a test case.
3.  Result (PASS/FAIL) appears instantly.

### 3.2 E2E Scenarios (Playwright Simulation)
This module simulates End-to-End user journeys using a Playwright-like syntax. Note that in this client-side environment, these are *simulations* that visualize how the test would execute.

**Available Scenarios:**
*   **E2E-001: Admin Login Flow**: Simulates typing credentials and verifying dashboard redirection.
*   **E2E-002: Create New Job**: Simulates form filling and submission.
*   **E2E-003: API Gateway Rate Limit**: Simulates toggling a switch in the admin settings.
*   **E2E-004: Verify Diagnostics**: Verifies that all system health checks are visible.
*   **E2E-005: Theme Toggle Accessibility**: Verifies switching between Light, Dark, and High-Contrast modes.

**To Run:**
1.  Select the **E2E Scenarios** tab.
2.  Choose a scenario from the left list.
3.  Review the **Source Code** in the bottom panel.
4.  Click **Run Scenario**.
5.  Watch the **Execution Console** for step-by-step logs.
6.  View the **Test Result** and generated screenshot (mocked).
7.  Click **Report** to download the test results (simulated).

## 4. Adding New Tests
To add new E2E scenarios, developers must modify `services/playwrightScenarios.ts`.
Structure:
```typescript
{
  id: 'E2E-XXX',
  name: 'Test Name',
  code: `...playwright script...`,
  steps: [ ...metadata for UI visualization... ]
}
```
