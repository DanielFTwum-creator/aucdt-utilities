<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KZZw0PS0kI3HPqhH-c9hzDAk61OfCv2R

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `pnpm install`
2. Set `GEMINI_PROXY_KEY` in `.env.local` (WMS-issued relay credential — this app never holds the Gemini key)
3. Run the app:
   `pnpm run dev`
