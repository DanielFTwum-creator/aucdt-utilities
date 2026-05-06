# Creation Guide: TECHBRIDGE Scholarship Portal (v1.2)

This comprehensive guide provides the complete blueprint for reproducing the TECHBRIDGE Scholarship Portal from scratch. It integrates all functional requirements from the SRS and technical specifications from the project's architecture.

---

## 1. Project Specifications (SRS Integration)

### 1.1 Goal
Create a best-in-class, accessible Single Page Application (SPA) for digitizing scholarship bonds with legal attestation, AI-powered form auditing, and automated administrative diagnostics.

### 1.2 Tech Stack
- **Framework**: React 19.2.4 (ESM native import via esm.sh)
- **Styling**: Tailwind CSS (CDN) with custom config.
- **AI Engine**: Google Gemini API (@google/genai).
- **Icons**: Lucide React.
- **Persistence**: Browser LocalStorage.

---

## 2. Phase 1: Foundations & App Manifest

### 2.1 Project Initialization
1.  Set up an `index.html` as the entry point using the modern ESM module pattern.
2.  Include the import map for React, Lucide, and the GenAI SDK.
3.  **PWA Configuration**: Create `manifest.json` and `sw.js` for offline support.
    - Set `display: standalone` for an app-like experience.
    - Register the service worker in `index.html`.
    - Implement a `beforeinstallprompt` listener in the root layout to handle manual installation triggers.

### 2.2 Global Styling & Themes
Implement the three-tier theme system in `index.html` via CSS variables:
1.  **Light Mode**: Slate/Blue palette.
2.  **Dark Mode**: Deep Navy/Slate palette.
3.  **High Contrast Noir**: Pure Black (#000) background, White (#FFF) borders, and "Electric Lime" (#C6FF00) accents. 
    - *Requirement*: Use a "Cyber-Hatch" dot pattern for card backgrounds in High Contrast mode to maintain a premium aesthetic while ensuring WCAG AAA compliance.

---

## 3. Phase 2: Data Models & Core Infrastructure

### 3.1 Type Definitions (`types.ts`)
Define the strictly typed interfaces for:
- `ScholarDetails`: Title, Name, ID, Parent Name, Address, Email, Phone.
- `ProgramDetails`: Dept, Duration, FundingSource, PhD Subject, Service Years (Default: 3).
- `Guarantor`: Name, ID, Address, Phone.
- `WitnessDetails`: dual witnesses (Techbridge and Scholar) with Name and ID.
- `FormData`: The root object containing all sections plus signature metadata.

### 3.2 Audit & Toast Systems
1.  **Audit Log Service**: Create `services/auditLog.ts` to capture JSON events (Timestamp, Action, Details, User) to LocalStorage.
2.  **Toast Notification System**: Build `components/ui/Toast.tsx`.
    - Support types: `success`, `error`, `warning`, `info`.
    - Ensure toasts adapt to the High Contrast theme with double-border indicators.

---

## 4. Phase 3: Layout & Navigation Engine

### 4.1 Global Layout (`components/Layout.tsx`)
- Implement a responsive header with the Techbridge logo (scaled for prominence).
- Integrate the `ThemeSwitcher` for Light/Dark/High-Contrast toggling.
- Handle Web Share API for mobile "portal sharing".

### 4.2 The Wizard Control (`components/StepIndicator.tsx`)
Create a progress bar with 4 distinct stages as defined in the SRS:
1.  **Scholar Identity** (FR-01, FR-02, FR-03)
2.  **Academic Bond** (FR-04, FR-05, FR-06)
3.  **Legal Witnesses** (FR-07, FR-08)
4.  **Review & Execute** (FR-09, FR-10, FR-11, FR-12, FR-16, FR-17)

---

## 5. Phase 4: Functional Form Development

### 5.1 Reusable UI Library
- `<Input />`: Built-in ARIA support, error state handling, and label synchronisation.
- `<Section />`: Container component for grouping fields with headers.

### 5.2 Step Implementation Details
- **Step 1**: Form metadata (date/location) and personal details. Email and Phone regex validation.
- **Step 2**: Academic programme data. Mandatory "Service Bond" warning clause that dynamically updates string values based on input.
- **Step 3**: Guarantor details (conditionally mandatory) and dual witnesses for legal attestation.
- **Step 4**: **Review & Signature Pad**:
    - Summarise all data for user verification.
    - Implement the **Dual Signature Pad**:
        - **Font Mode**: Uses 'Dancing Script' cursive font.
        - **Draw Mode**: Uses an HTML5 `<canvas>` element with `toDataURL()` for capturing handwritten strokes as PNG Base64.

---

## 6. Phase 5: The Intelligent Layer (Gemini AI)

### 6.1 Expert Form Audit (FR-07, FR-08)
Integrate the `GoogleGenAI` client in `App.tsx` to perform a "Readiness Audit":
- **Model**: `gemini-3-flash-preview`.
- **Logic**: Pass `formData` to the model with instructions to evaluate professional tone and eligibility markers.
- **Response Schema**: Expect JSON `{ "score": number, "feedback": "string" }`.
- **UI**: A specialized analysis card with a "Brain Circuit" loader.

---

## 7. Phase 6: Administration & Submission

### 7.1 Security & Diagnostics (FR-09, FR-10, FR-11)
- **Admin Panel**: Restricted area to view Audit Logs and clear system state.
- **Test Runner**: Implement a simulation engine in `components/admin/TestDashboard.tsx` that uses `MOCK_TEST_DATA` to auto-populate the form steps and trigger submission.

### 7.2 API Submission Logic (FR-12, FR-13, FR-14, FR-15)
Map the `FormData` state to the required **EmailDetails DTO** in `services/api.ts`:
- Build a structured human-readable `message` report.
- Attach signatures as PNG buffers in the `attachments` array.
- **Action**: Perform a `POST` request to `https://portal.aucdt.edu.gh/aucdt-dev/sendMail`.
- **Fallback**: Implement a simulation mode if the network is unavailable or in development.

---

## 8. Deployment Requirements
- Host as a static SPA (Netlify/Vercel).
- Register the Service Worker in the root `index.html`.
- Ensure PWA `manifest.json` is linked correctly with high-res icons.
- Set `overscroll-behavior-y: contain` on the `body` to prevent mobile browser refresh during canvas signature drawing.