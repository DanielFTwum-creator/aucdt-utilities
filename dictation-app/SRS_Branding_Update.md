# Software Requirements Specification (SRS) for Brand Identity Update

**Version 1.1**

## 1. Introduction

### 1.1 Purpose
This document outlines the software requirements for the visual rebranding of the Voice Notes App to align with the official **Asanska University College of Design and Technology (AUCDT) Brand Identity Guide (Version 2.0)**. The purpose is to ensure all visual components of the application are updated to reflect the new brand identity consistently and accurately.

### 1.2 Scope
The scope of this update is strictly limited to the User Interface (UI) and User Experience (UX) of the application. It involves a comprehensive overhaul of the application's visual elements, including color schemes, typography, and component styling. Core functionalities, such as audio recording, transcription, and note polishing via the Gemini API, will remain unchanged.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **SRS:** Software Requirements Specification
*   **UI:** User Interface
*   **UX:** User Experience
*   **AUCDT:** Asanska University College of Design and Technology
*   **Brand Guide:** The official AUCDT Brand Identity Guide, Version 2.0.

### 1.4 Overview
This document details the specific requirements for updating the application's aesthetics. Section 2 describes the overall design philosophy and constraints. Section 3 provides specific, actionable requirements for typography, color, and UI elements.

---

## 2. Overall Description

### 2.1 Product Perspective
This project is a visual redesign of an existing, functional web application. The goal is to transform the application's look and feel to be a seamless extension of the AUCDT brand, presenting a professional, cohesive, and accessible user experience.

### 2.2 Product Functions
This update does not introduce new functionality. It modifies the presentation layer to meet the branding requirements. All existing features will be restyled.

### 2.3 User Characteristics
The target user base remains unchanged. The new design aims to enhance usability and brand recognition for the existing users (students, professionals, etc.).

### 2.4 Constraints
*   All design decisions must strictly adhere to the specifications laid out in the AUCDT Brand Identity Guide.
*   The primary font, Poppins, must be sourced from a reliable CDN (like Google Fonts) to ensure consistent rendering.
*   The application must support both a light and a dark theme, with color palettes derived from or complementary to the official brand colors.
*   All styled components must remain fully responsive and accessible.

---

## 3. Specific Requirements

### 3.1 Functional Requirements (UI Styling)

#### FR-1: Typography
*   **FR-1.1 Font Family:** The application MUST replace the existing font family with 'Poppins' for all text elements, including headings, body text, buttons, and labels.
*   **FR-1.2 Font Hierarchy:** The application MUST implement the font hierarchy as specified in the Brand Guide:
    *   **H1 / Main Headlines:** Poppins Bold, `2.5rem` (40px). (Applied to polished note `<h1>` tags).
    *   **H2 / Section Headers:** Poppins Semi-Bold, `1.8rem` (29px). (Applied to the main Note Title and polished note `<h2>` tags).
    *   **H3 / Subsections:** Poppins Medium, `1.5rem` (24px). (Applied to polished note `<h3>` tags).
    *   **Body Text:** Poppins Regular, `1rem` (16px), with a line height of `1.6`. (Applied to all paragraph and general content).

#### FR-2: Color Palette
*   **FR-2.1 Light Theme:** The default light theme MUST use the official brand colors:
    *   **Background:** Cream Background (`#F8F6F0`).
    *   **Primary Text:** Primary Text (`#2C1810`).
    *   **Accent Color:** Gold Accent (`#D4AF37`).
    *   **Secondary Accent / Recording State:** Burgundy Primary (`#8B1538`).
    *   **Borders & Secondary Surfaces:** Warm Beige (`#E6D5C7`) and Gold Light (`#F4E4BC`).
*   **FR-2.2 Dark Theme:** A dark theme MUST be provided as an alternative. This theme shall be derived from the brand palette to create a cohesive but distinct experience, using colors like a deep brown/burgundy for the background and the brand's gold and cream colors for text and accents.
*   **FR-2.3 Color Application:** Colors must be applied consistently to all UI elements, including text, backgrounds, borders, buttons, and active state indicators.

#### FR-3: UI Element Guidelines
*   **FR-3.1 Buttons:**
    *   Secondary action buttons (e.g., "New Note," "Toggle Theme") MUST use the `Gold Accent` background color (`#D4AF37`).
    *   The primary "Record" button's active recording state MUST use the `Burgundy Primary` color (`#8B1538`).
*   **FR-3.2 Cards & Containers:**
    *   The main `note-area` container MUST implement a `5px` solid left border using the `Gold Accent` color (`#D4AF37`) to emulate the "content card" style defined in the Brand Guide.

### 3.2 Non-Functional Requirements

#### NFR-1: Brand Consistency
*   **NFR-1.1 Adherence:** The final UI must be a faithful and accurate implementation of the AUCDT Brand Identity Guide. No unspecified colors or fonts should be used.

#### NFR-2: Accessibility
*   **NFR-2.1 Color Contrast:** All text and background color combinations in both light and dark themes MUST meet a minimum WCAG 2.1 AA contrast ratio of 4.5:1 for normal text and 3:1 for large text.

#### NFR-3: Performance
*   **NFR-3.1 Font Loading:** The 'Poppins' web font must be loaded efficiently to minimize any impact on the application's initial load time and prevent "flash of unstyled text" (FOUT).

#### NFR-4: Responsiveness
*   **NFR-4.1 Visual Integrity:** The branded look and feel must be maintained across all device sizes, from small mobile screens to large desktop monitors. Font sizes and element spacing must scale appropriately.
