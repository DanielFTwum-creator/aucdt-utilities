# TechBridge University College - Admin Guide

## Overview
The Admin Portal is a secure, authenticated section of the Retrospective Archive application designed for system administrators and curators. It provides diagnostic tools, performance monitoring, and audit logging.

## Accessing the Portal
1. Navigate to `/#/admin` in your browser.
2. Enter the administrative password (`admin123` by default for the prototype).
3. Upon successful authentication, you will be redirected to the Admin Dashboard.

## Dashboard Features

### 1. Dashboard (`/admin`)
Provides a high-level overview of the system:
- **Stat Cards**: Displays total pieces, active enquiries, and system health.
- **Recent Audit Logs**: A quick view of the 5 most recent administrative actions.

### 2. System Diagnostics (`/admin/diagnostics`)
Displays critical environment and client information:
- **Environment**: React version, Vite version, Tailwind version.
- **Client Info**: User Agent, Screen Resolution, Viewport size, and Language.

### 3. Database Monitor (`/admin/db-monitor`)
Simulates database monitoring (currently hooked to LocalStorage/Context):
- Connection status and average latency.
- Recent queries executed by the application.

### 4. Test Suites (`/admin/testing`)
An interactive dashboard for running End-to-End (E2E) tests:
- Click **Run All Tests** to execute the Playwright test suite.
- View real-time status, duration, and pass rates for core user flows.

### 5. Logs Viewer (`/admin/logs`)
A comprehensive table of all administrative actions:
- Tracks logins, logouts, theme changes, and test executions.
- Displays timestamp, user, and the specific action taken.

### 6. Performance Metrics (`/admin/performance`)
Monitors frontend performance:
- First Contentful Paint (FCP) and Time to Interactive (TTI).
- Resource load times for JS bundles, CSS, and Hero Images.

## Theme Management
Administrators can toggle the application theme directly from the sidebar:
- **Light Theme**: Standard light mode.
- **Dark Theme**: Deep ink black (`#0F0C07`) editorial mode.
- **High Contrast**: Enhanced visibility mode for accessibility compliance.
