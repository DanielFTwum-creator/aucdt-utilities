<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5f648a42-e402-451d-a3f7-3af91f2ba14c

## Run Locally

**Prerequisites:**  Node.js and pnpm 8.15.0+

1. Install dependencies:
   `pnpm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `pnpm dev`

**Available Commands:**
- `pnpm dev` — Start dev server (port 3000)
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build
- `pnpm lint` — TypeScript type checking
- `pnpm test:e2e` — Run Playwright E2E tests
- `pnpm clean` — Remove dist/ directory

**Note:** This project uses pnpm exclusively. Do not use npm or yarn.
