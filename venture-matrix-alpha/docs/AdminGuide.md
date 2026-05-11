# Admin Guide - Venture Matrix Alpha

## Overview
The Admin interface is accessible via `/admin`. It provides real-time diagnostics of the system's neural architecture and venture data integrity.

## Accessing Diagnostics
1. Navigate to `/admin/diagnostics`.
2. View system load, API health, and data persistence status.

## Testing Suite
The testing dashboard at `/admin/testing` allows manual trigger of Playwright test runners and screenshot capture for visual regression.

## Security
Administrative routes are protected by the system's core security middleware. Unauthorized access attempts are logged and blocked.
