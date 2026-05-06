# Testing Guide

## 1. Diagnostic Suite
- Access via `/admin/diagnostics`.
- Execute comprehensive system checks, including RSS loop status and directive constraint enforcement validation.

## 2. Puppeteer Self-Test
- Access via `/admin/testing` (Puppeteer tab).
- Run automated E2E tests for critical user journeys.
- Capture screenshots for verification and audit logging.

## 3. QA Harness Integration
- The QA Harness automatically validates generated code against the SRS at each phase boundary.
- Review QA logs in the Admin Panel for detailed validation results.

## 4. Requirements
- This application requires React 19.2.4.
- Playwright/Puppeteer must be configured in the environment.
