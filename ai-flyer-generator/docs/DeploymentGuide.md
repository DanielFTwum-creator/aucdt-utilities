# AI Flyer Generator - Deployment Guide

## 1. Introduction

This document outlines the process for deploying the AI Flyer Generator application. As a client-side React application built with static files, it can be hosted on any modern static web hosting service.

## 2. Prerequisites

-   A valid Google Gemini API Key.
-   A web server or static hosting provider (e.g., Vercel, Netlify, AWS S3, GitHub Pages).

## 3. Configuration

The single most important configuration step is setting the Gemini API key.

### API Key Configuration

The application is designed to read the API key from a `process.env.API_KEY` variable at runtime. When deploying, you must ensure this environment variable is correctly configured in your hosting provider's build environment.

**DO NOT hardcode your API key directly into the source code.** This is a major security risk.

**Example Configuration on Vercel/Netlify:**

1.  Go to your project's settings in your hosting provider's dashboard.
2.  Find the section for "Environment Variables".
3.  Add a new environment variable:
    -   **Name / Key:** `API_KEY`
    -   **Value:** `Your-Gemini-API-Key-Here`

The application's build process will make this key available to the `geminiService.ts` file.

## 4. Deployment Steps

The application consists of static HTML, TypeScript (transpiled to JavaScript), and assets. There is no backend server to run.

### Step 1: Obtain the Source Files

Ensure you have the complete source code, including:
- `index.html`
- `index.tsx`
- `App.tsx`
- All files in the `components/`, `services/`, `context/`, `hooks/`, `docs/`, and `tests/` directories.

### Step 2: Configure Hosting Provider

1.  Connect your Git repository (containing the source code) to your chosen hosting provider (e.g., Netlify, Vercel).
2.  Configure the build settings. Since this project uses `esbuild` via the platform's tooling, no complex build command is needed. The provider will typically detect the `index.html` and serve it.
3.  **Crucially, set the `API_KEY` environment variable as described in Section 3.**

### Step 3: Deploy

-   Push your code to the connected Git repository.
-   The hosting provider will automatically trigger a new deployment.
-   Once the deployment is complete, your application will be live at the provided URL.

## 5. Example: Deploying to Netlify

1.  Push the project code to a GitHub/GitLab/Bitbucket repository.
2.  Sign up for a Netlify account and select "Add new site" -> "Import an existing project".
3.  Authorize Netlify to access your Git provider and select the repository.
4.  Netlify will likely auto-detect the settings. You do not need a build command or a publish directory.
5.  Before clicking "Deploy", go to "Advanced build settings" or navigate to the site's settings after creation.
6.  Go to "Site settings" > "Build & deploy" > "Environment".
7.  Add the `API_KEY` environment variable.
8.  Trigger a new deploy. Your site will be live.