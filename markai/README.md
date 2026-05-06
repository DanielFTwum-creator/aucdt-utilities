# MarkAI: Marketing for Non-Marketers

MarkAI is a modern, AI-powered marketing platform designed to simplify and automate content creation, scheduling, and campaign management for users without a marketing background. It leverages the Google Gemini API to provide intelligent tools for generating text and image content, editing visuals, and even engaging in real-time voice conversations.

![MarkAI System Architecture](docs/diagrams/system_architecture.svg)

## ✨ Key Features

-   **AI Content Generation**: Create engaging marketing copy for various platforms (Instagram, Facebook, Email, etc.) from a single prompt.
-   **AI Image Tools**: Generate new images from text prompts or edit existing images using AI.
-   **Campaign Scheduling**: Plan and visualize your marketing campaigns with an intuitive calendar view.
-   **Live AI Conversations**: Engage in real-time voice conversations with an AI assistant for quick ideas and support.
-   **Platform-Specific Previews**: See how your generated content will look on different social media platforms before you post.
-   **Admin Dashboard**: Manage application features with a secure, password-protected admin panel with feature flags and audit logs.
-   **Theming**: Switch between Light, Dark, and High-Contrast modes for a comfortable user experience.
-   **In-App Testing Suite**: Run diagnostic tests and E2E simulations directly within the application.

## 🛠️ Tech Stack

-   **Frontend**:
    -   **React**: A component-based UI library for building the user interface.
    -   **Tailwind CSS**: A utility-first CSS framework for rapid, custom styling.
-   **Backend**:
    -   **Node.js**: A JavaScript runtime for the server.
    -   **Express.js**: A minimal web framework for creating the API proxy.
-   **AI Core**:
    -   **Google Gemini API**: The suite of AI models used for content generation, image editing, and live chat.
    -   **@google/genai SDK**: The official client library for interacting with the Gemini API.
-   **Testing**:
    -   **Puppeteer**: A Node.js library for controlling a headless Chrome browser to run automated end-to-end tests.
-   **Data Persistence**:
    -   **Browser Local Storage**: Used for client-side storage of scheduled posts, user settings, and logs in this serverless-style demo.

## 🚀 Getting Started

Follow these instructions to get the MarkAI application running on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or later recommended)
-   npm (included with Node.js)

### 1. Installation

Clone the repository and install the required dependencies for both the server and the testing framework.

```bash
git clone <repository-url>
cd markai-app
npm install
```

### 2. Environment Setup

The backend server requires a Google Gemini API key to function.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to this file:

    ```
    API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    ```

### 3. Running the Application

MarkAI consists of a React frontend and a Node.js backend proxy. Both must be running concurrently.

1.  **Start the Backend Server:**
    Open a terminal and run the following command to start the Node.js server, which will run on `http://localhost:3000`.

    ```bash
    npm run start:server
    ```

2.  **Start the Frontend Application:**
    Open a **second terminal**. Serve the project's root directory using a simple static file server. The application is designed to run directly in the browser without a build step. We recommend using `serve`.

    ```bash
    # If you don't have 'serve' installed globally:
    npx serve -l 5173

    # If you have 'serve' installed:
    serve -l 5173
    ```

    The application will now be available at `http://localhost:5173`.

### 4. Running Tests

The project includes an end-to-end test suite using Puppeteer.

1.  Ensure both the frontend and backend servers are running as described in the previous step.
2.  Open a **third terminal** and run the E2E test command:

    ```bash
    npm run test:e2e
    ```

    A new Chromium browser window will open and automatically execute the test script. The results will be logged in the terminal.
