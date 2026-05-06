# Administrator Guide - DIALED

## Overview
The Administrative Console is a secure portal for system diagnostics, theme management, and security auditing.

## Accessing the Console
1. Navigate to the **Intro Screen**.
2. Click the version tag in the lower-left corner (`v3.1.0`).
3. If not already signed in with the Master Admin email (`daniel.twum@techbridge.edu.gh`), access will be denied.
4. Enter the **System Key**: `TUC_ADMIN_2026`.

## Sections

### 1. System Tab
- **Theme Engine**: Switch between Light, Dark, and High-Contrast modes globally.
- **Active Session**: View current user UID and Provider details.
- **Cloud Status**: Real-time operational status of the Firebase connection.

### 2. Testing Tab
- **E2E Suite**: Execute a simulated Playwright test cycle.
- **Visual Assurance**: Gallery of programmatically captured screenshots.

### 3. Logs Tab
- **Audit trail**: Real-time view of all administrative actions.
- **Columns**: Timestamp, Action, User Email, and UID.

## Security Protocols
- Administrative privileges are hardcoded in `AdminPanel.tsx` (Master Email) and `firestore.rules` (isAdmin helper).
- Any attempt to access restricted routes is logged in the `admin_logs` collection.
