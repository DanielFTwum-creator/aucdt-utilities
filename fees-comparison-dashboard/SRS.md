# System Requirements Specification (SRS)
**Project:** Ghana University Fees Dashboard
**Version:** 1.1
**Date:** October 26, 2023
**Phase:** 1 (Foundation Setup)

## 1. Introduction

### 1.1 Purpose
The purpose of the Ghana University Fees Dashboard is to provide a transparent, interactive data visualization tool that enables prospective students, parents, and educational researchers to compare tuition fees across public and private universities in Ghana. This document defines the functional and non-functional requirements for the initial release (Phase 1).

### 1.2 Scope
The application is a client-side Single Page Application (SPA) built with React. It provides:
- Comparative visualization of tuition fees.
- Filtering capabilities for different student categories (Undergraduate, International, Postgraduate).
- Interactive details via tooltips.
- A responsive design suitable for mobile and desktop devices.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SPA:** Single Page Application.
- **SRS:** System Requirements Specification.
- **GH₵:** Ghanaian Cedi (Currency).
- **CSR:** Client-Side Rendering.
- **Component:** A modular part of the React application (e.g., `FeesComparisonDashboard`).

## 2. Overall Description

### 2.1 Product Perspective
This system operates as a standalone web application. It relies on a modern browser environment to render the User Interface (UI) and execute logic via JavaScript. It is designed to be hosted on static hosting services.

### 2.2 User Classes and Characteristics
- **Prospective Students:** Users seeking tuition information for university selection.
- **Parents/Guardians:** Users analyzing financial requirements for education.
- **Researchers:** Users comparing public vs. private sector pricing strategies.

### 2.3 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Safari, Edge).
- **Display:** Responsive support for resolutions from 320px (mobile) to 4k (desktop).

### 2.4 Design and Implementation Constraints
- **Frontend Framework:** React 19.
- **Styling Utility:** Tailwind CSS.
- **Charting Library:** Recharts.
- **Language:** TypeScript for type safety.

### 2.5 Data Model
The application manages three core data structures as defined in `types.ts`:
- **UndergraduateFeeData:** Includes `fees` (freshman) and `continuing` (ongoing) costs.
- **InternationalFeeData:** Includes converted fee structures.
- **PostgraduateFeeData:** Includes program-specific annual fees.
- **Common Fields:** `name` (Institution Name), `type` (Public/Private).

## 3. System Features

### 3.1 Interactive Fee Visualization
- **Description:** A dynamic bar chart that renders fee data based on the selected view.
- **Functional Requirements:**
  - **REQ-1.1:** The system shall display a vertical bar chart.
  - **REQ-1.2:** The chart shall render the X-axis with Institution Names.
  - **REQ-1.3:** The chart shall render the Y-axis with Currency values (GH₵).
  - **REQ-1.4:** The system shall distinguish fee types (e.g., Freshman vs. Continuing) using distinct colors.

### 3.2 Category Filtering System
- **Description:** A tab-based navigation control to switch data contexts.
- **Functional Requirements:**
  - **REQ-2.1:** The system shall provide three mutually exclusive filters: 'Undergraduate', 'International', 'Postgraduate'.
  - **REQ-2.2:** Selecting a filter shall immediately (within 100ms) update the chart data.
  - **REQ-2.3:** The active filter state shall be visually distinct (highlighted).

### 3.3 Contextual Data Details
- **Description:** On-hover tooltips providing precise data points.
- **Functional Requirements:**
  - **REQ-3.1:** Hovering over a bar shall display a floating tooltip.
  - **REQ-3.2:** The tooltip shall show: Institution Name, Fee Value formatted in GH₵, and Institution Type (Public/Private).
  - **REQ-3.3:** The tooltip shall utilize a semi-transparent backdrop for readability.

### 3.4 Data Analysis Insights
- **Description:** A text-based summary of key observations based on the data.
- **Functional Requirements:**
  - **REQ-4.1:** The system shall display a list of "Key Observations" relevant to the currently selected filter.

## 4. Nonfunctional Requirements

### 4.1 Performance
- **REQ-NFR-1:** Initial application load time shall be under 1.5 seconds on a standard 4G network.
- **REQ-NFR-2:** UI interactions (filtering) shall render in under 16ms (60fps target).

### 4.2 Usability
- **REQ-NFR-3:** Currency values shall be comma-separated for readability (e.g., 10,000).
- **REQ-NFR-4:** The UI shall use high-contrast colors accessible to users with mild visual impairments.

### 4.3 Maintainability
- **REQ-NFR-5:** The code shall adhere to TypeScript strict mode.
- **REQ-NFR-6:** Component logic shall be separated from data definitions.

---
*End of SRS Document*