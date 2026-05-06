# Technology Stack — Mirror Truth

## Overview
Mirror Truth is a client-side React application designed for high-fidelity, interactive image manipulation and export. It utilizes a modern, build-less architecture relying on ES Modules delivered via CDN.

## Core Framework
*   **Runtime:** Browser (ES6+ Support required)
*   **Library:** React 19.2.4
*   **DOM Manipulation:** React DOM 19.2.4
*   **Module Loading:** Native ES Modules (via `importmap`)

## Styling & UI
*   **Utility Framework:** Tailwind CSS (v3.4 via CDN)
*   **Typography:** 
    *   *Bebas Neue* (Headlines)
    *   *JetBrains Mono* (Technical/Data)
    *   *Playfair Display* (Editorial variant)
*   **Icons:** Lucide React (v0.564.0)

## Functional Libraries
*   **Image Export:** `html-to-image` (v1.11.11) - Handles DOM-to-PNG rasterization.
*   **File Handling:** Native Browser File API (Blob URLs).

## Architecture
*   **Entry Point:** `index.html` loads `index.tsx`.
*   **State Management:** React `useState` & `useReducer` (Local component state).
*   **Component Structure:**
    *   `App.tsx`: Main orchestrator and layout container.
    *   `components/Controls.tsx`: UI for user input and configuration.
    *   `components/ThumbnailArt.tsx`: The visual canvas/render target.
    *   `components/Annotations.tsx`: Static visual style guide.
*   **Types:** TypeScript interfaces defined in `types.ts`.

## Performance Considerations
*   **Rendering:** React StrictMode enabled.
*   **Exporting:** Cache-busting disabled for Blob URLs to ensure export stability.
*   **Animations:** CSS Keyframes used for "Glitch" and "Pulse" effects to minimize JS thread blocking.
