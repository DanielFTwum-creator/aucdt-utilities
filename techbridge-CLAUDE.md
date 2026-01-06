# CLAUDE.md - AI Assistant Guide for Techbridge University College

## Project Overview

**ThesisAI Frontend** - A React/TypeScript web application for AI-powered thesis assessment. This is the frontend component of the Techbridge University College thesis evaluation platform.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.2.0 |
| Language | TypeScript | 5.9.3 |
| Build Tool | Vite | 7.2.4 |
| Styling | Tailwind CSS | 4.1.17 |
| Package Manager | pnpm | 8.15.0 |
| HTTP Client | Axios | 1.13.2 |
| Routing | React Router DOM | 7.9.6 |
| Animations | Framer Motion | 12.23.24 |
| Icons | Lucide React | 0.554.0 |
| Charts | Recharts | 3.5.0 |
| Testing | Vitest | 4.0.13 |
| Test Library | React Testing Library | 16.3.0 |

## Project Structure

```
techbridge-university-college/
├── src/                    # Source code directory
│   ├── components/        # React components
│   ├── context/          # Context providers
│   ├── lib/              # Utility libraries
│   ├── test/             # Test suites
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Tailwind CSS imports
├── docs/                  # Documentation
│   ├── svg/              # Technical diagrams
│   ├── presentation/     # Presentation materials
│   └── README.md         # Documentation index
├── components/           # Shared components
├── context/             # Global context
├── lib/                 # Utilities
├── dist/                # Build output
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── pnpm-lock.yaml       # Lockfile for reproducible installs
├── vite.config.ts       # Vite configuration
├── vitest.config.ts     # Vitest test configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── Dockerfile           # Docker build configuration
└── LICENSE              # MIT License
```

## Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server (port 3000)
pnpm start
# or
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check (lint)
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate test coverage report
pnpm test:coverage
```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`
- **JSX**: Uses `react-jsx` transform (no need to import React in every file)
- **Module System**: ES Modules (`"type": "module"`)
- **Formatting**: Follow Prettier and ESLint configurations

### Styling Conventions

- Use Tailwind CSS utility classes for styling
- Custom color palette defined in `tailwind.config.js`:
  - `techbridge-navy`: #1e3a5f
  - `techbridge-blue`: #2563eb
  - `techbridge-amber`: #f59e0b
  - `techbridge-gold`: #fbbf24
  - `techbridge-slate`: #475569
- Font families:
  - Serif: `Crimson Text`, `Georgia`
  - Sans: `Inter`, `system-ui`

### Component Development

- Place React components in `src/components/` directory
- Use TypeScript for all component files (`.tsx`)
- Follow React 19 best practices (function components, hooks)
- Use Framer Motion for animations
- Use Lucide React for icons
- Export components using named exports when possible

### Testing Requirements

- Maintain **100% test coverage** for all components
- Write tests using Vitest and React Testing Library
- Place test files in `src/test/` directory
- Test file naming: `[Component].test.tsx`
- Cover:
  - Component rendering
  - User interactions
  - Props validation
  - Accessibility
  - Edge cases

### API Integration

- API proxy configured to `http://localhost:8080` for `/api` routes
- Use Axios for HTTP requests
- Backend service expected at `backend:8080` in Docker environment
- Environment variables in `.env.local`:
  ```env
  VITE_API_BASE_URL=http://localhost:8080
  ```

## Docker Deployment

### Build Image
```bash
docker build -t techbridge-frontend .
```

### Run Container
```bash
docker run -p 80:80 techbridge-frontend
```

The Dockerfile uses:
1. Multi-stage build (Node 18 Alpine for build, Nginx Alpine for serve)
2. pnpm for dependency management
3. Nginx for serving static files with SPA routing support

## Configuration Files

### TypeScript (`tsconfig.json`)
- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled
- Source files expected in `src/` directory

### Vite (`vite.config.ts`)
- React plugin enabled
- Dev server on port 3000
- API proxy to port 8080

### Vitest (`vitest.config.ts`)
- JSDOM environment for React testing
- Coverage provider: v8
- Test globals enabled

### Tailwind (`tailwind.config.js`)
- Content sources: `index.html` and `src/**/*.{js,ts,jsx,tsx}`
- Extended theme with Techbridge color palette
- Custom font families

## Important Notes for AI Assistants

1. **Package Manager**: Always use `pnpm` (version 8.15.0) - do not use npm or yarn.

2. **API Backend**: This frontend expects a backend API service. During development, it proxies to `localhost:8080`. In Docker, it connects to `backend:8080`.

3. **Fonts**: Google Fonts (Crimson Text, Inter) are loaded via CDN in `index.html`.

4. **React Version**: Using React 19 - use modern React patterns (hooks, function components, no class components).

5. **Styling**: Use Tailwind CSS utility classes with the custom `techbridge-*` color palette.

6. **Testing**: Maintain 100% test coverage. All new features must include comprehensive tests.

7. **TypeScript**: Use strict typing. Avoid `any` types unless absolutely necessary.

8. **Component Structure**: Keep components small and focused. Extract reusable logic into custom hooks.

9. **State Management**: Use React Context API for global state. Avoid prop drilling.

10. **Performance**: Use React.memo, useMemo, and useCallback appropriately. Lazy load routes and heavy components.

## Common Tasks

### Adding a New Component

```bash
# 1. Create component file
src/components/MyComponent.tsx

# 2. Create test file
src/test/MyComponent.test.tsx

# 3. Write component with TypeScript
# 4. Write comprehensive tests
# 5. Verify 100% coverage
pnpm test:coverage
```

### Adding a New Page/Route

```bash
# 1. Create page component in src/components/pages/
# 2. Add route in src/App.tsx or routing config
# 3. Add navigation link
# 4. Write tests
# 5. Verify routing works
```

### Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update package-name

# Update all packages (carefully)
pnpm update

# Verify tests still pass
pnpm test
pnpm build
```

### Environment Variables

Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=ThesisAI - Techbridge
VITE_MAX_FILE_SIZE=10485760
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check
pnpm lint

# Build
pnpm build
```

### Test Failures

```bash
# Run tests in watch mode
pnpm test:watch

# Run with UI for debugging
pnpm test:ui

# Check coverage
pnpm test:coverage
```

### Development Server Issues

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill

# Restart server
pnpm dev
```

## Best Practices

1. **Component Design**
   - Single Responsibility Principle
   - Props interface with TypeScript
   - Proper prop validation
   - Accessibility (ARIA labels, semantic HTML)

2. **State Management**
   - Keep state close to where it's used
   - Lift state only when necessary
   - Use Context for truly global state

3. **Performance**
   - Memoize expensive calculations
   - Lazy load routes
   - Optimize images
   - Use proper key props in lists

4. **Testing**
   - Test user behavior, not implementation
   - Use semantic queries (getByRole, getByText)
   - Test accessibility
   - Mock external dependencies

5. **Git Workflow**
   - Feature branches
   - Descriptive commit messages
   - Pull request reviews
   - Keep commits atomic

## License

MIT License - Copyright (c) 2026 Techbridge University College

---

**For questions or issues, contact the development team at dev@techbridge.edu**
