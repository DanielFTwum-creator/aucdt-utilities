# CLAUDE.md - AI Assistant Guide for aucdt-utilities

## Project Overview

**ThesisAI Frontend** - A React/TypeScript web application for AI-powered thesis assessment. This is the frontend component of the AUCDT (African University College of Digital Technologies) utilities platform.

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

## Project Structure

```
aucdt-utilities/
├── src/                    # Source code directory
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main App component
│   └── index.css          # Tailwind CSS imports
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── pnpm-lock.yaml         # Lockfile for reproducible installs
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── Dockerfile             # Docker build configuration
├── nginx.conf             # Nginx server configuration
└── LICENSE                # MIT License
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
```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`
- **JSX**: Uses `react-jsx` transform (no need to import React in every file)
- **Module System**: ES Modules (`"type": "module"`)

### Styling Conventions

- Use Tailwind CSS utility classes for styling
- Custom color palette defined in `tailwind.config.js`:
  - `academic-navy`: #1e3a5f
  - `academic-blue`: #2563eb
  - `academic-amber`: #f59e0b
  - `academic-gold`: #fbbf24
  - `academic-slate`: #475569
- Font families:
  - Serif: `Crimson Text`, `Georgia`
  - Sans: `Inter`, `system-ui`

### Component Development

- Place React components in `src/` directory
- Use TypeScript for all component files (`.tsx`)
- Follow React 19 best practices
- Use Framer Motion for animations
- Use Lucide React for icons

### API Integration

- API proxy configured to `http://localhost:8080` for `/api` routes
- Use Axios for HTTP requests
- Backend service expected at `backend:8080` in Docker environment

## Docker Deployment

### Build Image
```bash
docker build -t thesisai-frontend .
```

### Run Container
```bash
docker run -p 80:80 thesisai-frontend
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

### Tailwind (`tailwind.config.js`)
- Content sources: `index.html` and `src/**/*.{js,ts,jsx,tsx}`
- Extended theme with academic color palette

## Important Notes for AI Assistants

1. **Package Manager**: Always use `pnpm` (version 8.15.0) - do not use npm or yarn.

2. **API Backend**: This frontend expects a backend API service. During development, it proxies to `localhost:8080`. In Docker, it connects to `backend:8080`.

3. **Fonts**: Google Fonts (Crimson Text, Inter) are loaded via CDN in `index.html`.

4. **React Version**: Using React 19 - use modern React patterns (hooks, function components, no class components).

5. **Styling**: Use Tailwind CSS utility classes with the custom `academic-*` color palette.

## License

MIT License - Copyright (c) 2025 DanielFTwum-creator
