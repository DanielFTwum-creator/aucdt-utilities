# Administrator Guide
## AI Agent Masterclass Portal

### Accessing the Dashboard
1. Navigate to the application URL.
2. Append `#/admin` to the URL (e.g., `https://your-domain.com/#/admin`).
3. You will be presented with the secure login screen.

### Authentication
- **Default Credentials** (Demo Environment):
  - **Username**: `admin`
  - **Password**: `Password123!`
- The system uses a simulated JWT authentication flow. Session tokens are stored in `sessionStorage` and expire when the tab is closed.
- **Backend Proxy**: Email requests are proxied through a Node.js/Express server to prevent CORS issues.

### Dashboard Modules

#### 1. System Diagnostics
- **API Proxy**: Routes traffic to `portal.aucdt.edu.gh` through `/api/send-email`.
- **Client Environment**: Verifies React version (19.2.4) and browser compatibility.
- **Service Status**: Real-time status indicators for critical subsystems.

#### 2. Audit Logs
- Automatically records system events:
  - Login attempts (Success/Failure).
  - Test executions.
  - System checks.
- **Actions**:
  - **Refresh**: Reload logs from storage.
  - **Clear**: Purge all local logs (requires confirmation).

#### 3. Test Suite
- **Connectivity Test**: Verifies API endpoint reachability.
- **Theme Stability**: Checks persistence of theme settings.
- **Log Integrity**: Validates JSON structure of audit logs.
- **Visual Snapshot**: Triggers a browser-level print/PDF capture of the current state for visual regression archiving.

#### 4. Performance
- Monitors memory usage (if supported by browser), load times, and animation frame rates.

### Troubleshooting
- **Login Loop**: Ensure cookies/storage are enabled in your browser.
- **API Errors**: Check the 'Connectivity' status in Diagnostics. If offline, contact IT Support.
