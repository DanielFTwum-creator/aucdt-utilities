# IEEE 830 Software Requirements Specification (SRS)
## Techbridge Ad Poster Generator

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to specify the software requirements for the Techbridge Ad Poster Generator, a high-fidelity system for generating marketing assets.

#### 1.2 Scope
The system allows users to create posters in multiple aspect ratios (Landscape, Square, Portrait, Cinema, Story) with real-time preview and export capabilities (PNG, PDF, HTML).

### 2. Overall Description
#### 2.1 Product Perspective
A standalone web application built with React 19 and Node.js.

#### 2.2 Product Functions
- Multi-format canvas selection.
- Dynamic data injection (Headlines, Stats, Logos).
- Retina-quality rendering.
- Admin diagnostic dashboard.

### 3. System Requirements
#### 3.1 Functional Requirements
- **FR1**: The system shall generate PNG images at 300 DPI.
- **FR2**: The system shall support PDF export with CMYK verification.
- **FR3**: The system shall provide an admin dashboard for system health.

#### 3.2 Non-Functional Requirements
- **NFR1**: React version MUST remain at 19.2.5.
- **NFR2**: System shall pass all Playwright automated tests.
