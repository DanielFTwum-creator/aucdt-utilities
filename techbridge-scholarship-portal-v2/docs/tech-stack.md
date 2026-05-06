# Technology Stack Documentation

## Frontend Architecture
*   **Core Library**: React 19.2.4
*   **Bundler/Runtime**: ES Modules (via `esm.sh` for browser-native import)
*   **Language**: TypeScript (Strict Mode)

## UI/UX Design System
*   **CSS Framework**: Tailwind CSS v3.4 (via CDN)
*   **Typography**:
    *   *Body*: 'Inter' (Sans-serif) - Clean, modern readability.
    *   *Signature*: 'Dancing Script' (Cursive) - Emulates handwriting for digital signing.
*   **Iconography**: `lucide-react` v0.563.0 - Consistent, scalable vector icons.
*   **Motion**: CSS Transitions & Tailwind `animate-in` utilities.

## Data & State
*   **State Management**: React `useState` (Local Component State).
*   **Data Structure**: Typed interfaces defined in `types.ts`.
*   **Validation**:
    *   Regex-based email validation.
    *   Boolean logic for required fields.

## API & Network
*   **Protocol**: HTTPS / JSON.
*   **Mocking**: In-memory delay simulation (`services/api.ts`).
*   **Error Handling**: Try/Catch blocks with alert feedback.

## Development Standards
*   **Code Formatting**: Standard Prettier/ESLint rules (implied).
*   **Component Structure**: Functional Components with Hooks.
*   **Directory Structure**:
    *   `/components`: Reusable UI parts (`ui/`) and logical steps (`steps/`).
    *   `/services`: External communication.
    *   `/docs`: Project documentation.
