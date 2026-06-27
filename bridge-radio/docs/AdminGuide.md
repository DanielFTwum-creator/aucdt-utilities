# Admin Guide - Bridge Radio

## Accessing the Admin Panel
1. Click the **Shield Icon** in the top right corner of the header.
2. Enter the Studio Password: `studio2026`.
3. Click **AUTHENTICATE**.

## Tabs Overview

### 1. Status
- **System Status**: Real-time monitoring of the HLS engine and Audio Context.
- **Sleep Timer**: Displays remaining time if active.
- **Feedback Logs**: View user feedback events in the Audit Trail.
- **Bandwidth**: Current stream bitrate in Mbps.
- **Data Source**: Indicates if the app is using `LIVE STREAM` or `MOCK FALLBACK`.

### 2. Playwright E2E Suite
- Run automated tests to verify:
  - Stream Initialization
  - Theme Switching
  - Audio Controls
  - Admin Security
  - Genre Navigation
- **Screenshot Capture**: Every test step captures a real-time screenshot of the application state.
- **Artifact Gallery**: View all captured screenshots in a dedicated grid.

### 3. Network Diagnostic
- Use this to troubleshoot 404 or 403 errors.
- Tests connectivity to the HLS manifests via the internal proxy.
- Provides detailed error messages if a fetch fails.

### 4. Audit Logs
- View the last 50 system events.
- Track theme changes, authentication attempts, and stream recovery actions.

## Troubleshooting
- If **Audio Context** is `PENDING`, click anywhere on the page to resume the context (browser security requirement).
- If **Data Source** is `MOCK FALLBACK`, check the **Network** tab to see if the remote servers are reachable.
