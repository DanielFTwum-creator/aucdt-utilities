# Software Requirements Specification (SRS)
## for CreoAI (Current State)

**Version 2.0**

**Prepared by:** AI Senior Frontend Engineer
**Date:** [Current Date]

---

### Table of Contents
1. [Introduction](#1-introduction)
   1.1 [Purpose](#11-purpose)
   1.2 [Scope](#12-scope)
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
   2.1 [Product Perspective](#21-product-perspective)
   2.2 [Product Functions](#22-product-functions)
   2.3 [User Characteristics](#23-user-characteristics)
   2.4 [Constraints](#24-constraints)
   2.5 [System Architecture](#25-system-architecture)
3. [System Features](#3-system-features)
   3.1 [Flyer Generation & Customization](#31-flyer-generation--customization)
   3.2 [Video-based Flyer Generation](#32-video-based-flyer-generation)
   3.3 [Theming and Accessibility](#33-theming-and-accessibility)
   3.4 [Administration](#34-administration)
   3.5 [Interactive Testing](#35-interactive-testing)
   3.6 [Flyer Management](#36-flyer-management)
4. [External Interface Requirements](#4-external-interface-requirements)
   4.1 [User Interfaces](#41-user-interfaces)
   4.2 [Software Interfaces](#42-software-interfaces)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   5.1 [Performance Requirements](#51-performance-requirements)
   5.2 [Security Requirements](#52-security-requirements)
   5.3 [Usability and Accessibility Requirements](#53-usability-and-accessibility-requirements)

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the CreoAI application, Version 2.0. This version includes significant enhancements such as AI-powered video generation, an admin panel, accessibility features, a testing suite, and flyer customization options. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
CreoAI is a feature-rich web application that enables users to generate and customize a professional business flyer. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. Key features include AI image generation, AI video generation using Google's Veo model, video frame selection for flyer imagery, user image and video uploads (including drag-and-drop), interactive text editing, and layout adjustments.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **ARIA:** Accessible Rich Internet Applications
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines
- **Veo:** A video generation model from Google.

---

### 2. Overall Description

#### 2.1 Product Perspective
CreoAI is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session. Flyer designs can be saved to and loaded from the browser's `localStorage`.

#### 2.2 Product Functions
The functions of the application include:
- A tabbed navigation system for "Generator", "Admin", and "Testing" views.
- AI-powered flyer image generation.
- AI-powered video generation to create short clips based on the flyer's theme.
- An interactive video frame selector allowing users to choose a moment from a generated video to use as their flyer's image.
- An integrated API key selection flow for features requiring Google Cloud project billing (e.g., video generation).
- Support for user-uploaded images and videos, via both file selection and drag-and-drop.
- Interactive, in-place editing of all text elements on the flyer.
- Controls for adjusting the flyer layout and image filters.
- Functionality to save, load, and delete flyer designs.
- A theme switcher for Light, Dark, and High-Contrast modes.
- A password-protected "Admin" section with an audit log.
- An "Testing" section with a system self-test and screenshot capture tool.

#### 2.3 User Characteristics
- **General Users:** Marketers, designers, or small business owners who need to create and customize flyers quickly.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** An SVG diagram (`docs/system_architecture.svg`) illustrates the flow from the user to the browser application and to the Gemini API.
- **Database Architecture Diagram:** An SVG diagram (`docs/database_architecture.svg`) explains the non-database approach, highlighting the use of in-memory state and `localStorage`.

---

### 3. System Features

#### 3.1 Flyer Generation & Customization
- **3.1.1 Description and Priority:** Core functionality allowing users to create and modify flyers using static images. Priority: High.
- **3.1.2 Functional Requirements:**
    - The system shall allow flyer creation via AI image generation or user image upload.
    - The system shall support drag-and-drop functionality, allowing users to drop an image file onto the main generator area to initiate the upload process.
    - The system shall provide an image adjustment modal after image generation/upload, allowing the user to pan and zoom the image.
    - The system shall allow users to click on any text element on the rendered flyer and edit its content directly.
    - The system shall provide layout controls and image filters for customization.

#### 3.2 Video-based Flyer Generation
- **3.2.1 Description and Priority:** Generate or upload a short video and allow the user to select a frame from it to use as the flyer image. Priority: High.

- **3.2.2 AI Video Generation Functional Requirements:**
    - The system shall present an option to "Generate Video Flyer".
    - Before generation, the system must verify a user-selected API key is available via `window.aistudio`. If not, it must prompt the user to select one, as this is a billable feature.
    - The system shall call the Gemini `veo-3.1-fast-generate-preview` model.
    - The system must display a dedicated loading indicator with reassuring text, as generation can take several minutes.
    - The system shall poll the API until the video generation operation is complete.
    - Upon completion, the system shall display the generated video in a player with controls.
    - The user must be able to capture the current frame of the video.
    - The captured frame shall then be used in the image cropper, following the existing image workflow.

- **3.2.3 User Video Upload Functional Requirements:**
    - The system shall present an option to "Upload Video".
    - The system shall provide a file selection dialog that accepts common video formats (e.g., MP4, MOV, WebM).
    - The system shall support drag-and-drop functionality, allowing users to drop a video file onto the main generator area to initiate the upload process.
    - Upon successful file selection, the system shall display the user's video in the same frame selector component used for AI-generated videos.
    - The user workflow for selecting and capturing a frame shall be identical to the AI-generated video workflow.

#### 3.3 Theming and Accessibility
- **3.3.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.3.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - The chosen theme shall be persisted in the browser's `localStorage`.
    - All interactive elements shall have appropriate ARIA roles, states, and properties (e.g., `role="tab"`, `aria-selected`).
    - The application shall be fully navigable using only a keyboard.

#### 3.4 Administration
- **3.4.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The Admin Panel shall display an audit log of all significant application events.
    - The Admin Panel shall provide a "Logout" button.

#### 3.5 Interactive Testing
- **3.5.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.5.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence and validity of the `API_KEY`.
    - The system shall provide a "Capture Flyer Screenshot" button, which uses `html2canvas` to download a PNG of the current flyer.

#### 3.6 Flyer Management
- **3.6.1 Description and Priority:** Allows users to persist and reuse their work. Priority: Medium.
- **3.6.2 Functional Requirements:**
    - The system shall allow a user to save the current flyer state (image, text, layout) with a user-provided name to `localStorage`.
    - The system shall display a list of saved flyers, allowing users to load or delete them.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the tab navigation (`role="tablist"`) and the Theme Switcher.
- The content area below the header will render the component corresponding to the active tab, acting as a `role="tabpanel"`.
- The main generator view shall act as a drop zone for file uploads, with clear visual feedback during drag operations.

#### 4.2 Software Interfaces
- **Google Gemini API:** The application will use the `@google/genai` library to call the `imagen-4.0-generate-001` and `veo-3.1-fast-generate-preview` models.
- **html2canvas Library:** The application will interface with the `html2canvas` library to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations, especially during long-polling for video generation.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code and must be injected via environment variables.
- The admin password, while hardcoded for this project, should be managed securely in a production environment.

#### 5.3 Usability and Accessibility Requirements
- The application must strive for WCAG 2.1 AA compliance.
- All color palettes, including the high-contrast theme, must meet minimum contrast ratios.
- All interactive elements must have clear, visible focus states.