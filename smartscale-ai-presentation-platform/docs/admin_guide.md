
# SmartScale Platform: Administrator Command Center Guide

## 1. Overview
The Administrator Command Center is a secure, hidden layer within the SmartScale platform used for real-time monitoring, diagnostic testing, and accessibility management.

## 2. Authentication
- **Access Shortcut**: `CTRL + SHIFT + A`
- **Password**: `smartscale2025`
- **Security Policy**: Access tokens are stored in volatile session memory. Refreshing the browser will require re-authentication.

## 3. Tool Suites
### 3.1 Platform Experience (Settings)
- **Theme Management**: Seamlessly toggle between Light, Dark, and High-Contrast modes.
- **Session Telemetry**: Monitor real-time slide tracking and Gemini API heartbeats.

### 3.2 Secure Audit Ledger (Audit)
- **Activity Stream**: Tracks all significant interaction events with millisecond timestamps.
- **Data Privacy**: Audit logs are maintained locally and never transmitted to external databases.

### 3.3 System Diagnostics (Testing)
- **Connectivity Check**: Verifies the presence and validity of the Google AI Studio environment.
- **Integrity Report**: Returns pass/fail status for the platform's core dependency graph.

## 4. Emergency Procedures
In the event of an API failure, navigate to the **Testing** tab to verify the `API_KEY`. Ensure no corporate firewalls are blocking `generativelanguage.googleapis.com`.
