# Software Requirements Specification (SRS)
## for CreoAI (Final Version)

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
   3.1 [Flyer Generation](#31-flyer-generation)
   3.2 [Video-based Flyer Generation](#32-video-based-flyer-generation)
   3.3 [Theming and Accessibility](#33-theming-and-accessibility)
   3.4 [Administration](#34-administration)
   3.5 [Interactive Testing](#35-interactive-testing)
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
The purpose of this document is to provide a detailed description of the requirements for the CreoAI application, Version 2.0. This version includes significant enhancements such as AI-powered video generation, an admin panel, accessibility features, and a testing suite. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
The CreoAI application is a feature-rich web application that enables users to generate a professional business flyer from a predefined data structure. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. Key features include AI image generation, user image uploads, AI video generation using Google's Veo model, user video uploads (with drag-and-drop), and an interactive frame selector to choose flyer imagery.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines
- **ARIA:** Accessible Rich Internet Applications
- **Veo:** A video generation model from Google.

---

### 2. Overall Description

#### 2.1 Product Perspective
CreoAI is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session.

#### 2.2 Product Functions
The functions of the application include:
- A tabbed navigation system to switch between "Generator", "Admin", and "Testing" views.
- AI-powered flyer image generation.
- User-uploaded image support for flyers, including drag-and-drop.
- AI-powered video generation to create short clips based on the flyer's theme.
- User-uploaded video support for flyers, including drag-and-drop.
- An interactive video frame selector allowing users to choose a moment from a generated or uploaded video to use as their flyer's image.
- An integrated API key selection flow for features requiring Google Cloud project billing (e.g., video generation).
- A theme switcher allowing users to select Light, Dark, or High-Contrast mode.
- A password-protected "Admin" section with an audit log.
- An "Testing" section with tools for self-testing and screenshot capture.

#### 2.3 User Characteristics
- **General Users:** Individuals who need to quickly generate a professional-looking flyer based on a predefined template.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.
- Video generation requires a user-selected Google Cloud API key with billing enabled.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** See `docs/system_architecture.svg`
- **Database Architecture Diagram:** See `docs/database_architecture.svg`

---

### 3. System Features

#### 3.1 Flyer Generation
- **3.1.1 Description and Priority:** Core functionality to generate a flyer image using AI or a user-provided image. Priority: High.
- **3.1.2 Functional Requirements:**
    - The system shall provide a button to initiate the AI image generation process.
    - The system shall provide a button to allow users to upload their own image file (e.g., JPEG, PNG, WebP).
    - The system shall support drag-and-drop functionality, allowing users to drop an image file onto the main generator area to initiate the upload process.
    - Upon successful image generation or upload, the system shall present an image adjustment tool.
    - The final, cropped image shall be displayed in the flyer template.
    - The system shall provide options to download the final flyer or start over.

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
    - The system shall manage object URLs for uploaded videos and revoke them when they are no longer needed to prevent memory leaks.

#### 3.3 Theming and Accessibility
- **3.3.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.3.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - The chosen theme shall be persisted in the browser's `localStorage`.
    - All interactive elements shall have appropriate ARIA roles, states, and properties.
    - All interactive elements must be keyboard-navigable and have visible focus indicators.

#### 3.4 Administration
- **3.4.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The Admin Panel shall display an audit log of all logged actions.
    - The Admin Panel shall provide a "Logout" button to terminate the admin session.

#### 3.5 Interactive Testing
- **3.5.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.5.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence of the `API_KEY`.
    - The system shall provide a "Capture Flyer Screenshot" button which uses `html2canvas` to download a PNG of the current flyer.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the application title and the Theme Switcher.
- A main content area will render the active view (Generator, Admin, or Testing).
- The main generator view shall act as a drop zone for file uploads, with clear visual feedback during drag operations.
- A footer shall contain text links to navigate to the "Admin" and "Testing" views.

#### 4.2 Software Interfaces
- **Google Gemini API:** The application will use the `@google/genai` library to interface with the Gemini image generation (`imagen-4.0-generate-001`) and video generation (`veo-3.1-fast-generate-preview`) models.
- **html2canvas Library:** The application will interface with the `html2canvas` library (loaded via CDN) to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations, especially during long-polling for video generation.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code.
- The admin password, while hardcoded for this project, should be managed securely in a production environment.

#### 5.3 Usability and Accessibility Requirements
- The application should strive for WCAG 2.1 AA compliance.
- The color palettes for all themes must meet minimum contrast ratios for text and UI elements.
- The tabbed interface must be intuitive and clearly indicate the active section.