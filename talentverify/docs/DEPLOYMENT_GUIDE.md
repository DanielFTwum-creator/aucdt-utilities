# Deployment Guide - TalentVerify

**Version:** 1.0
**Date:** 2026-03-01

## 1. Overview
This document outlines the steps to deploy the TalentVerify application. The system is a full-stack application using **React 19.2.5** (Frontend) and **Node.js/Express** (Backend).

## 2. Prerequisites
- **Node.js**: Version 18 or higher (v20+ recommended).
- **npm**: Version 9 or higher.
- **React**: Version 19.2.5 (strictly enforced).
- **Google Gemini API Key**: Required for AI features.

## 3. Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd talentverify
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   *Note: This installs both frontend and backend dependencies, including `playwright` for testing.*

## 4. Configuration

1. **Environment Variables**:
   Create a `.env` file in the root directory (copy from `.env.example` if available).
   ```env
   # Required
   GEMINI_API_KEY=your_google_gemini_api_key
   
   # Optional (Defaults provided in code)
   PORT=3000
   NODE_ENV=production
   ```

2. **Database**:
   The application uses SQLite (`talentverify.db`). The database file is automatically created and initialized with the schema on the first server start.

## 5. Building for Production

To build the frontend assets:
```bash
npm run build
```
This command compiles the React application using Vite and outputs static files to the `dist/` directory.

## 6. Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Express server with Vite middleware for HMR. Accessible at `http://localhost:3000`.

### Production Mode
1. **Build the app** (see step 5).
2. **Start the server**:
   ```bash
   npm start
   ```
   *Ensure `package.json` defines `"start": "node server.ts"` (or `tsx server.ts` if using TypeScript runtime).*

## 7. Verification
After deployment:
1. Navigate to `http://localhost:3000/api/health` to verify the backend is running.
2. Navigate to `http://localhost:3000` to verify the frontend loads.
3. Log in as Admin (`admin123`) and run the **Testing Suite** at `/admin/testing` to validate core workflows.

## 8. Troubleshooting
- **"React version mismatch"**: Ensure `package.json` specifies `"react": "19.2.5"`.
- **"Playwright launch failed"**: If running in a Docker container, ensure necessary system libraries are installed and use `--no-sandbox` args (already configured in `src/services/testRunner.ts`).
- **"Database locked"**: Ensure only one process is accessing `talentverify.db` at a time.
