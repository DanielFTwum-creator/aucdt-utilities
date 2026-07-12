# Drumming for SEL Success

A public marketing website for "Drumming for SEL Success" professional-development
residencies: programme information, a contact form that emails enquiries directly,
and an AI-assisted best-practices guide for educators.

Live at: **https://ai-tools.techbridge.edu.gh/dfs/**
(the deployed URL slug is `dfs`, not the `dfs-website` repo folder name.)

## Stack

- React 19 + Vite + TypeScript, Tailwind CSS, `react-router-dom`
- Express 5 backend (`server.ts`, run via `tsx`) — contact-form email, AI assistant
  relay, admin test-runner routes
- No login — fully public site

## Run locally

```powershell
cd C:\Development\github\aucdt-utilities\dfs-website
pnpm install
pnpm dev
```

Set `GMAIL_USER` / `GMAIL_APP_PASSWORD` in `.env.local` for the contact form to send
real email, and `GEMINI_PROXY_KEY` for the AI best-practices assistant to return real
answers (both degrade gracefully — the assistant returns 503, and email fails
gracefully with an error response — without them). See `.env.example`.

## Deploy

```powershell
cd C:\Development\github\aucdt-utilities\dfs-website
.\deploy.ps1 -Build
```

Ships the built SPA plus `server.ts` (run via `tsx` under PM2) to the `dfs-website`
PM2 process on port 3012. See `CONSTRAINTS.md` for the full environment spec and
pre-delivery gate.
