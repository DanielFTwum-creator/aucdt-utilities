# Software Requirements Specification (SRS) v1.3
**Project:** Techbridge Media Club Platform
**Version:** 1.3
**Date:** February 17, 2026
**Status:** Phase 1 Complete (Gap Analysis)

## 1. Introduction
### 1.1 Purpose
The Techbridge Media Club Platform (TMCP) is a centralized system designed to facilitate digital media management, editorial workflows, event coordination, and analytics for the student media club.

### 1.2 Scope
The system acts as a Single Page Application (SPA) serving four primary user roles: Admin, Editor, Creator, and Member. It includes modules for content authoring (with simulated real-time collaboration), asset management, and system administration.

### 1.3 Technology Stack (Permanent)
*   **Frontend Library**: React 19.2.5
*   **Styling**: Tailwind CSS v3.4 (Dark Mode enabled)
*   **Build Tooling**: Babel Standalone (In-browser transformation)
*   **Icons**: Lucide React
*   **Visualization**: Recharts

## 2. Specific Requirements
### 2.1 External Interface Requirements
*   **User Interface**: Responsive design supporting Desktop (1920x1080) down to Mobile (375x667).
*   **Theme Support**: Must support Light, Dark, and High-Contrast modes via CSS variables/Tailwind classes.

### 2.2 Functional Requirements

#### 2.2.1 Authentication & Authorization
*   **REQ-AUTH-01**: System shall mock OAuth 2.0 flow for prototype.
*   **REQ-AUTH-02**: Admin Panel must be protected by password challenge (`admin123`).
*   **REQ-AUTH-03**: UI must adapt based on user role (simulated `CURRENT_USER` constant).

#### 2.2.2 Editorial Workflow
*   **REQ-CMS-01**: Users can view list of content items.
*   **REQ-CMS-02**: Users can open a collaborative editor.
*   **REQ-CMS-03**: Collaborative editor must simulate remote user presence (cursors, text injection) via WebSocket service stub.
*   **REQ-CMS-04**: Editor must support Rich Text formatting options.

#### 2.2.3 System Administration
*   **REQ-ADM-01**: Dashboard must show system health metrics.
*   **REQ-ADM-02**: Diagnostics tab must run client-side DOM checks (React Mount, Theme Context).
*   **REQ-ADM-03**: Testing tab must provide exportable Playwright scripts.

### 2.3 Non-Functional Requirements
*   **NFR-PERF-01**: First Contentful Paint < 1.5s.
*   **NFR-SEC-01**: No hardcoded secrets in client bundle (Mock credentials allowed for prototype).
*   **NFR-ACC-01**: WCAG 2.1 AA Compliance for contrast and aria-labels.

## 3. Implementation Status (Phase 1)
*   **Core Framework**: Implemented (React 19).
*   **UI Components**: Implemented (Tailwind).
*   **Business Logic**: Simulated (Services/Constants).
*   **Data Persistence**: In-Memory (Non-persistent).

## 4. Appendices
*   `docs/GAP_ANALYSIS.md`: Detailed breakdown of missing production features.
*   `docs/ARCHITECTURE.md`: System diagrams.
