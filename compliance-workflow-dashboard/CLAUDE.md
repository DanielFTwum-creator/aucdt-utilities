# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Compliance Workflow Dashboard**, a client-side React application that helps developers track and manage project compliance implementations across various frameworks (HIPAA, PCI-DSS, Standard Project Refresh, etc.). The application breaks down compliance workflows into actionable phases with AI-generated directives that can be copied and used in AI development environments.

## Development Commands

```bash
# Install dependencies (uses pnpm but npm works too)
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note:** The build is configured with `base: './'` in `vite.config.ts` to generate relative asset paths. This ensures the built application works correctly when deployed to subdirectories or file systems without requiring manual path fixes.

## Environment Setup

The application requires a Google Gemini API key for the AI-driven self-testing feature:

1. Set `GEMINI_API_KEY` in `.env.local`
2. The key is accessed via `process.env.API_KEY` in the code (see vite.config.ts line 14)

## High-Level Architecture

### Tech Stack
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (utility classes only, no custom CSS files)
- **AI Integration**: Google Gemini API (@google/genai)
- **Data Persistence**: Browser localStorage (no backend)

### Application Structure

This is a **purely client-side application** with no backend server. All data persists in browser localStorage.

#### Key Architectural Components:

1. **Framework System** (`constants.ts`)
   - Defines all compliance frameworks (Standard, HIPAA, PCI-DSS, SOC2, ISO27001)
   - Each framework contains multiple phases with directives
   - Directives are long-form instructions meant to be copied to AI tools
   - Structure: `FRAMEWORKS` object maps framework keys to `{ name, color, phases[] }`

2. **State Management** (`hooks.ts`)
   - `useLocalStorage<T>`: Custom hook for persisting React state to localStorage
   - `useSimpleHash`: SHA-256 hashing for admin password (client-side only)
   - No external state management library - uses React hooks only

3. **Component Hierarchy**:
   ```
   App.tsx (minimal wrapper)
   └── ComplianceWorkflowDashboard.tsx (main component)
       ├── ThemeSwitcher.tsx
       ├── AdminPanel.tsx (modal)
       └── PlaywrightSelfTest.tsx (tab view)
   ```

4. **Data Storage Architecture** (localStorage keys):
   - `compliance-progress`: Object mapping phase IDs to status ('complete' | 'in-progress' | 'blocked')
   - `compliance-theme`: Selected UI theme ('light' | 'dark' | 'high-contrast')
   - `admin-password-hash`: SHA-256 hash of admin password
   - `admin-audit-log`: Array of audit log entries with timestamps

5. **Theme System**:
   - Three themes: light (default), dark, high-contrast (accessibility)
   - Implemented via CSS utility classes with `dark:` and `hc-*` prefixes
   - Dark mode uses `.dark` class on document root
   - High contrast uses `data-theme="high-contrast"` attribute

### Core Features & Implementation Details

#### 1. Phase Tracking System
- Users select a framework, view its phases, and mark status (in-progress/complete/blocked)
- Each phase has expandable directive text that can be copied to clipboard
- Progress bar shows completion percentage for current framework
- Status changes auto-save to localStorage via `useLocalStorage` hook

#### 2. Admin Panel (AdminPanel.tsx)
- Password-protected modal for administrative functions
- First-time setup: creates password (min 8 chars), stores SHA-256 hash
- Subsequent access: validates password against stored hash
- Features: change password, view/clear audit log
- Audit log records: login, failed login, password changes, log clearing

#### 3. AI-Driven Self-Testing (PlaywrightSelfTest.tsx)
- Sends prompt to Gemini API requesting simulated Playwright tests
- Gemini generates and "executes" test scenarios, returning results as streaming JSON
- Parses streaming response using regex to extract individual test result objects
- Displays real-time test results with status icons and optional screenshots
- Test results include: name, status (passed/failed), error message, base64 screenshot

#### 4. Streaming JSON Parser
- Located in `PlaywrightSelfTest.tsx` (`parseStreamingJson` function)
- Extracts JSON objects from Gemini's streaming text response
- Handles incomplete JSON gracefully during streaming

## Important Implementation Notes

### Adding New Frameworks
To add a new compliance framework:
1. Edit `constants.ts` → add entry to `FRAMEWORKS` object
2. Follow the existing structure: `{ name, color (Tailwind class), phases[] }`
3. Each phase needs: `id` (unique), `name`, `items[]` (tags), optional `directive` (long text)

### Modifying Phases
- Phase IDs must be unique across ALL frameworks (used as localStorage keys)
- Directive text supports markdown formatting (displayed in `<pre>` tag)
- Phase items are short tags displayed as pills in the UI

### Styling Approach
- Uses Tailwind CSS utility classes exclusively
- No custom CSS files or styled-components
- Dark mode: prefix utilities with `dark:` (e.g., `dark:bg-slate-800`)
- High contrast: uses `hc-*` custom classes defined in index.html styles
- Responsive design: uses `sm:` and `md:` breakpoint prefixes

### localStorage Best Practices
- Always use `useLocalStorage` hook for persistent state
- Hook automatically syncs state changes to localStorage
- Delete keys (don't set to null) when clearing data: `delete newStatuses[phaseId]`

### Security Considerations
- Password hashing is SHA-256 but CLIENT-SIDE ONLY (not secure for real auth)
- No sensitive data should be stored (everything is in browser localStorage)
- Admin panel is a convenience feature, not true security

## Testing
There is no automated test suite. The application includes:
- AI-driven "Playwright Self-Test" feature that simulates testing via Gemini API
- Manual testing recommended for critical workflows

## Documentation
Comprehensive documentation exists in `docs/`:
- `CLAUDE.md.md`: Full SRS document (Software Requirements Specification)
- `AdministratorGuide.md`: Admin panel usage
- `DeploymentGuide.md`: Production deployment steps
- `TestingGuide.md`: Testing instructions
- SVG diagrams: system_architecture.svg, database_architecture.svg

## Common Development Tasks

### Modifying Framework Directives
Edit the `directive` property in `constants.ts` for any phase. These are multi-line strings that get copied to clipboard.

### Changing Theme Colors
Theme colors are applied via Tailwind classes and CSS variables. The main color for each framework is the `color` property (e.g., `bg-blue-500`).

### Adding New Admin Features
Extend `AdminPanel.tsx` and use the `addLog()` function to record actions in audit log.

### Debugging localStorage Issues
Open browser DevTools → Application tab → Local Storage to inspect stored data directly.
