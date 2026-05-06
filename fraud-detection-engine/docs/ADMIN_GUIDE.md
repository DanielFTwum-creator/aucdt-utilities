# Fraud Detection Engine — Administrator Guide

## Overview
This document outlines the administrative functionalities, diagnostic tools, and security mechanisms built into the Fraud Detection Engine (App ID 137). The platform strictly adheres to Techbridge University College (TUC) institutional standards.

## 1. Accessing the Admin Console
- **URL**: `/#/login`
- **Default Credentials**: `admin` / `admin`
- **Protected Routes**: All `/#/admin/*` paths are client-side protected. Direct API hits require the correct session context (enforced via `/api/v1/admin/*` middleware in production).

## 2. Admin Capabilities

### System Diagnostics (`/#/admin/diagnostics`)
The Diagnostics panel provides real-time oversight of the underlying Node.js environment.
- **Server Uptime**: Time since last Node.js process boot.
- **Memory Profiling**: Resident Set Size (RSS), Heap Used, and External Memory allocations.
- **Process Info**: Node version, process ID, and architecture.

### Database Monitor (`/#/admin/db-monitor`)
Tracks `better-sqlite3` instance health and table capacity.
- **Table Statistics**: Exact row counts for `entities`, `metrics`, `health_scores`, and `audit_logs`.
- **Database Size**: Physical file footprint of `fde.db`.
- **Live Query Views**: Most recently updated entities and metrics are displayed in real-time.

### Performance Analytics (`/#/admin/performance`)
Monitors the REST API gateway's response latency.
- **Endpoint Tracking**: Averages, Minimums, and Maximums (in ms) for all internal API calls.
- **Latency Spikes**: Automatically highlighted (Yellow > 50ms, Red > 100ms).
- **Chart**: An area chart visualizes the last 20 API request durations dynamically.

### Audit Logging (`/#/admin/logs`)
The central repository for institutional accountability.
- **Data Captured**: User identity, action taken, severity (info, warning, error), categorization, and timestamp.
- **Triggers**: Login events, diagnostic executions, alert acknowledgements, and Sentinel interventions.
- **Retention**: Logs are currently unbounded; production systems should implement a 90-day rolling partition.

### Automated Testing (`/#/admin/testing`)
Integration with the Playwright E2E automation suite.
- **Backend Diagnostics**: Executes 8 server-side integrity checks (DB connectivity, Memory usage, Endpoint routing).
- **E2E UI Suite**: Spawns a headless browser session to perform full DOM evaluations (Theme switching, Navigation, Dashboard rendering).

### Sentinel Console (`/#/admin/sentinel`)
The administrative bypass to the AI layer.
- **Simulation**: Trigger autonomous remediation routines artificially to test the orchestration stack without waiting for an actual failure condition.

## 3. Maintenance Procedures
- **Database Cleanup**: The `server.ts` process automatically prunes `metrics` and `health_scores` to 10,000 rows every 60 seconds to prevent SQLite bloat.
- **Audit Compliance**: Do not modify or truncate the `audit_logs` table manually. All access should be read-only via the Logs GUI.
