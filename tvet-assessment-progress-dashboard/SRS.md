
# Software Requirements Specification (SRS)
## Project: TVET Assessment Progress Dashboard
**Version**: 5.2.0-Tooltips
**Date**: October 2025
**Status**: Completed / Released

### 1. Introduction
#### 1.1 Purpose
The TVET Assessment Progress Dashboard is a high-fidelity analytical tool designed to provide real-time visibility into assessment completion cycles. It enables stakeholders to monitor velocity, analyze shortfalls, and project completion timelines with fully customizable context.

#### 1.2 Scope
The system focuses on local-first data processing with zero-infrastructure sharing capabilities via URL state encoding. It provides visualization for current progress vs. target benchmarks, now extended to support generic tracking contexts.

#### 1.3 Documentation Suite
The following documents constitute the complete documentation package:
- **System Architecture**: `docs/SystemArchitecture.svg`
- **Data Model**: `docs/DataModel.svg`
- **Tech Stack**: `docs/TechStack.svg`
- **Data Flow**: `docs/DataFlow.svg`
- **Gap Analysis**: `docs/GapAnalysisReport.md`
- **Admin Guide**: `docs/AdministratorGuide.md`

### 2. Functional Requirements
- **FR-1: Dynamic Calculation Engine**: The system shall compute daily velocity, critical gaps, and projected finish dates based on `start_date`, `completed_units`, and `target_rate`.
- **FR-2: URL State Persistence**: All application configuration parameters (including Title, Labels, and Logo) shall be synchronized with the browser's URL hash to enable persistent, stateless sharing.
- **FR-3: Visual Telemetry**: 
    - The system shall provide a multi-tier visualization suite including progress bars, hero stats, and a shortfall trend analysis chart.
    - **Interactive Data Inspection**: Charts shall feature custom, high-fidelity tooltips displaying precise metrics (Target, Actual, Projected) on hover.
- **FR-4: Multi-Format Export**: The system shall support exporting the current dashboard view to PNG (via `html-to-image`) and provide print-optimized layouts for PDF generation.
- **FR-5: Quick Actions**: The system shall allow users to:
    - Copy a formatted text-based status report to the clipboard.
    - Perform quick increments/decrements on the completed count directly from the "Completed" Hero Stat card.
- **FR-6: Customization**: Users shall be able to configure the Report Title, Item Label, and Organization Logo URL.
- **FR-7: Administration & Security**:
    - The system shall provide a password-protected Admin Section (`/admin`).
    - The Admin Section shall house all system diagnostics and raw data views.
    - **Audit Logging**: All state changes (config updates, progress increments) shall be logged with timestamps and viewable in the Admin Section.
- **FR-8: Theming**: The system shall support user-selectable themes:
    - **Dark** (Default, Slate/Emerald)
    - **Light** (Clean, White/Slate)
    - **High Contrast** (Accessibility-focused, Black/Yellow)
- **FR-9: Self-Testing Framework**:
    - The system shall include an integrated E2E test runner ("Playwright Simulator").
    - Tests shall execute against the live DOM to verify critical user journeys (Configuration, Interaction, Calculation).
    - Test results (Pass/Fail, Duration, Screenshots/Logs) shall be accessible in the Admin Interface.
- **FR-10: System Notifications**:
    - The system shall provide non-intrusive "Toast" notifications for user actions (Copy, Export, Login, Reset).
    - Notifications shall support distinct visual styles for Success, Error, and Info states.
    - Notifications shall auto-dismiss after 3 seconds.

### 3. Data Requirements
- **Total Units**: Scope of work (Default: 67).
- **Completed Units**: Current progress (Default: 37).
- **Target Velocity**: Required daily completion rate (Default: 4).
- **Temporal Baseline**: The start date of the project cycle.
- **Metadata**: Title, Item Label (Plural), and Logo URL.
- **Audit Log**: Array of `{ timestamp, action, details }`.
- **Velocity Match**: Calculated ratio of actual vs target velocity.
- **Notifications**: Queue of active system messages `{ id, type, message }`.

### 4. Technical Constraints
- **Stack**: React 19.2.5 (Strict Requirement), Tailwind CSS, Recharts, Lucide React.
- **Execution**: Purely client-side browser environment (No-Build).
- **Storage**: Stateless; reliant on URL fragments and local memory.

### 5. System Architecture & Diagrams
The following architecture diagrams describe the high-level design:

#### 5.1 System Architecture
![System Architecture](docs/SystemArchitecture.svg)
*Describes the component hierarchy, routing logic, and interaction between the Core App, Admin Panel, and Test Runner.*

#### 5.2 Data Architecture
![Data Model](docs/DataModel.svg)
*Details the TypeScript interfaces for Dashboard Data, Calculated Stats, Audit Logs, and Test Results.*

#### 5.3 Technology Stack
![Tech Stack](docs/TechStack.svg)
*Board-level overview of the Zero-Build React 19.2.5 stack.*

#### 5.4 Data Flow
![Data Flow](docs/DataFlow.svg)
*Flowchart illustrating how user input persists to URL hash, drives the calculation engine, and renders the dashboard.*

### 6. Non-Functional Requirements
- **NFR-1: Accessibility**: The UI shall use high-contrast color coding for status indicators. All interactive elements must have `aria-label` attributes and support keyboard navigation.
- **NFR-2: Performance**: Real-time updates must occur within <16ms (60fps) upon user input.
- **NFR-3: Aesthetics**: High-fidelity dark mode interface with monochromatic grid overlays and glow effects.
- **NFR-4: Robustness**: The system shall handle invalid URLs or missing data gracefully. Specifically, broken logo images must fallback gracefully without breaking the UI layout in both screen and print modes.
