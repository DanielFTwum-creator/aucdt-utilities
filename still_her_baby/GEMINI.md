# GEMINI.md - Project Overview: Still Her Baby Video Dashboard

## Project Overview

This project is a production-ready dashboard system for managing AI video generation prompts for the "Still Her Baby" music video. It's a modern web application built with **React**, **Vite**, and **Tailwind CSS**.

The core functionality of the application is to provide a user-friendly interface for browsing, viewing, and copying a set of 37 pre-written, detailed prompts for an AI video generator. The prompts are organized by scenes from the music video and include visual descriptions, camera movements, and other technical parameters.

The project also includes a standalone HTML file (`still-her-baby-dashboard.html`) for a no-installation-required version of the dashboard.

## Building and Running

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

To set up the development environment, clone the repository and install the dependencies:

```bash
npm install
```

### Key Commands

-   **`npm run dev`**: Starts the development server with hot-reloading. The application will be available at `http://localhost:3000`.
-   **`npm run build`**: Builds the application for production. The output is saved in the `dist/` directory.
-   **`npm run preview`**: Serves the production build locally for previewing.
-   **`npm run lint`**: Lints the codebase for potential errors and style issues.

## Development Conventions

-   **Framework**: The project is built using **React**.
-   **Build Tool**: **Vite** is used for the development server and build process.
-   **Styling**: **Tailwind CSS** is used for styling. Custom theme configurations (colors, fonts) can be found in `tailwind.config.js`.
-   **Project Structure**: The main application source code is located in the `src/` directory. The entry point for the React application is `src/main.jsx`.
-   **Data**: The 37 scene prompts are stored in a JSON file located at `src/still-her-baby-scene-database.json`.
