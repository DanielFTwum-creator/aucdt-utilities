# Testing Guide - Container Health Auditor (App ID 110)

## 1. Overview
This guide covers the testing strategy for CHA-110, including Unit, Integration, and E2E tests.

## 2. Automated Test Suite
The application includes a built-in test runner accessible at `/admin/testing`.

### Running Tests
1. Navigate to **Admin > Testing**.
2. Click **Run All Suites** to execute the full regression suite.
3. Individual tests can be run by clicking the **Play** button next to each test case.

### Test Categories
- **Unit Tests**: Validate individual components (Metrics Collector, Health Scorer).
- **Integration Tests**: Verify database persistence and API endpoints.
- **E2E Tests**: Simulate user interactions with the Dashboard and Charts.
- **Security Tests**: Validate authentication and role-based access control.

## 3. Manual Testing Checklist

### Dashboard
- [ ] Verify total container count matches expected value (109+).
- [ ] Confirm charts render correctly and update in real-time.
- [ ] Check that "Critical Issues" list is populated correctly.

### Container Details
- [ ] Click "Details" on a container.
- [ ] Verify CPU/Memory charts load data.
- [ ] Confirm Prediction Panel appears for unhealthy containers.

### Admin Functions
- [ ] Log out and attempt to access `/admin`. Verify redirect to login.
- [ ] Log in with `admin/admin`. Verify access granted.
- [ ] Toggle Dark Mode and verify persistence across page reloads.

## 4. Evidence Capture
Use the **Capture Evidence** button in the Testing interface to simulate screenshot capture for compliance reporting. In a real CI/CD pipeline, this would trigger Playwright to save artifacts to S3.
