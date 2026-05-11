# TechBridge Clinical Platform - Administrator Guide

## 1. Introduction
This guide is intended for system administrators and clinical supervisors managing the TechBridge Clinical Platform. It covers access control, system diagnostics, testing, and data management.

## 2. Access & Authentication
### 2.1 Login
- **URL**: `/admin/login`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin`
- **Security Note**: All login attempts are logged in the Audit Trail.

### 2.2 Dashboard
Upon successful login, you are redirected to `/admin/dashboard`. This serves as the command center for system health and operations.

## 3. System Management
### 3.1 Diagnostics
- **URL**: `/admin/diagnostics`
- **Purpose**: Real-time health check of the Database and API endpoints.
- **Indicators**:
  - **Green**: Operational
  - **Red**: Critical Failure (Check server logs)

### 3.2 Audit Logs
- **URL**: `/admin/logs`
- **Purpose**: Review security-critical actions.
- **Logged Events**:
  - Admin Login
  - Patient Settings Updates
  - Data Imports
- **Retention**: Logs are stored permanently in the `audit_logs` table.

## 4. Testing Suite
- **URL**: `/admin/testing`
- **Tools**:
  - **Interactive Runner**: Click "Run E2E Suite" to execute Playwright tests.
  - **Live Console**: View real-time test execution logs.
  - **Screenshot Gallery**: Visual verification of test steps (Home, Theme, Settings, Login).
- **Requirement**: Tests require the server to be running on port 3000.

## 5. Data Operations
### 5.1 Export
- **Location**: Main Dashboard (Data Tools Bar)
- **Format**: CSV (`glucose-readings.csv`)
- **Fields**: Date, Time Slot, Value, Meal, Medication, Activity, Mood, Notes.

### 5.2 Import
- **Location**: Main Dashboard (Data Tools Bar)
- **Format**: JSON
- **Validation**: System checks for valid array structure before insertion.

### 5.3 Image Scanning
- **Location**: Main Dashboard -> "Scan Reading"
- **Technology**: Google Gemini 2.5 Flash (Vision)
- **Process**:
  1. Upload image of glucose meter.
  2. AI extracts numeric value.
  3. User confirms to save as "Random" reading.

## 6. Troubleshooting
- **Issue**: "Loading System..." stuck on screen.
  - **Fix**: Check `GEMINI_API_KEY` environment variable.
- **Issue**: Test suite fails.
  - **Fix**: Ensure no other process is blocking port 3000.
