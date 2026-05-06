# Administrator Guide: AUCDT Strategic Dashboards

## Introduction
Welcome to the AUCDT Strategic Dashboard suite. These dashboards provide high-level visibility into institutional progress, risk assessment, and agent-driven monitoring.

## 🔐 Access Control
Both applications are protected by a two-layer authentication system:
1. **Dashboard Access**: Required to view any data. Default: `admin`.
2. **Administrative Access**: Required to view security logs and perform system diagnostics. Default: `admin`.

## ⚙️ Administration Panel
The Admin panel is found via:
- **TechBridge**: "Admin Settings" in the sidebar.
- **Sentinel Agent**: "Admin Settings" icon in the header.

### Key Management Tasks
- **Audit Review**: Periodically check the Security Audit Log for unauthorized access attempts (`DASHBOARD_ACCESS_FAIL`).
- **System Health**: Use the "System Health" tab to run diagnostic suites. If any test fails, contact the development team with the console log.
- **Theme Management**: Switch between Light, Dark, and Contrast modes via the sidebar or header controls to meet accessibility standards.

## 📋 Data Management
- Data is currently managed via simulated states for maximum performance.
- Any changes made in the UI (e.g., status updates) are persistent within the current browser session.
