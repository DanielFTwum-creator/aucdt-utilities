# Ananse Cartoon Generator - Testing Guide

This guide provides instructions on how to set up and run the end-to-end (E2E) tests for the Ananse Cartoon Generator application. The tests use Jest and Playwright to simulate user interactions in a real browser environment.

## Application Features Overview

Before testing, it's helpful to understand the core features of the application:

-   **Generation Mode**: A switch allows the user to select between generating a `Static Image` or a 15-frame `Animation`.
-   **Scene Generation**: The main action button generates the selected content based on the "Scene Description" text area.
-   **Dialog Generation**: An optional feature that generates a short dialog between two characters to accompany the visual scene.
-   **Next Scene**: This button uses AI to generate a new scene prompt that continues the story from the current description.
-   **History**: Previously generated scenes are saved and displayed in a history section, from which they can be restored.
-   **Downloads**: Users can download generated images, individual animation frames, and all frames at once. Dialog can also be downloaded as a text file.

## Architecture Overview for Testing

The E2E tests interact with the application as a whole. The following diagram shows the key components involved.

```mermaid
graph TD
    subgraph User Browser
        A[User] -- Interacts with --> B{React Application};
        B -- Renders UI & Progress --> A;
        B -- Sends API Requests (Prompts) --> C[geminiService.ts];
    end

    subgraph Google Cloud
        D[Imagen 3 API];
        G[Gemini Flash API];
    end
    
    subgraph "Development & Testing"
        E[Vite Dev Server] -- Serves --> B;
        F[Jest + Playwright] -- Runs E2E Tests on --> B;
    end

    C -- "Image Prompts" --> D;
    C -- "Text & Dialog Prompts" --> G;
    D -- "Image Data" --> C;
    G -- "JSON (Text)" --> C;

    note for C "Animation Orchestration:<br/>1. Generate keyframe image (Imagen)<br/>2. Generate 14 text prompts (Gemini Flash)<br/>3. Loop to generate 14 frames (Imagen)"

    style A fill:#D2691E,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style C fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#646cff,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#c21325,stroke:#333,stroke-width:2px,color:#fff
```

## Prerequisites

-   **Node.js and npm**: Ensure you have a recent version of Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
-   **API Key**: You must have a valid Google Gemini API key.

## 1. Setup

### a. Clone the Repository

First, ensure you have all the application files on your local machine.

### b. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install all the necessary dependencies listed in `package.json`:

```bash
npm install
```

### c. Configure Environment Variables

The application requires a Google Gemini API key to function.

1.  Create a file named `.env` in the root of the project directory.
2.  Add your API key to this file in the following format:

    ```
    VITE_API_KEY=your_gemini_api_key_here
    ```

    The Vite development server will automatically load this variable and make it available to the application.

## 2. Running the Application

Before running tests, it's good practice to ensure the application runs correctly on its own. Start the development server with:

```bash
npm start
```

This will launch the application, typically on `http://localhost:5173`. The `jest-playwright.config.js` is configured to automatically start this server before running the tests.

## 3. Running the Tests

To execute the entire E2E test suite, run the following command from the project root:

```bash
npm test
```

This command will:
1.  Start the Vite development server (if not already running).
2.  Launch a Chromium browser instance (controlled by Playwright).
3.  Run the tests defined in `e2e.test.ts`.
4.  Output the test results to your console.
5.  Shut down the server and browser instance.

### Test Configuration

-   **Headless Mode**: By default, Playwright runs in headless mode (no visible browser window). You can run tests in a visible browser by setting an environment variable: `HEADLESS=false npm test`.
-   **Slow Motion**: To slow down the test execution and observe the browser interactions, you can use the `SLOWMO` environment variable: `SLOWMO=100 npm test` (the value is in milliseconds).
