# Administrator Guide - TUC Blueprint OS

## 1. Introduction
This guide provides instructions for the administration and oversight of the TUC Blueprint OS system. It is intended for ICT personnel at Techbridge University College.

## 2. Accessing the Admin Section
The Admin Section is a secure area of the application restricted by password authentication.

### Steps to Login:
1. Click the **ICT Gatekeeper** lock icon in the sidebar.
2. Enter the system password (Default: `TUC-REFRESH-2024`).
3. Click **Authenticate**.

## 3. Monitoring Audit Logs
The Audit Logging system captures all critical administrative and user actions.

### Log Categories:
* **Security:** Login/Logout attempts, authentication failures.
* **System:** Deployment triggers, test runs, code exports.
* **User:** Theme changes, project renaming.

### Interpreting Logs:
Each log entry includes:
* **Level:** Colour-coded by importance (Green for User, Blue for System, Red for Security).
* **Timestamp:** Date and time of the event.
* **Details:** A descriptive summary of the action performed.

## 4. System Health
The **ICT System Oversight** panel provides real-time health data fetched from the backend API.
* **Online Status:** Indicates services are reachable.
* **Uptime:** Current server heartbeat.
* **Services:** Status of Database, Storage, and Authentication modules.

## 5. Troubleshooting
* **Authentication Failure:** Ensure CAPS LOCK is off. If the password is lost, consult the lead developer to reset the environment variable.
* **Logs Not Appearing:** Verify the backend server is running and the `/api/health` check is returning an "Operational" status.
