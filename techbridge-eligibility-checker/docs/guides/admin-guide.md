# Administrator Guide: Eligibility Checker
**Project:** TUC Eligibility Checker (v3.0.0)
**Core Requirement:** Strict React 19.2.4 Execution

## 1. Overview
The Staff Portal (`#/admin`) is the administrative hub for monitoring the TUC Eligibility Checker. It provides tools for project refresh monitoring, logic simulation, and institutional audit tracking.

## 2. Authentication
- **Default Login**: Access via the primary portal navigation (Staff Login).
- **Access Control**: Restricted to authorized institutional staff.
- **Security Note**: All login attempts are recorded in the Activity Stream.

## 3. Refresh Status Monitor
- **Purpose**: Tracks the 5-phase sequential refinement of the application core.
- **Phases**:
  1. Foundation Setup (Completed)
  2. Core Implementation (Completed)
  3. Testing Framework (Active)
  4. Documentation & Diagrams (Pending)
  5. Final Alignment (Pending)

## 4. Logic Simulator
- **Function**: Executes E2E simulations of the eligibility algorithms (WASSCE/SSSCE/GCE).
- **Terminal**: Provides real-time console output during simulation runs.
- **Use Case**: Validate logic integrity after requirement updates or framework migrations.

## 5. Activity Stream
- **Log Types**: INFO, SUCCESS, WARNING, ERROR.
- **Persistence**: Logs are saved to `localStorage` for cross-session audit durability.
- **Purge**: Admin-only "Clear" capability for maintenance (requires confirmation).
