
# Administrator Guide
**Project**: TVET Assessment Progress Dashboard  
**Version**: 2.0 (Phase 4)

## 1. System Access
The Administration Panel is a restricted area designed for system configuration, health monitoring, and audit tracking.

### 1.1 Login Procedure
1. Navigate to the main dashboard.
2. Click the **Lock Icon** 🔒 in the top-right header toolbar.
3. Enter the System Access Key.
   - **Default Key**: `admin123`
4. Upon successful authentication, you will be redirected to the Admin Panel.

### 1.2 Access Levels
- **Dashboard View**: Public read-only access (via URL).
- **Admin View**: Full access to raw data, logs, and test suites.

## 2. Admin Panel Features

### 2.1 Interface Themes
The system supports three distinct visual themes, selectable via the Admin Panel:
- **Dark (Default)**: Optimized for low-light environments (Slate/Emerald).
- **Light**: High-brightness mode for print or daylight use (White/Slate).
- **Contrast**: Accessibility-focused mode (Black/Yellow).

### 2.2 Live Diagnostics
The "Live Diagnostics" window displays the raw JSON state of the application in real-time. This includes:
- `meta`: Application build version.
- `appState`: Current configuration values.
- `calculatedStats`: Derived metrics used for charting.

### 2.3 Audit Trail
Every state change in the application is recorded in the Audit Log.
- **Timestamp**: Exact time of action (ISO format).
- **Action**: Type of event (e.g., `UPDATE`, `AUTH`, `TEST`).
- **Details**: Specific values changed or messages generated.
- *Note: The Audit Log is ephemeral and resets on page reload.*

## 3. Configuration Management
Configuration changes are made via the "Config" button on the main dashboard, but results are monitored in the Admin Panel.
- **Total Scope**: Total number of units.
- **Completed**: Currently finished units.
- **Date/Target**: Baseline metrics for velocity calculation.
- **Logo/Title**: Branding elements.

## 4. Troubleshooting
**Issue**: Application state is inconsistent.  
**Resolution**:
1. Check "Live Diagnostics" for `NaN` or `null` values.
2. Use the **Reset** button (Refresh Icon) on the main dashboard to restore factory defaults.
3. Verify the URL hash contains valid parameters.
