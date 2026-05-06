# GEMINI.md

## Project Overview

This project is a React-based web application built with Vite and TypeScript. It appears to be an analytics dashboard for "AUCDT". The project uses a variety of modern front-end technologies, including:

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with `postcss`
*   **UI Components:** A mix of custom components and components from a library like `shadcn/ui` (judging by the `components.json` and the UI components in `src/components/ui`).
*   **Charting:** `chart.js`, `recharts`, and `react-chartjs-2` are used for data visualization.
*   **Routing:** `react-router-dom` is used for client-side routing.
*   **Linting:** ESLint with TypeScript support.

The application seems to be structured with a main `App.tsx` component that renders a `Dashboard` or `EnhancedDashboard` component. The dashboard itself is composed of several tabs, each displaying different data visualizations.

## Building and Running

The following scripts are available in `package.json`:

*   **`dev`**: `pnpm install && vite`
    *   This command first installs the dependencies and then starts the Vite development server. This is the primary command to use for local development.

*   **`build`**: `pnpm install --no-frozen-lockfile && rm -rf ./node_modules/.vite-temp && tsc -b && vite build`
    *   This command builds the application for production. It installs dependencies, runs the TypeScript compiler, and then uses Vite to create a production-ready build in the `dist` directory.

*   **`lint`**: `pnpm install && eslint .`
    *   This command runs ESLint to check the code for any linting errors.

*   **`preview`**: `pnpm install && vite preview`
    *   This command starts a local server to preview the production build.

**To run the project locally, you should use the `dev` command:**

```bash
pnpm dev
```

## Development Conventions

*   **Package Manager:** The project uses `pnpm` as the package manager. This is indicated by the presence of `pnpm-lock.yaml`.
*   **Styling:** The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.
*   **Component Structure:** The `src/components` directory is well-organized, with subdirectories for `charts`, `tabs`, and `ui`. This suggests a modular and reusable component architecture.
*   **Aliasing:** The project uses path aliasing, with `@` pointing to the `src` directory. This is configured in `vite.config.ts`.
*   **Deployment:** The `base` property in `vite.config.ts` is set to `/aucdt-analytics-dashboard/`, which means the application is intended to be deployed to a subdirectory of a domain.
