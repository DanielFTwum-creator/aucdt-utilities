# Testing Guide

## Overview
DocuJudge includes a built-in synthetic testing suite accessible via the Admin Dashboard.

## Running Tests
1. Log in to the Admin Dashboard (`/admin`).
2. Navigate to **Testing Suite** (`/admin/testing`).
3. Click the **Run All Tests** button.

## Test Scope
The suite performs the following checks:
- **Unit Tests:** Verifies utility functions and score calculations.
- **Integration Tests:** Checks the flow between the Evaluation Form and the Summary Panel.
- **System Tests:** Simulates a full submission workflow (mocked).

## Adding New Tests
Tests are defined in `src/services/testRunner.ts`. To add a new test:
1. Open `src/services/testRunner.ts`.
2. Add a new test object to the `tests` array.
3. Ensure the test function returns a boolean indicating success/failure.

## Automated Testing (CI/CD)
For CI/CD pipelines, the test runner can be adapted to run in a headless Node.js environment using `pnpm exec ts-node` to execute the test logic directly.
