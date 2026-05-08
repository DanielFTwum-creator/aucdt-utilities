# Administrator Guide: University Fees Dashboard
**Project:** Ghana University Fees (v3.0.0)
**Core Requirement:** Strict React 19.2.5 Production Build

## 1. Overview
The Ghana University Fees Dashboard is an institutional tool for comparative tuition analysis and financial transparency. It provides high-fidelity visualizations of academic costing across the public and private sectors.

## 2. Refresh Protocol Monitoring
- **Access**: Click the "Refresh Protocol" toggle in the application header.
- **Phases**: Monitor the 5-phase sequential refinement of the application core.
- **Institutional Standard**: All updates must maintain the React 19.2.5 mandate and zero-broken-link policy.

## 3. Data Context Management
- **Category Selection**: Toggle between Undergraduate, International, and Postgraduate views using the segmented control.
- **Institutional Audit**: All view transitions and filter changes are recorded in the persistent activity stream (`AuditService`).
- **Boardroom Mode**: Use the high-contrast theme for financial committee presentations to ensure maximum data legibility.

## 4. Audit Trail
Review the institutional audit trails in the browser console (accessible via IT staff portal) to monitor all `UI_NAV` and `DATA_FILTER` events. Logs are persisted via `localStorage` for cross-session durability.

## 5. Troubleshooting
If charts fail to render:
1. Verify the integrity of the institutional `FeeData` JSON schema.
2. Ensure the client browser supports modern SVG and Recharts 3.5+ rendering.
3. Confirm that the React 19.2.5 environment is correctly initialized.
