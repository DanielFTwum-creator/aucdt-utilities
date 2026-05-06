# AI Scene Visualizer - Deployment Guide

This document provides instructions for deploying the AI Scene Visualizer application.

## 1. Prerequisites

- A web server or static site hosting provider (e.g., Vercel, Netlify, Firebase Hosting, GitHub Pages).
- A valid Google Gemini API Key.

## 2. Build Process

The application is a static web application built with React and TypeScript. There is no server-side build step required for the provided code, as it uses ES modules and an import map to load dependencies directly in the browser.

To deploy, you simply need to host the static files (`index.html`, `index.tsx`, `App.tsx`, etc.) on a web server.

## 3. Environment Variables

The application requires a Google Gemini API key to function. This key must be available to the application at runtime.

### Configuration

The application expects the API key to be available in `process.env.API_KEY`. Since this is a client-side application, `process.env` is polyfilled in `index.html`.

To provide the key, you must inject it into the environment where the app is served. Most hosting providers have a way to set environment variables.

**Example for Netlify/Vercel:**
1. Go to your site's settings.
2. Navigate to the "Environment Variables" section.
3. Add a new variable with the key `API_KEY` and your Google Gemini API key as the value.

The application's `index.html` script will make this variable available to the application code.

**IMPORTANT**: Exposing an API key on the client-side is a security risk in a production environment. For a real-world application, you should proxy API requests through a secure backend server that holds the API key. For the purposes of this project, direct client-side access is used.

## 4. Deployment Steps

1. **Obtain API Key**: Get your API key from [Google AI Studio](https://aistudio.google.com/).
2. **Configure Environment Variable**: Set the `API_KEY` environment variable on your hosting platform.
3. **Upload Files**: Upload all the project files (HTML, TSX, components, etc.) to the root directory of your hosting provider.
4. **Serve**: Ensure your web server serves `index.html` for the root path.

The application should now be live.

## 5. Admin Panel

The admin panel is located at `/admin.html`. It is self-contained and requires no special deployment steps beyond being uploaded with the rest of the files. Refer to the `ADMIN_GUIDE.md` for more information on its usage.
