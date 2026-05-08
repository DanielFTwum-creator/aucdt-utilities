# Administrator Guide

## 1. Introduction
This guide provides instructions for administrators of the Compliance Workflow Dashboard, including the management of the Bulletproof Directive framework.

## 2. Accessing the Admin Panel
- Access the Admin Panel via the lock icon in the main application.
- Authenticate using the configured `ADMIN_PASSWORD` (default: `admin123`).

## 3. Admin Modules
- **Dashboard**: Provides a security overview and system status.
- **Diagnostics**: Run the self-testing suite and Puppeteer tests.
- **Gap Analysis**: View the current SRS vs. Implementation gap analysis.
- **Audit Logs**: Review recorded admin actions.
- **RSS Management**: Trigger manual SRS auto-regeneration and monitor Recursive State Synchronisation (RSS) loop status.
- **Directive Control**: Manage directive-based constraint strings and multi-agent triad roles.

## 4. Requirements
- This application requires React 19.2.5.
- Gemini API key must be configured for AI-assisted operations.
