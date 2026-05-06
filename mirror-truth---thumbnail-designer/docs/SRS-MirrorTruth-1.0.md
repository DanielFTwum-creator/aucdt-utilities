# Software Requirements Specification (SRS)
## Project: Mirror Truth — Thumbnail Designer
**Version:** 1.0  
**Status:** Phase 1 Baseline

---

## 1. Introduction

### 1.1 Purpose
The purpose of the "Mirror Truth" application is to provide content creators with a specialized tool for generating high-quality, cyberpunk-aesthetic YouTube thumbnails. It automates complex CSS compositing, split-face effects, and typographic layouts that would otherwise require advanced photo editing software.

### 1.2 Scope
The application runs entirely in the browser. It allows users to upload imagery, customize text, adjust composition geometry, and export the final result as a PNG file.

---

## 2. Functional Requirements

### 2.1 Configuration & Customization
*   **FR-01 Artist Identity:** User shall be able to input an "Artist Name".
*   **FR-02 Typography:** User shall be able to input "Hook Text" and an "Accent Word".
*   **FR-03 Text Styling:** User shall be able to adjust letter spacing and font weight.
*   **FR-04 Variants:** The system shall support three distinct visual themes:
    *   *Original* (Amber/Teal split)
    *   *Neon Void* (Purple/Pink/Dark high contrast)
    *   *Editorial* (Clean, serif-based typography)

### 2.2 Image Management
*   **FR-05 Image Upload:** User shall be able to upload two separate images:
    *   "Left Face" (associated with Truth/Present theme)
    *   "Right Face" (associated with Shadow/Past theme)
*   **FR-06 Drag & Drop:** User shall be able to drag image files directly onto the left or right sections of the canvas to upload.
*   **FR-07 Image Adjustment:** For each uploaded image, the user shall be able to control:
    *   Scale (Zoom)
    *   Horizontal Position (X)
    *   Vertical Position (Y)

### 2.3 Canvas Composition
*   **FR-08 Face Frame Control:** User shall be able to adjust the global container holding both split faces:
    *   Global Scale
    *   Global X/Y Position
    *   Split Gap (Spread) between left and right sections.
*   **FR-09 Visual Aids:**
    *   *Safe Zones:* Overlay showing YouTube timestamp and UI obstruction areas.
    *   *Rule of Thirds:* Grid overlay for composition.
    *   *CSS Face Structure:* Toggleable schematic overlay of facial features (eyes, nose, mouth guides).
*   **FR-10 Animation:** User shall be able to toggle "Glitch" and "Pulse" animations on/off.

### 2.4 Output & Export
*   **FR-11 Preview Scaling:** The preview area shall automatically scale to fit the user's viewport while maintaining the 1280x720 aspect ratio.
*   **FR-12 Export:** User shall be able to download the composed canvas as a `.png` file at 1280x720 resolution.
*   **FR-13 Share:** User shall be able to invoke the native Web Share API (if supported) to share the image.

---

## 3. Non-Functional Requirements

### 3.1 Usability
*   **NFR-01 Responsiveness:** The UI controls shall wrap appropriately on smaller screens.
*   **NFR-02 Feedback:** Hover states shall indicate interactive elements. Drag-over states shall highlight drop zones.

### 3.2 Performance
*   **NFR-03 Real-time Rendering:** Adjustments to sliders and inputs shall reflect immediately (<16ms latency) on the canvas.
*   **NFR-04 Export Speed:** Image generation should complete within 2 seconds on average devices.

### 3.3 Reliability
*   **NFR-05 Export Integrity:** The exported image must exactly match the visual state of the canvas (excluding UI helpers like grids).
*   **NFR-06 Offline Capability:** The application core logic relies on local resources (after initial load), though fonts and Tailwind load via CDN.

---

## 4. User Interface Guidelines

### 4.1 Aesthetic Theme
*   **Background:** Deep Black (#111)
*   **Text:** Light Grey (#ccc)
*   **Accents:** Burnt Amber (#D4760A) and Cyan Shadow (#0A6E6E).
*   **Fonts:** Monospace for UI controls, Display fonts for Canvas.

### 4.2 Layout
*   **Header:** Branding and title.
*   **Controls:** Top-aligned panel containing all inputs.
*   **Canvas:** Centered, scaled viewport.
*   **Annotations:** Bottom section explaining design decisions (Static).

---
**End of SRS**
