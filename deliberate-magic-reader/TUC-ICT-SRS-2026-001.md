# Software Requirements Specification (SRS)
## Document Control Number: TUC-ICT-SRS-2026-001
### Project: Techbridge AI Blueprint [TAB] - Deliberate Magic Reader Lifecycle

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the software requirements for the "Deliberate Magic Reader" system, a core component of the **Techbridge AI Blueprint [TAB]** initiative. This document provides a detailed specification of the functional, non-functional, and interface requirements, serving as the contract of truth between the developer and stakeholders.

### 1.2 Scope
The Deliberate Magic Reader is an elegant, full-stack React-Express-Vite application built to serve and catalog the "Deliberate Magic" tech-industry essays. It offers a literary editorial interface with deep reader functionalities, combined with a persistent Drafting Workshop for adding custom articles, an Ingress Telemetry console mapping port configurations, and a context-aware AI Glossary that dynamically defines jargon using Gemini 3.5 Flash inside active stories.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **TAB**: Techbridge AI Blueprint.
*   **SRS**: Software Requirements Specification (IEEE Std 830-1998).
*   **HMR**: Hot Module Replacement.
*   **API**: Application Programming Interface.
*   **UTC**: Coordinated Universal Time.
*   **SPA**: Single Page Application.
*   **SDK**: Software Development Kit.

### 1.4 References
1.  IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*.
2.  Vite Core React + TypeScript Configuration Guide.
3.  Google GenAI SDK `@google/genai` Reference documentation.

### 1.5 Overview
The remainder of this document outlines the product perspective, detailed constraints, user interfaces, functional requirements of the core components (Archives, Drafts, Live Diagnostics, Glossary), and system properties.

---

## 2. Overall Description

### 2.1 Product Perspective
The Deliberate Magic Reader is a full-stack, state-persisted web application structured inside a sandboxed environment. Built on top of Express (backend server) and Vite + React (frontend client), the system operates entirely behind an Nginx reverse-routing proxy binding strictly to container interfaces.

```
+--------------------------------------------------------+
|                      User Browser                      |
+--------------------------------------------------------+
                           |
                           v  Web Port 3000 Ingress
+--------------------------------------------------------+
|                     Express Server                     |
+------------+-------------------------------+-----------+
             |                               |
             v                               v
+------------+-----------+       +-----------+-----------+
|      Vite SPA Assets   |       |  Gemini AI API Proxy  |
+------------------------+       +-----------------------+
```

### 2.2 Product Functions
The product features four primary functional modules accessible via a dedicated, persistent tab control:
1.  **Archives (Essay Reader)**: Renders essays with serif/sans typography, adjustable layout sizing, navigation controls, auto-generated "Related Essays" sections based on keywords, and inline hover-trigger glossary tools.
2.  **Drafting Workshop**: A writer's workshop enabling the creation, staging, and exporting of custom-written chapters.
3.  **Ingress Telemetry Console**: A utility dashboard verifying bindings (such as Port 3007), querying container statuses, and monitoring performance logs.
4.  **AI Glossary Log**: An indexical glossary defining technical jargon. Features an active panel where term definitions can be queried from Gemini on the fly.

### 2.3 User Classes and Characteristics
*   **Readers/Philosophers**: High cognitive engagement users interested in industry-level essays. They require high-contrast, distraction-free serif reading experiences.
*   **Developer-Administrators**: System operators inspecting server logs, simulating ports, and utilizing telemetry nodes.

### 2.4 Operating Environment
*   **Hardware Interface**: Any modern client computing device (desktop/tablet/mobile) with CSS Grid/Flexbox rendering engines.
*   **Client Software**: Modern HTML5 compliant browsers (Chrome, Edge, Safari, Firefox).
*   **Server Host Node**: Node.js 22.x running within Docker containers on Cloud Run platforms.

### 2.5 Design and Implementation Constraints
*   **Container Root Port Binding**: Development and production servers MUST run on port `3000` hosted on IPv4 address `0.0.0.0`.
*   **Environment Variables**: All external service keys (including `GEMINI_API_KEY`) must reside securely server-side inside runtime processes and NEVER expose prefixing variables like `VITE_` to Client bundles.
*   **Linter Checks**: Code compiles with zero strict TypeScript omissions (`tsc --noEmit`).

### 2.6 Assumptions and Dependencies
*   **Network Access**: Required for invoking backend content resolvers querying the Gemini LLM.
*   **Client State**: Assume `localStorage` is available and enabled in the browser for persisting custom drafts and reader preferences.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
The user-interface conforms to an elegant Minimalist Slate aesthetic:
*   **Core Color Theme**: Tailwind shades centering `zinc` with high contrast amber highlights.
*   **Active Controls**: Large accessible touch targets (>= 44px on mobile margins).
*   **Micro-interactions**: Subtle state indicators powered by `motion/react` layout transitions.

#### 3.1.2 Hardware Interfaces
No specialized hardware devices required.

#### 3.1.3 Software Interfaces
*   **Backend Server Process**: Express v4 application.
*   **External AI Services**: `@google/genai` TypeScript SDK executing smart queries over `gemini-3.5-flash`.

#### 3.1.4 Communications Interfaces
HTTP REST interfaces communicating over structured JSON strings:
*   `POST /api/define`: Accepts `{ term: string, context: string }` and returns curated definitions.
*   `POST /api/verify-port`: Accepts `{ port: number }` to simulate loop network bindings.

---

## 3.2 System Features

### 3.2.1 Interactive Editorial Essay Reader
*   **Description**: A premium reading interface that displays active essays.
*   **Requirements**:
    *   Set serif toggle state on/off.
    *   Change active font dimensions dynamically (`sm` to `xl`).
    *   Display related essays at base of view (maximum of 3 related content links sorted by semantic score).
    *   Detect glossary keywords within text segments and decorate with dotted borders.

### 3.2.2 AI-Powered Context-Aware Glossary
*   **Description**: A dynamically compiled technical dictionary context-aware of current essay parameters.
*   **Requirements**:
    *   Hovering over underlined keywords launches a layout tooltip querying the `/api/define` endpoint.
    *   The API accepts essay telemetry snippets as context parameters so the returned metaphor is customized according to the respective subject style.
    *   Local offline cache dictionary returns instant results for core metaphors when Internet is limited.

### 3.2.3 Interactive Drafting Workshop
*   **Description**: Drafting workflow for creating and reviewing custom writings.
*   **Requirements**:
    *   Support dynamic word limits, title inputs, and text edit fields.
    *   Publish new essays straight into client storage records.

### 3.2.4 Telemetry and Diagnostics
*   **Description**: Administrative platform detailing container state.
*   **Requirements**:
    *   Query simulated connections on designated network ports.
    *   Output realistic server log streams using terminal styling with zero clutter.

---

## 4. Non-Functional Requirements

### 4.1 Safety and Security
*   **Zero Public Keys Directive**: Gemini tokens are kept completely behind API handlers. No secrets are stored in standard static frontend script bundles.

### 4.2 Port Reliability
*   Strict enforcement of primary port `3000` bindings in dev-server initialization config scripts to keep browser endpoints accessible during runtime.

### 4.3 Maintainability
*   Project is strictly modularized with types separate from layout components for ease of packaging exports.

---
### APPROVED BY:
**Technical Board of TUC-ICT (Academic Year 2026)**
*Status: Baselined & Certified ✅*
