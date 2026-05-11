# Ananse Cartoon Generator - System Architecture

This document outlines the high-level system architecture of the Ananse Cartoon Generator application. It is a client-side web application that interacts directly with the Google Gemini API.

## Architecture Diagram

The following diagram illustrates the main components and data flow of the system.

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

### Components

1.  **User**: The end-user interacting with the application through their web browser.

2.  **React Application**: The client-side application built with React and TypeScript. It's responsible for managing state, handling user input, and rendering the UI, including real-time progress for animations.

3.  **geminiService.ts**: A dedicated service module that encapsulates all communication with the Google AI backend. It formats requests and processes responses, orchestrating the multi-step process for animation generation.

4.  **Google AI Platform**:
    -   **Imagen 3 API**: Used for generating high-quality images from text prompts. This is used for both static images and each frame of an animation.
    -   **Gemini Flash API**: A fast, multimodal model used for generating text-based content, including scene dialog, "next scene" prompts, and the sequence of prompts for animation frames.

5.  **Vite Dev Server**: A fast development server that bundles the code and serves the React application during development.

6.  **Jest + Playwright**: The end-to-end testing framework used to automate browser interactions and verify the application's functionality.

### Data Flow

The application has two primary generation flows:

#### Static Image Generation
1.  The user enters a scene description and clicks "Generate Image".
2.  The `geminiService` sends the prompt to the **Imagen 3 API**.
3.  The API returns the generated image as a base64 string.
4.  The React app displays the image to the user.

#### Animation Generation
This is a complex, multi-step process orchestrated by `geminiService.ts` to ensure smooth animations and avoid API rate limits.
1.  The user enters a scene description and clicks "Generate Animation".
2.  **Step 1 (Keyframe)**: The service first calls the **Imagen 3 API** to generate a single high-quality "keyframe" image. The UI progress is updated.
3.  **Step 2 (Frame Prompts)**: The service then calls the **Gemini Flash API** with the original prompt, asking it to generate 14 subsequent text prompts for the animation's "in-between" frames.
4.  **Step 3 (Frame Generation Loop)**: The service iterates through the 14 new prompts, calling the **Imagen 3 API** for each one sequentially, with a delay between calls to respect rate limits.
5.  With each new frame generated, the UI's progress bar is updated.
6.  Once all 15 frames are complete, the React app displays them in the animation player.
