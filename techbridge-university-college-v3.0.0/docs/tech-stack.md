
# Techbridge University College - Technology Stack

## Overview
The TUC Digital Ecosystem is a modern, decentralized Single Page Application (SPA) designed for high performance, accessibility, and AI integration.

## Core Technologies

### Frontend Framework
*   **React 18.3+**: Utilizing the latest features including Hooks and Functional Components.
*   **TypeScript (Strict)**: Ensuring type safety and code robustness across the codebase.
*   **Vite**: Next-generation frontend tooling for fast development and optimized production builds.

### Styling & UI
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design system implementation.
*   **Lucide React**: Lightweight, consistent icon library.
*   **CSS Modules/Global Styles**: For high-contrast themes and specific animations.

### Artificial Intelligence
*   **Google Gemini 3 Pro**: Advanced multimodal model integration via `@google/genai`.
*   **Stream API**: Real-time response streaming for the BridgeBot assistant.

### State & Persistence
*   **React Context API**: Managing global application state (Theme, UI, Auth).
*   **LocalStorage API**: Client-side persistence for user preferences, themes, and audit logs.

### Analytics
*   **Google Analytics 4 (GA4)**: Integrated via `gtag.js` with custom SPA route tracking logic.

### Testing & Quality Assurance
*   **Playwright-Lite**: A custom, browser-side implementation of Playwright for self-testing critical user journeys without external Node dependencies.
*   **Jest/React Testing Library**: (Planned for Phase 3 expansion).

## Architecture
The application follows a component-based architecture where logical units (Header, Hero, Admin, Chat) are encapsulated. Data flows unidirectionally, with critical services (AuditLogger, Gemini) abstracted into library modules.

*   **Entry Point**: `index.html` -> `index.tsx` -> `App.tsx`
*   **Routing**: `react-router-dom` (HashRouter for broad compatibility).
