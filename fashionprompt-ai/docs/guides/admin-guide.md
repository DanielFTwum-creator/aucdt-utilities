# Administrator Guide

## Access
The Admin Panel is accessible via the "Admin" tab in the main navigation bar.
**Default Credentials:**
- Password: `admin123`

## Features
### Audit Logging
The system automatically records the following events:
- System Initialization (`SYSTEM_INIT`)
- Prompt Generation (`GENERATE_PROMPT`)
- Admin Login Attempts (`ADMIN_LOGIN_SUCCESS` / `ADMIN_LOGIN_FAIL`)

Logs are displayed in a live table view within the Admin Panel. They are currently stored in session memory and will reset on page reload.

## Troubleshooting
If logs are not appearing, ensure that you have successfully authenticated.
