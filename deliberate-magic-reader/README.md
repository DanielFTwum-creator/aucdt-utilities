# Deliberate Magic Reader

An interactive reader for the "Deliberate Magic" essay chronicle, with AI-assisted
essay drafting and an AI glossary of the series' recurring technical metaphors.

Live at: **https://ai-tools.techbridge.edu.gh/magic-reader/**
(the deployed URL slug is `magic-reader`, not the `deliberate-magic-reader` repo
folder name — see `CONSTRAINTS.md`.)

## Stack

- React 19 + Vite 8 + TypeScript, Tailwind CSS 4
- Express 5 backend (`server.ts`, run via `tsx`) — OAuth callback, essay/glossary AI
  routes relayed through the central WMS Gemini proxy
- Sign-in: bespoke Google OAuth 2.0 (cookie-based), not WMS SSO

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\deliberate-magic-reader
pnpm install
pnpm dev
```

Set `VITE_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_REDIRECT_URI` and
(optionally, for real AI output) `GEMINI_PROXY_KEY` in `.env.local`. See
`.env.example`.

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\deliberate-magic-reader
.\deploy.ps1 -Build
```

Ships `server.ts` to run under PM2 via `tsx`, plus the built Vite static assets, to
the `magic-reader` PM2 process on port 3008. See `CONSTRAINTS.md` for the full
environment spec, known packaging gaps, and pre-delivery gate.
