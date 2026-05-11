# Deployment Guide - DIALED

## Environment Setup
### Prerequisites
- Node.js (Vite environment)
- Firebase Project with Firestore and Auth enabled.
- Google Cloud Project (AI Studio Build environment).

### Dependencies
Run the following command to ensure all protocol-required packages are present:
```bash
npm install
```

## Configuration
### 1. Gemini AI
Ensure the `GEMINI_API_KEY` is set in the environment secrets. This powers the "AI Critic" post-round feedback.

### 2. Firebase
The application expects `src/firebase-applet-config.json`. If missing, verify the `set_up_firebase` tool was executed correctly.

## Build Process
```bash
# Clean previous builds
npm run clean

# Build static assets
npm run build
```

The resulting `dist/` folder contains the production SPA.

## Port Configuration
The application **must** listen on port `3000` for external accessibility within the AI Studio environment.
```json
"dev": "vite --port=3000 --host=0.0.0.0"
```

## CI/CD
Deployment is managed automatically by the AI Studio Build control plane upon code commit.
