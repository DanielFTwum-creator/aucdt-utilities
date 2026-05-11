# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Studio Directive Workflow** is a React-based workflow management application designed to guide developers through standardized project phases for AI Studio projects. It provides a structured approach to implementing React 19.2.5 applications with built-in compliance checks, gap analysis requirements, and phase-based directives.

## Technology Stack

- **Framework**: React 19.2.5 (strict version requirement)
- **Build Tool**: Vite 7.3.1
- **Package Manager**: pnpm (required for all operations)
- **Styling**: Inline styles with gradient-based color system
- **Deployment**: Static build (Nginx, Netlify, Vercel compatible)

## Project Structure

```
ai-studio-directives/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/         # UI components
â”‚   â”‚   â”œâ”€â”€ Badge.jsx       # Status badges
â”‚   â”‚   â”œâ”€â”€ CopyButton.jsx  # Copy-to-clipboard functionality
â”‚   â”‚   â”œâ”€â”€ DirectiveCode.jsx  # Code block display
â”‚   â”‚   â”œâ”€â”€ DoneButton.jsx  # Completion toggle
â”‚   â”‚   â”œâ”€â”€ NavButton.jsx   # Navigation controls
â”‚   â”‚   â”œâ”€â”€ PhaseCard.jsx   # Main phase display
â”‚   â”‚   â”œâ”€â”€ PhaseDots.jsx   # Progress indicator
â”‚   â”‚   â”œâ”€â”€ ProgressBar.jsx # Progress visualization
â”‚   â”‚   â”œâ”€â”€ Sidebar.jsx     # Phase navigation sidebar
â”‚   â”‚   â”œâ”€â”€ SidebarItem.jsx # Individual sidebar items
â”‚   â”‚   â””â”€â”€ TopBar.jsx      # Header with progress
â”‚   â”œâ”€â”€ data/
â”‚   â”‚   â””â”€â”€ phases.js       # Phase definitions and content
â”‚   â”œâ”€â”€ App.jsx             # Main application component
â”‚   â”œâ”€â”€ main.jsx            # Entry point
â”‚   â””â”€â”€ index.css           # Global styles
â”œâ”€â”€ dist/                   # Build output (generated)
â”œâ”€â”€ index.html              # HTML entry point
â”œâ”€â”€ vite.config.js          # Vite configuration
â”œâ”€â”€ package.json
â”œâ”€â”€ pnpm-lock.yaml
â””â”€â”€ pnpm-workspace.yaml
```

## Development Commands

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm run dev
# Runs on http://localhost:5173 (default Vite port)
```

### Production Build
```bash
pnpm run build
# Outputs to dist/ directory
```

### Preview Production Build
```bash
pnpm run preview
```

## Application Architecture

### State Management

The application uses React's built-in hooks for state management:

- `active` (useState): Current phase index (0-7)
- `copied` (useState): Clipboard copy status with auto-reset
- `completed` (useState): Object tracking completion status by phase ID

```javascript
// State structure
{
  active: 0,              // Current phase index
  copied: false,          // Copy feedback state
  completed: {
    'session': true,
    'phase1': false,
    // ... other phases
  }
}
```

### Phase System

The application is built around 8 distinct phases defined in `src/data/phases.js`:

1. **SESSION START** - Initial requirements (always first)
2. **PHASE 1** - Foundation & Compliance (SRS, gap analysis)
3. **PHASE 2** - Security & Accessibility (admin auth, a11y)
4. **PHASE 3** - Testing Framework (Playwright, self-testing)
5. **PHASE 4** - Documentation & Diagrams (SVG diagrams, guides)
6. **PHASE 5** - Final Verification (100% SRS alignment)
7. **SINGLE SHOT** - All phases in one prompt (power mode)
8. **RESCUE** - Emergency troubleshooting (restore requirements)

Each phase object contains:
```javascript
{
  id: 'unique-id',              // Phase identifier
  label: 'DISPLAY NAME',        // Short label for UI
  icon: 'ðŸš€',                   // Emoji icon
  color: '#a78bfa',             // Primary color
  gradient: 'linear-gradient()', // Visual gradient
  title: 'Full Title',          // Display title
  subtitle: 'Description',      // Short description
  tag: 'Badge Text',            // Status badge
  content: `Multi-line text`    // Full directive content
}
```

### Key Features

1. **Copy-to-Clipboard**: One-click copying of phase directives
2. **Progress Tracking**: Visual progress bar and completion tracking
3. **Phase Navigation**: Sidebar, dots, and prev/next buttons
4. **Completion Markers**: Toggle completion status per phase
5. **Responsive Layout**: Fixed sidebar with scrollable content area

## Design System

### Color Palette

Each phase has a unique color scheme:

- Session Start: Purple (`#a78bfa`, `#7c3aed`)
- Phase 1: Green (`#34d399`, `#059669`)
- Phase 2: Blue (`#60a5fa`, `#2563eb`)
- Phase 3: Orange (`#fb923c`, `#ea580c`)
- Phase 4: Purple (`#c084fc`, `#9333ea`)
- Phase 5: Pink (`#f472b6`, `#db2777`)
- Single Shot: Yellow (`#fbbf24`, `#d97706`)
- Rescue: Red (`#f87171`, `#dc2626`)

### Dark Theme

The application uses a consistent dark color scheme:

- Background: `#0b0b1a`
- Secondary Background: `#0e0e24`
- Text: `#e2e8f0`
- Borders: `#1e1e3a`

## Important Conventions

### React Version Requirement

This project **strictly requires React 19.2.5**. This is enforced in:
- Session start requirements
- Phase 1 pre-flight checks
- All subsequent phase verifications
- Single-shot master directive
- Rescue troubleshooting

**Never upgrade or downgrade React version without explicit approval.**

### Permanent Requirements

The application enforces these permanent requirements across all phases:

1. React 19.2.5 ONLY
2. ZERO broken links (implement fully or exclude)
3. Gap analysis mandatory after implementation
4. ALL diagnostics in /admin section only
5. Update SRS to match actual implementation

### Phase-Based Workflow

When modifying phase content (`src/data/phases.js`):

- Maintain the sequential phase structure
- Keep pre-flight checks in each phase
- Ensure gap analysis requirements are present
- Preserve the two-way sync concept (SRS â†” Implementation)
- Never remove the React 19.2.5 requirement

## Deployment Configuration

### Vite Configuration

The project uses a relative base path for deployment flexibility:

```javascript
// vite.config.js
base: './'  // Allows deployment in subdirectories
```

### Path Alias

The `@` alias is configured for cleaner imports:

```javascript
// Import from src/
import Component from '@/components/Component'
```

### Build Output

Build generates a static site in `dist/`:
```
dist/
â”œâ”€â”€ index.html
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ index-[hash].js
â”‚   â””â”€â”€ index-[hash].css
â””â”€â”€ vite.svg
```

## Testing Configuration

Vitest is configured (though no tests currently exist):

```javascript
// vite.config.js
test: {
  globals: true,
  environment: 'happy-dom',
  setupFiles: './src/test/setup.ts',
  css: true
}
```

To add tests in the future:
1. Create `src/test/setup.ts`
2. Add test files as `*.test.jsx`
3. Run with `pnpm test` (after adding script to package.json)

## Component Guidelines

### Inline Styling Pattern

Components use inline styles for simplicity:

```javascript
<div style={{
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  background: '#0b0b1a'
}}>
```

### Gradient Backgrounds

Phase cards use CSS gradients for visual distinction:

```javascript
background: phase.gradient  // Uses phase-specific gradient
```

### Clipboard API Usage

Copy functionality uses the modern Clipboard API:

```javascript
navigator.clipboard.writeText(content).then(() => {
  setCopied(true)
  setTimeout(() => setCopied(false), 2200)
})
```

## Common Tasks

### Adding a New Phase

1. Add phase object to `PHASES` array in `src/data/phases.js`
2. Follow the existing structure with all required fields
3. Assign a unique `id` and color scheme
4. Include pre-flight checks and completion requirements
5. The UI will automatically update with the new phase

### Modifying Phase Content

1. Edit the `content` field in `src/data/phases.js`
2. Use template literals for multi-line content
3. Include checkbox items (â˜/âœ…) for tracking
4. Maintain consistent formatting with existing phases

### Changing Color Scheme

1. Update gradient values in phase objects
2. Modify base colors in App.jsx inline styles
3. Test visibility and contrast
4. Ensure accessibility standards are maintained

## Performance Considerations

- **Memoization**: Use `useCallback` for handlers to prevent re-renders
- **State Updates**: Batch state updates when possible
- **Copy Timeout**: Auto-reset copy state after 2.2 seconds
- **Navigation**: Keyboard shortcuts could be added for power users

## Accessibility Notes

Current implementation:
- Semantic HTML structure
- Keyboard navigation via Tab
- Click handlers on appropriate elements
- Color contrast on dark background

Potential improvements:
- Add ARIA labels to navigation buttons
- Keyboard shortcuts for phase navigation
- Screen reader announcements for phase changes
- Focus management for better keyboard UX

## Known Limitations

1. No persistence - completion state resets on page reload
2. No undo/redo functionality
3. No search/filter for phases
4. No export functionality for tracking
5. No user authentication or multi-user support

## Future Enhancement Ideas

- LocalStorage persistence for completion state
- Export completion report
- Keyboard shortcuts (e.g., Ctrl+C to copy)
- Search functionality for phase content
- Custom phase creation interface
- Integration with project management tools
- Progress export to JSON/PDF

## Deployment Steps

### Production Build
```bash
pnpm install --frozen-lockfile
pnpm run build
```

### Deploy to Nginx
```bash
# Copy dist/ contents to web root
cp -r dist/* /var/www/html/ai-studio/
```

### Deploy to Netlify/Vercel
```bash
# Build command: pnpm run build
# Publish directory: dist
```

### Deploy to Tomcat (WAR)
Not applicable - this is a client-side only application. Use reverse proxy or static hosting instead.

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm run build
```

### Development Server Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173  # Windows
lsof -i :5173                  # Unix/Mac

# Use alternative port
pnpm run dev -- --port 3000
```

### Copy Function Not Working
- Ensure HTTPS or localhost (Clipboard API requirement)
- Check browser console for permission errors
- Verify `navigator.clipboard` is available

## Git Workflow

This project is part of the aucdt-utilities monorepo:
- Work in `ai-studio-directives/` directory
- Commit changes with descriptive messages
- Reference parent CLAUDE.md for monorepo practices

## Support

For issues or questions:
- Check parent repository CLAUDE.md
- Review React 19.2.5 documentation
- Consult Vite documentation for build issues
