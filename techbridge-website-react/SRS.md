# Software Requirements Specification (SRS)
## Project: Techbridge University College (TUC) Website
**Version:** 1.0
**Date:** October 26, 2023

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for the React-based frontend of Techbridge University College (TUC). This application serves as a digital portal for prospective students, faculty, and the general public to access information regarding the university's programs, admissions, and events.

### 1.2 Scope
The software is a single-page application (SPA) built using React and Tailwind CSS. It communicates with the centralized TUC-Auth-API for secure administrative functions. The scope includes the Header (navigation/contact), Hero Slider, Call to Action sections, Programme listings, Scholarship information, Footer, and a Virtual AI Assistant.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **TUC:** Techbridge University College
*   **SPA:** Single Page Application
*   **CTA:** Call to Action
*   **UI/UX:** User Interface / User Experience

---

## 2. Overall Description

### 2.1 Product Perspective
This product is a standalone frontend interface intended to run in modern web browsers. It relies on client-side rendering and utilizes `lucide-react` for iconography and `tailwindcss` for styling.

### 2.2 Product Functions
*   **Navigation:** Responsive top-level navigation with dropdown capabilities.
*   **Information Display:** Rotating hero slider highlighting key departments.
*   **Program Showcase:** Grid layout displaying degrees and short courses.
*   **Admissions Prompt:** Prominent calls to action for student applications.
*   **Virtual Support:** An interactive AI agent to guide users to common resources.
*   **Communication:** Social media integration and newsletter subscription forms.

### 2.3 User Characteristics
*   **Prospective Students:** Seeking admission info, tuition fees, and program details.
*   **Current Students:** Accessing LMS, portals, and academic calendars.
*   **Faculty/Staff:** Accessing institutional resources.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements
*   **User Interfaces:** The application shall use the TUC color palette: Maroon (`#630F12`), Gold (`#FFCB05`), Green (`#3DB54A`), and Beige (`#F5F5DC`).
*   **Hardware Interfaces:** Responsive design supporting Desktop (1920x1080), Tablet (768x1024), and Mobile (375x667) resolutions.

### 3.2 Functional Requirements

#### 3.2.1 Header & Navigation
*   **REQ-1:** The system shall display a top bar with location, email, and phone contact details.
*   **REQ-2:** The system shall provide a sticky main navigation bar with the TUC logo.
*   **REQ-3:** The navigation shall collapse into a hamburger menu on mobile devices.

#### 3.2.2 Hero Slider
*   **REQ-4:** The homepage shall feature an auto-rotating slider (5-second interval).
*   **REQ-5:** Each slide shall contain a background image, overlay text, and a "Read More" CTA.

#### 3.2.3 Virtual Assistant (AI Agent)
*   **REQ-6:** A floating chat widget shall be available on all screens.
*   **REQ-7:** The agent shall provide predefined quick responses for "Admissions", "Fees", and "Location".
*   **REQ-8:** The chat interface shall mimic a real-time conversation flow.

#### 3.2.4 Content Sections
*   **REQ-9:** A "Programmes" section shall list available degrees with "Degree" or "Certificate" badges.
*   **REQ-10:** A "Scholarship" section shall provide details on the Techbridge University College Scholarship.

### 3.3 Non-Functional Requirements
*   **Performance:** The application must load initial paint within 1.5 seconds on 4G networks.
*   **Reliability:** The layout must maintain integrity across Chrome, Firefox, Safari, and Edge.
*   **Maintainability:** Code shall be modularized into React components (`Header`, `Footer`, `HeroSlider`, etc.).

---

## 4. Appendices
*   **Tech Stack:** React 18, Tailwind CSS, Lucide React.
*   **Assets:** Images sourced from AUCDT public domain or Unsplash placeholders.
