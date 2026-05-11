# SEND Platform - Administrator Guide
**Version:** 1.0.0  
**Date:** 2026-03-02  

## 1. Getting Started
### 1.1 Accessing the Console
Navigate to the root URL of the deployed application. You will be redirected to the Login page.
*   **Default URL**: `http://localhost:3000/` (dev) or your production domain.
*   **Credentials**:
    *   Username: `admin`
    *   Password: `password`

### 1.2 Dashboard Overview
The Dashboard provides a high-level view of the system's health:
*   **Active Jobs**: Number of reports currently scheduled to run.
*   **Execution Trends**: 7-day bar chart showing Success vs. Failure rates.
*   **Recent Executions**: Table of the last 5 report runs.

## 2. Job Management
### 2.1 Creating a New Job
1.  Navigate to **Report Jobs** via the sidebar.
2.  Click the **+ New Job** button in the top right.
3.  Fill in the Job Name and Output Format.
4.  Click **Create Job**.

### 2.2 Editing a Job
1.  Click the "Edit" (pencil) icon on any job row.
2.  **JSON Definition**: Modify the query logic or template path directly in the JSON editor.
3.  **Schedule**: Update the Cron expression.
4.  **Delivery Targets**: Add or remove Email/SharePoint destinations.
5.  Click **Save Changes** (Note: In this version, changes are not persisted to a backend).

## 3. System Administration
The **Admin Console** section in the sidebar is restricted to users with `ADMIN` role.

### 3.1 API Gateway
Manage the virtual routing of requests to backend microservices.
*   **Routes**: View active paths and upstream services.
*   **Global Policy**: Toggle "Rate Limiting" on/off to protect the system during high load.
*   **Maintenance**: Enable "Maintenance Mode" to reject non-admin traffic.

### 3.2 Diagnostics
View the health status of internal components and external dependencies.
*   **Component Health**: Status of microservices (Scheduler, Notification, etc.).
*   **Connectivity**: Ping status for Database, SMTP, and SharePoint.

### 3.3 Database Monitor
Real-time view of the database performance.
*   **Active Connections**: Current load on the DB.
*   **Slow Queries**: Log of SQL queries taking >500ms.

### 3.4 Logs
Centralized Audit Log viewer.
*   Tracks Login/Logout events.
*   Tracks Configuration changes.
*   Use the **Refresh** button to load the latest events.

### 3.5 Testing Framework
Interactive tool for verifying system integrity.
*   **Integration Tests**: Validates client-side data structures.
*   **E2E Scenarios**: Runs simulated user journeys (using Playwright logic) to verify workflows like "Login", "Create Job", "Diagnostics", and "Theme Toggling".
*   **Reporting**: Download test results as PDF (simulated).

## 4. Accessibility & Theming
### 4.1 Theme Selection
The platform supports three visual modes:
*   **Light**: Default day mode.
*   **Dark**: Low-light mode for reduced eye strain.
*   **High Contrast**: Strict black/white/yellow palette for maximum visibility (WCAG AAA targeted).

### 4.2 Accessibility Features
*   **Screen Readers**: All interactive elements have ARIA labels.
*   **Keyboard Navigation**: Full support for Tab/Enter/Space navigation.

