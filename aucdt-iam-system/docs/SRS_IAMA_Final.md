# Software Requirements Specification (SRS)
## AUCDT IAM System (Industrial Attachment Management)

**Version:** 1.1 (Refresh)
**Date:** 2024-08-02

---

### 1. Introduction

#### 1.1 Purpose
This document specifies the requirements for the **AUCDT IAM System**, a web-based platform designed to streamline the documentation, supervision, and assessment of student industrial attachments at the **Asanska University College of Design and Technology**.

#### 1.2 Scope
The system provides a unified interface for:
*   **Students**: Specifically those in the **Fashion Design Technology Department**, to log daily activities, generate professional technical summaries using AI, and communicate with supervisors.
*   **Supervisors**: To review, approve, or reject log entries.
*   **Administrators**: To audit system access and verify system health via automated tests.

---

### 2. System Description

#### 2.1 Architecture
The IAM System operates as a Single Page Application (SPA) built with **React 19** and **TypeScript**. It utilizes:
*   **Google Gemini API** for Generative AI features (Logbook Refinement).
*   **Tailwind CSS** for responsive, accessible styling (incorporating AUCDT Maroon & Gold branding).
*   **Mock Services** for simulation of backend persistence and testing layers.

#### 2.2 User Roles
1.  **Student** (e.g., Sampson Danso): Primary data entry user.
2.  **Organization Supervisor** (e.g., Daniel F. Twum): Approver of data.
3.  **Institution Coordinator** (e.g., Emmanuel A. Asante PhD): Viewer of reports.
4.  **System Admin**: System manager and security auditor.

---

### 3. Specific Requirements

#### 3.1 Functional Requirements
*   **FR-01 Logbook Entry**: The system allows creation of dated entries with hours and descriptions.
*   **FR-02 AI Refinement**: The system integrates **Gemini 2.5 Flash** to rewrite raw notes into professional technical summaries suitable for academic reports.
*   **FR-03 Approval Workflow**: Entries must be approved by an Organization Supervisor.
*   **FR-04 Admin Tools**: A secure dashboard must provide access to Audit Logs and the Automated Test Runner.

#### 3.2 Non-Functional Requirements
*   **NFR-01 Accessibility**: The UI supports **High Contrast mode**, **Dark Mode** (auto-triggered after 6 PM), and follows WCAG guidelines.
*   **NFR-02 Performance**: AI responses must be handled asynchronously with loading states.
*   **NFR-03 Security**: **Universal Authentication** is required. All user roles (Student, Organization, Institution, Admin) must authenticate via password before accessing the dashboard.

---

### 4. Interface Guidelines & Models

Visual documentation including **System Architecture**, **Data Flow Diagrams**, and **UML Models** are embedded directly within the application's `/docs` route. 

Please refer to the application "Documentation" tab for the interactive "Digital SRS" which includes:
*   Figure 1: High-Level Architecture
*   Figure 2: Technology Stack
*   Figure 3: Detailed Architecture
*   Figure 4: Logbook Submission DFD
*   Figure 5: UML Use Case Diagram
*   Figure 6: AI Sequence Diagram

---

### 5. Testing & Verification

The project includes an internal "Mock Playwright" service located at `services/mockPlaywright.ts`. This service simulates End-to-End (E2E) user journeys including:
*   Student Login & Submission
*   Admin Security Challenges
*   API Latency Checks

Test results are visualized in the Admin Dashboard.