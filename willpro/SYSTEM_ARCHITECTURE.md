
# System Architecture Guide

## 1. Overview

WillPro is a client-side, single-page application (SPA) built with React and TypeScript. Its primary function is to guide a user through a multi-step form to gather information and dynamically generate a "Last Will and Testament" document as a PDF. The architecture prioritizes simplicity, leveraging modern browser features and avoiding a complex build pipeline.

## 2. Technology Stack

- **Frontend Library:** **React 18.2.0** (using `React.StrictMode`).
- **Language:** **TypeScript** (via `.tsx` files for JSX syntax). Type safety is used for props and state.
- **PDF Generation:** **jsPDF**, a client-side library for generating PDFs directly in the browser.
- **Module System:** **Native ES Modules** with **Import Maps**. The application does not use a bundler like Webpack or Vite. Dependencies like React and jspdf are loaded directly from a CDN (`esm.sh`) via the `<script type="importmap">` tag in `index.html`.
- **Styling:** **Global CSS**. All styles are contained within a single `<style>` block in `index.html`. It uses modern CSS features and is fully responsive.

## 3. Project Structure

The project follows a component-based structure.

- **`index.html`**: The single HTML file and entry point for the application. It contains:
    - The root div (`<div id="root">`).
    - The global stylesheet.
    - The `importmap` for managing JavaScript dependencies.
    - The script tag to load the main `index.tsx` module.

- **`index.tsx`**: The root of the React application. It finds the `root` element and uses `ReactDOM.createRoot()` to render the main `App` component.

- **`App.tsx`**: The core component of the application. Its responsibilities include:
    - **State Management:** Holds all application-level state, including `currentStep`, `formData`, `auditLogs`, and modal visibility (`isModalOpen`).
    - **Routing:** A `switch` statement in the `renderStep` function acts as a simple router, rendering the correct step component based on `currentStep`.
    - **Logic & Handlers:** Contains all the event handlers (`handleNext`, `handleBack`, `handleChange`, `handleReset`, etc.) and business logic (audit log import/export).
    - **Prop Drilling:** Passes state and handlers down to child components as props.

- **`components/`**: This directory contains all the reusable React components.
    - **`ProgressBar.tsx`**: A presentational component that visually indicates the user's progress through the multi-step form.
    - **`[StepName]Step.tsx`**: Each of the 8 steps in the form is a dedicated component (e.g., `JurisdictionStep.tsx`, `TestatorStep.tsx`). They receive `formData` and callback functions as props. Some have internal state for their own inputs.
    - **`ReviewStep.tsx`**: A critical component that both displays the final summary and contains the logic for generating the PDF using `jsPDF`.
    - **`AuditLogModal.tsx`**: A reusable modal component for displaying, exporting, and importing audit logs.

- **`metadata.json`**: Configuration file for the hosting environment, specifying application name and permissions.

## 4. State Management and Data Flow

The application employs a centralized state management pattern within the `App` component, following a unidirectional data flow.

- **Source of Truth:** The `formData` state object in `App.tsx` is the single source of truth for all user-entered data.
- **Data Flow Down:** State (e.g., relevant parts of `formData`) is passed down from `App.tsx` to the active step component via props.
- **Events Flow Up:** When a user interacts with a form element in a step component, a callback function (e.g., `handleChange`), also passed down via props, is invoked. This function updates the state in the parent `App.tsx` component.
- **Re-render Cycle:** The state update in `App.tsx` triggers a re-render, and the updated data flows back down to the child components.

This approach keeps the step components "controlled" and relatively stateless, simplifying the overall architecture.

## 5. Key Features Architecture

### PDF Generation
- This logic is encapsulated within the `ReviewStep.tsx` component.
- When the "Generate Secure Document" button is clicked, the `handleGeneratePdf` function is triggered.
- It initializes a new `jsPDF` instance.
- It uses the `formData` prop to dynamically build the document, adding sections, text, and formatting based on the user's input.
- It includes logic for page breaks and adding a footer to every page.
- Finally, it uses `doc.save()` to trigger a download of the generated PDF in the user's browser.

### Audit Logging
- The `auditLogs` state is managed in `App.tsx`.
- The `addAuditLog` function creates a new log entry with a timestamp and updates the state. It is passed as a prop where needed (e.g., to `ReviewStep`).
- **Export/Import:** The logic uses the `FileReader` API for importing and `URL.createObjectURL` for exporting the `auditLogs` state as a JSON file.
