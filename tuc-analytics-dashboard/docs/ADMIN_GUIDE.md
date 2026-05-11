# AUCDT Analytics Dashboard - Admin Guide

**Document Version:** 1.0  
**Last Updated:** January 15, 2026  
**Audience:** System Administrators, Technical Leads

## Table of Contents

1. [Overview](#overview)
2. [Admin Panel Access](#admin-panel-access)
3. [User Management](#user-management)
4. [Audit Logging](#audit-logging)
5. [System Configuration](#system-configuration)
6. [Maintenance Operations](#maintenance-operations)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

---

## Overview

The AUCDT Analytics Dashboard Admin Panel provides centralized management capabilities for system administrators. The admin interface allows monitoring of system health, management of administrative users, and review of audit logs.

### Admin Panel Features

- **User Management:** Create, modify, and delete admin users
- **Audit Logging:** View and analyze system activity logs
- **Configuration:** Manage system settings and preferences
- **Monitoring:** Track system health and performance
- **Data Export:** Export logs for compliance and analysis

---

## Admin Panel Access

### Accessing the Admin Panel

1. **Open Dashboard:** Navigate to the AUCDT Analytics Dashboard application
2. **Locate Admin Button:** Click the "Admin" button in the top-right header (lock icon)
3. **Enter Password:** The default admin password is `admin123` (change immediately in production)
4. **Authenticate:** Click "Authenticate" to access the admin panel

### Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change the default password immediately after first login!

### Session Management

- Admin sessions are maintained for the current browser session
- Closing the browser or clicking "Logout" terminates the session
- Session timeout: No automatic timeout (manual logout only)

---

## User Management

### View Admin Users

The Users tab displays all registered administrative users with the following information:

- **Username:** User's login identifier
- **Email:** User's email address
- **Role:** Either "admin" or "moderator"
- **Last Login:** Timestamp of most recent login
- **Actions:** Remove user button

### Add a New Admin User

*Note: User creation interface is prepared in the Admin Panel. Currently requires manual database entry for production.*

To add a new admin user (production environments):

1. Navigate to Admin Panel > Users tab
2. Click "Add User" button (when available)
3. Enter username (must be unique)
4. Enter email address
5. Select role: "admin" (full access) or "moderator" (limited access)
6. Click "Create User"
7. New user will receive temporary password via email

### Manage User Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, user management, audit log access, configuration changes |
| **moderator** | Dashboard viewing, report generation, limited audit log access |

### Remove a User

1. Navigate to Admin Panel > Users tab
2. Locate the user to remove
3. Click "Remove" button
4. Confirm removal
5. User account is deactivated and cannot log in

⚠️ **Note:** At least one admin user must exist. You cannot remove the last admin account.

---

## Audit Logging

### Understanding Audit Logs

Every administrative action is logged with the following details:

- **Action:** Type of action performed (login, user_created, config_changed, etc.)
- **User ID:** ID of the admin who performed the action
- **Timestamp:** ISO 8601 formatted date and time
- **Status:** Success, failure, or warning
- **Details:** Specific information about the action
- **IP Address:** Source IP of the request (localhost in development)

### View Audit Logs

1. Navigate to Admin Panel > Logs tab
2. Logs are displayed in reverse chronological order (newest first)
3. Each log entry shows:
   - Action name
   - Description of what was done
   - Timestamp
   - Status badge (success/failure/warning)

### Filter Audit Logs

Current version shows all logs. To search for specific logs:

- Look for action name in the log entry
- Use browser search (Ctrl+F / Cmd+F) to find specific terms
- Logs can be exported for analysis

### Export Audit Logs

1. Navigate to Admin Panel > Logs tab
2. Click "Export Logs" button (when logs are present)
3. Choose format:
   - **JSON:** Structured format for programmatic analysis
   - **CSV:** Spreadsheet-compatible format
4. File is automatically downloaded to your computer

### Log Retention Policy

- **Storage Location:** Browser LocalStorage and IndexedDB
- **Maximum Logs:** 10,000 entries
- **Retention Period:** 90 days (in production)
- **Manual Cleanup:** Admins can clear logs from Admin Panel > Logs

### Clear Audit Logs

⚠️ **CAUTION:** This action is irreversible.

1. Navigate to Admin Panel > Logs tab
2. Click "Clear Logs" button
3. Confirm the action
4. All audit logs are permanently deleted
5. A new log entry records the clear action

---

## System Configuration

### System Settings

Access system configuration from Admin Panel > Settings tab.

#### Available Settings

1. **Data Export:**
   - Export current system configuration
   - Creates backup of system state
   - Useful for disaster recovery

2. **System Maintenance:**
   - **Refresh Cache:** Clears in-memory caches and reloads data
   - Forces fresh data load from sources
   - Useful when data has been updated externally

### Configuration Files

System configuration is stored in:

```
localStorage.getItem('aucdt-theme')        // Theme preference
localStorage.getItem('aucdt-audit-logs')   // Audit log data
localStorage.getItem('aucdt-admin-users')  // Admin user data
```

### Backup & Recovery

To backup your configuration:

1. Admin Panel > Settings > "Export Configuration"
2. Save the exported file safely
3. For recovery, contact system administrator

---

## Maintenance Operations

### Regular Maintenance Tasks

#### Daily
- Monitor audit logs for suspicious activity
- Check system status indicators

#### Weekly
- Review user access patterns
- Verify all admin functions are working
- Check for data consistency issues

#### Monthly
- Export and archive audit logs
- Review access patterns and permissions
- Update security settings if needed

#### Quarterly
- Full system backup
- Security audit
- User access review
- Performance analysis

### Cache Refresh

To refresh system caches:

1. Admin Panel > Settings tab
2. Click "Refresh Cache" button
3. System clears all caches and reloads data
4. This may take a few seconds
5. Action is logged in audit logs

### Data Validation

Monitor the Dashboard Overview to verify:

- All data files are loading correctly
- Charts are rendering properly
- Export functionality is working
- No error messages in console

---

## Troubleshooting

### Common Issues

#### Issue: Cannot Access Admin Panel

**Symptoms:** Admin button not visible or login fails

**Solutions:**
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Check browser console for errors (F12)
4. Verify admin password is correct
5. Try a different browser

#### Issue: Audit Logs Growing Too Large

**Symptoms:** Slow dashboard performance, audit log storage warnings

**Solutions:**
1. Export logs for archival
2. Clear old logs (Admin Panel > Logs > "Clear Logs")
3. Check browser storage quota (Settings > Privacy)
4. Consider reducing log retention period

#### Issue: Users Cannot Log In

**Symptoms:** Valid credentials rejected

**Solutions:**
1. Verify user exists (Users tab)
2. Check user is not deactivated
3. Clear user's browser cache
4. Verify user role has correct permissions
5. Check audit logs for failed login attempts

#### Issue: Data Export Fails

**Symptoms:** Export button doesn't work or file doesn't download

**Solutions:**
1. Check browser download settings
2. Verify sufficient disk space
3. Try different export format
4. Check for browser privacy restrictions
5. Try different browser

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid password" | Wrong admin password entered | Verify password and try again |
| "Storage quota exceeded" | Browser localStorage is full | Export and clear old logs |
| "Export failed" | Browser restriction or file system issue | Check browser settings, try different format |
| "User creation failed" | Username already exists | Choose a unique username |

---

## Security Best Practices

### Access Control

1. **Change Default Password Immediately**
   - Default password is `admin123`
   - Create strong, unique password
   - Minimum 12 characters recommended
   - Include uppercase, lowercase, numbers, symbols

2. **Limit Admin Access**
   - Only create admin accounts for trusted users
   - Use moderator role for limited access
   - Regularly review admin user list
   - Remove inactive accounts

3. **Monitor Login Activity**
   - Review audit logs for unusual login patterns
   - Watch for multiple failed login attempts
   - Check for logins from unexpected times

### Audit Log Security

1. **Regular Exports**
   - Export logs regularly for archival
   - Store exports in secure location
   - Maintain offline backups

2. **Log Protection**
   - Don't share audit logs with unauthorized users
   - Treat logs as sensitive security information
   - Review logs for potential breaches

3. **Log Integrity**
   - Don't edit audit logs directly
   - Use "Clear Logs" for cleanup, not manual deletion
   - Verify log consistency regularly

### Session Security

1. **Logout After Use**
   - Always logout when finished
   - Don't leave admin panel open unattended
   - Close browser after admin tasks

2. **Secure Workstations**
   - Use admin panel only on secure, trusted computers
   - Avoid public WiFi for admin access
   - Keep OS and browser updated with security patches

3. **Browser Security**
   - Enable browser security features
   - Use password manager for strong passwords
   - Consider hardware security key for extra protection

### Data Protection

1. **Anonymization**
   - All exported data maintains k-anonymity (k≥5)
   - PII is never exposed in admin panel
   - Demographic data is aggregated

2. **Compliance**
   - GDPR-compliant data handling
   - Privacy policies enforced
   - Data retention limits respected

---

## Support & Escalation

For admin-related issues:

1. **Check Audit Logs** - See what happened when
2. **Review Documentation** - This guide and the main README
3. **Restart Application** - Close browser and reload
4. **Contact System Administrator** - For production issues
5. **Emergency Support** - For security incidents

---

**Document End**

---

**Version Control:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial admin guide |

**Next Review:** Q2 2026
