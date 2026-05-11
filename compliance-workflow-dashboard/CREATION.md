# Compliance Workflow Dashboard - Setup Guide

This guide provides instructions for cloning and setting up the Compliance Workflow Dashboard application.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd compliance-workflow-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and provide the required API keys (e.g., `GEMINI_API_KEY`).

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.
