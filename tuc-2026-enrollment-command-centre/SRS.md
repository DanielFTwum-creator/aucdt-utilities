# Software Requirements Specification (SRS)
## Project: TUC Enrollment Command Centre
**Document ID:** TUC-ICT-SRS-2026-001  
**Version:** 1.1.0  
**Status:** Baseline  
**Date:** May 11, 2026

---

### 1. Introduction
#### 1.1 Purpose
This document specifies the functional and non-functional requirements for the TUC Enrollment Command Centre (v1.0), a tactical dashboard for managing the July 2026 student enrollment cycle.

#### 1.2 Scope
The system provides a high-level strategic overview and tactical execution framework for the TUC Marketing Division. It covers timeline management, demographic segmentation, funnel leak analysis, and operational task tracking.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **TUC**: Techbridge University College.
- **SHS**: Senior High School.
- **Command Centre**: The interactive dashboard interface.
- **Funnel**: The series of stages a prospective student moves through from awareness to enrollment.

#### 1.4 References
- TUC Marketing Strategy 2026.
- IEEE 830-1998 Standard for Software Requirements Specifications.

#### 1.5 Overview
The remainder of this document describes the general product perspective, specific functional requirements, and non-functional constraints including design aesthetics and performance benchmarks.

---

### 2. General Description
#### 2.1 Product Perspective
The application is a standalone React-based command dashboard. It is designed to run within the TUC internal intranet/preview environment.

#### 2.2 Product Functions
- **Master Timeline**: 8-week multi-stream roadmap.
- **Segment Matrix**: Demographic-specific marketing tactics.
- **Funnel Analytics**: Visualization of conversion and abandonment rates.
- **Deployment Checklist**: Real-time status tracking for activation tasks.

#### 2.3 User Characteristics
- **Marketing Lead**: Strategic decision-maker.
- **Admissions Officer**: Task executor.

#### 2.4 Constraints
- Must use Tailwind CSS for all styling.
- Must follow the "Professional Polish / Nova Core" design system.
- Deployment restricted to Cloud Run via AI Studio.

---

### 3. Specific Requirements
#### 3.1 Functional Requirements
- **FR-01 (Navigation)**: The system shall provide a sidebar for navigation between operational nodes.
- **FR-02 (Timeline)**: The system shall display a grid of tasks organized by week and functional stream.
- **FR-03 (Funnel)**: The system shall visualize the enrollment drop-off points with clear callouts for "leaks."
- **FR-04 (Tracking)**: The system shall allow users to mark tasks as complete in the Week 1 checklist.

#### 3.2 Interface Requirements
- **Sidebar**: Fixed-width (72px md:288px) navigation rail.
- **Color Palette**: Dark slate backgrounds with indigo accents (#6366f1).
- **Typography**: Inter Sans for UI, Serif for headers.

#### 3.3 Non-Functional Requirements
- **Usability**: Single-click tab transitions with <200ms latency.
- **Design**: "Professional Polish" aesthetic (sharp edges, subtle shadows, clear hierarchy).

---
**Approved By:** TUC ICT Department
