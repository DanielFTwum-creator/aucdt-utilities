# dmcdAI — AI in Digital Media and Communication Design

**Institution:** Techbridge University College (TUC)
**Suite:** aucdt-utilities institutional monorepo

A modular pedagogical sandbox for DMCD students to explore AI-driven design, content creation, analysis, and ethics across 10 domains.

## Run Locally

**Prerequisites:** Node.js 24.x, pnpm

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set your Gemini API key in `.env.local`:

   ```env
   VITE_GEMINI_API_KEY=your_key_here
   ```

3. Start the dev server:

   ```bash
   pnpm run dev
   ```

## Docker

```bash
docker build -t dmcdai .
docker run -p 3000:80 dmcdai
```

## Authentication

Access requires a `@techbridge.edu.gh` email address. A 2FA verification code is sent via the TUC mail API. Admin access uses a separate password-protected route at `#/admin`.
