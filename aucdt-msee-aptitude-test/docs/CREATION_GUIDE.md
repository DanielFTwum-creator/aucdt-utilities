# Creation Guide: Rebuilding the AUCDT MSEE Mathematics Aptitude Test Application

## 1. Introduction

This document is a master guide for developers or an advanced AI to completely recreate the AUCDT MSEE Mathematics Aptitude Test application. It provides the full file structure, configuration details, and the complete source code for every file.

The final application is a sophisticated full-stack application featuring:
- A secure, role-based authentication system for students and administrators.
- A timed student examination flow with server-side progress saving and exam filtering.
- A protected administrator dashboard for AI-powered exam question generation using the Google Gemini API.
- An automated self-test mode for demonstration and smoke testing.
- User-selectable accessibility themes (Light, Dark, High-Contrast).
- Secure, server-side audit logging to a MySQL database.

## 2. Prerequisites

Before you begin, you will need:
1.  **A Server Environment**: A server (e.g., Ubuntu) with Node.js, npm, and MySQL installed.
2.  **A Google GenAI API Key**: Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Database Credentials**: You will need the host, user, password, and database name for your MySQL instance.

## 3. Project Structure

Create the following directory and file structure. The contents for each file are provided in the main prompt.

```
/
├── db/
│   └── init.sql
├── docs/
│   ├── ADMINISTRATORS_GUIDE.md
│   ├── ARCHITECTURE.svg
│   ├── CREATION_GUIDE.md
│   ├── DATABASE_SCHEMA.svg
│   ├── DEPLOYMENT_GUIDE.md
│   ├── SRS.md
│   └── TESTING_GUIDE.md
├── components/
│   ├── AccessibleProgress.tsx
│   ├── AdminView.tsx
│   ├── AuthView.tsx
│   ├── common.tsx
│   ├── DiagramRenderer.tsx
│   ├── SelfTestView.tsx
│   ├── StudentFlow.tsx
│   └── ThemeSwitcher.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useExam.ts
│   └── useTheme.ts
├── services/
│   ├── auditLogService.ts
│   ├── geminiService.ts
│   └── pdfExporter.ts
├── .env.example
├── .gitignore
├── AGENT.md
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── server.js
├── SRS.md
└── types.ts
```

## 4. Configuration

All secret configuration is handled on the server via environment variables.

1.  **Create a `.env` file** in the project root by copying `.env.example`.
2.  **Fill in the values:**
    *   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Your MySQL connection details.
    *   `JWT_SECRET`: A long, random, and secure string used for signing authentication tokens.
    *   `API_KEY`: Your Google GenAI API Key.

## 5. Setup and Running

1.  **Database Setup:** Run the `db/init.sql` script on your MySQL server to create the necessary tables.
2.  **Install Dependencies:** From the project root, run `npm install` to install all backend dependencies listed in `package.json`.
3.  **Run the Server:** Run `npm start` to start the Node.js server. The application will be accessible at `http://localhost:3000`.
4.  **Create Admin User:** Manually insert an admin user into the `users` table in your database as described in the `DEPLOYMENT_GUIDE.md`.

The application is now fully functional. All source code for the files listed above should be created with the content provided in the main prompt.