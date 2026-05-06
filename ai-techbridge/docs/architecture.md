
# System Architecture
## AI @ TechBridge Portal

### 1. High-Level Topology
The application follows a client-side micro-architecture powered by React 19.

**Core Layers**:
1.  **Presentation Layer**: React Components + Tailwind CSS v4. Handles all UI rendering, themes (Light/Dark/Contrast), and SVG visualizations.
2.  **Orchestration Layer**: 
    - `AuthGuard`: Manages Admin session state and timeouts.
    - `AuditService`: Serializes events to LocalStorage.
    - `TestSuite`: Runs self-diagnostic heuristics.
3.  **Data Layer**:
    - `constants.tsx`: Static registry of Research Topics and Faculty Data.
    - `Google GenAI SDK`: Direct interface to `gemini-3-flash-preview`.

### 2. Database Schema (Local Registry)
Although the application is an SPA, it maintains a structured data schema for the Directory and Audit systems.

**Directory Registry (`AppEntry`)**:
- `id`: UUID (String)
- `title`: String
- `category`: Enum (Development, Design, etc.)
- `description`: Text
- `path`: URL String

**Audit Ledger (`AuditEntry`)**:
- `id`: Unique Hash
- `timestamp`: ISO 8601 Date
- `user`: String (Actor)
- `action`: String (Event Type)
- `details`: Text Payload

### 3. Key Dependencies
- **React 19**: Rendering Engine.
- **@google/genai**: AI connectivity.
- **Lucide React**: Iconography.
- **Tailwind CSS**: Utility-first styling.
