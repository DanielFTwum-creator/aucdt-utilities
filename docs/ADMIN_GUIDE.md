# 🎓 Techbridge University College - Admin Guide

## Overview
This guide covers administrative actions for the TUC Utilities suite, including managing Admin UIs, viewing audit logs, and running diagnostics.

## Admin Access
Every frontend application includes a hidden Admin section accessible via the `#/admin` route.
- **Default Password:** `admin2024` (Note: In production, this should be managed via central Auth API)

## Backend Admin UIs
Each of the 16 backend services now serves a dedicated Admin Dashboard at its root URL (`/`).
- **Health Check:** `/health`
- **Auth Status:** `/api/auth/me`

## Audit Logging
Administrative actions are logged via the `AuditLogger` service.
- **Storage:** Logs are currently stored in `localStorage` for frontend apps and logged to `stdout` for backend services.
- **Viewing Logs:** Open the Admin Panel (`#/admin`) and navigate to the "Audit Logs" tab.

## System Diagnostics
The Admin Panel includes a "System Test" tab to verify:
- API connectivity
- Database latency (where applicable)
- Resource availability

---
*Last Updated: March 11, 2026*
