# Copilot Instructions for Aucdt Analytics Dashboard

## Overview
This project is a React application built with TypeScript and Vite, designed for analytics dashboards. It utilizes various UI components and libraries to create a responsive and interactive user experience.

## Architecture
- **Main Entry Point**: The application starts from `src/App.tsx`, which renders the `EnhancedDashboard` component.
- **Component Structure**: Components are organized under the `src/components` directory, with UI components located in `src/components/ui`. This structure promotes reusability and separation of concerns.
- **Routing and State Management**: The application may use React Router for navigation and React Context or Redux for state management (if applicable).

## Developer Workflows
- **Development**: Run `pnpm dev` to start the development server with hot module replacement (HMR).
- **Building**: Use `pnpm build` to compile the application for production. This command also runs TypeScript compilation and cleans up temporary files.
- **Testing**: Execute `pnpm test` to run unit tests using Vitest.
- **Linting**: Run `pnpm lint` to check code quality and enforce coding standards.

## Project Conventions
- **File Naming**: Components are named using PascalCase (e.g., `EnhancedDashboard.tsx`).
- **Styling**: CSS is managed through `App.css` and component-specific styles. Tailwind CSS may also be used for utility-first styling.
- **TypeScript Usage**: Ensure type safety by defining interfaces for props and state where applicable.

## Integration Points
- **External Libraries**: The project uses libraries such as `@radix-ui/react-*` for UI components and `lucide-react` for icons. Ensure to check their documentation for usage patterns.
- **Data Handling**: Data is likely fetched from APIs or local JSON files. Look for data-fetching logic in components like `EnhancedDashboard`.

## Communication Patterns
- **Props and State**: Components communicate through props. State management should be handled at the appropriate level to avoid prop drilling.
- **Context API**: If used, the Context API will provide global state management across components.

## Key Files/Directories
- **`src/App.tsx`**: Main application entry point.
- **`src/components/EnhancedDashboard.tsx`**: Core dashboard component.
- **`vite.config.ts`**: Vite configuration, including base path settings for deployment.

---

This document serves as a guide for AI coding agents to understand the structure and workflows of the Aucdt Analytics Dashboard project. For further details, refer to the respective component files and documentation.