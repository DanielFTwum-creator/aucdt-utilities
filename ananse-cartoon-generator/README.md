# Ananse Cartoon Generator

Welcome to the Ananse Cartoon Generator! This web application brings the timeless stories of Ananse the spider to life by using the power of Google's Gemini AI. Users can write a scene description and watch as the AI generates vibrant cartoon visuals, short animations, and even dialog.

![Screenshot of Ananse Cartoon Generator](https://storage.googleapis.com/framer-screenshots/ananse-cartoon-generator.png)

## ✨ Features

-   **Static Image Generation**: Create a high-quality, vibrant cartoon image from a detailed text prompt.
-   **Animation Generation**: Produce short, 15-frame animations to create more dynamic and lively scenes.
-   **Dialog Generation**: Automatically generate a short, character-driven dialog that matches the scene's tone.
-   **Story Continuation**: Use the "Next Scene" feature to have the AI generate a new prompt that logically follows the current one, helping to build a narrative.
-   **Generation History**: All your creations are saved in a history panel, allowing you to easily view, restore, or download them later.
-   **Download Options**: Download static images, individual animation frames, or all frames at once. Dialog can also be downloaded as a text file.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Models**: [Google Gemini API](https://ai.google.dev/)
    -   `imagen-3.0-generate-002` for image generation.
    -   `gemini-2.5-flash` for text, dialog, and animation prompt generation.
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Testing**: [Jest](https://jestjs.io/) & [Playwright](https://pptr.dev/) for End-to-End tests.

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js and npm
-   A valid Google Gemini API key. You can get one from the [Google AI Studio](https://makersuite.google.com/).

### 1. Clone the Repository

Clone this project to your local machine.

### 2. Install Dependencies

Navigate to the project's root directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env` in the project root. Add your Gemini API key to this file:

```
VITE_API_KEY=your_gemini_api_key_here
```

### 4. Run the Application

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:5173`.

## 🧪 Running Tests

To run the end-to-end test suite, use the following command:

```bash
npm test
```

This will launch a headless browser, run through the user scenarios defined in `e2e.test.ts`, and report the results in your console.
