# Welcome to TUCIS

## How We Use Claude

Based on usage over the last 30 days:

Work Type Breakdown:
  Plan & Design       ████████████████████  100%

Top Skills & Commands:
  `/verify`           ██████░░░░░░░░░░░░░░  (Verify changes in running app)
  `/code-review`      ██████░░░░░░░░░░░░░░  (Review PRs for correctness)
  `/run`              ████░░░░░░░░░░░░░░░░  (Launch & test locally)

Top MCP Servers:
  (None configured yet)

## Your Setup Checklist

### Codebases
- [ ] aucdt-utilities (monorepo) — github.com/danielftwum-creator/aucdt-utilities
- [ ] techbridge-ai-blueprint — Reference for all TUCIS standards & workflows
- [ ] tuc-rms (Results Management System) — Active project in deployment

### MCP Servers to Activate
(None configured yet — contact your setup buddy if you need integration with Linear, Slack, GitHub, or Gemini CLI)

### Skills to Know About
- `/init` — Generate CLAUDE.md project documentation (run once per new project)
- `/verify` — Test a code change in the running app before committing
- `/code-review` — Review pull requests for bugs and style
- `/run` — Launch the app locally to test features

## Team Tips

### 1. Start with TechBridge AI Blueprint
The **techbridge-ai-blueprint** project is your reference for all TUCIS standards:
- **IEEE SRS Format** — All projects must follow TUC-ICT-SRS-YYYY-NNN naming
- **Tech Stack** — React 18 · TypeScript · Tailwind · Firebase Auth · Firestore
- **Deployment Model** — Docker-ready, Nginx/Plesk compatibility
- **Security Model** — Zero-Trust Firestore rules, mandatory Google auth gates
- **Documentation** — All docs live in `/docs`, diagrams as SVG

Read the SRS (`docs/TUC-ICT-SRS-2026-001.md`) first on any new project to understand the standards.

### 2. Always Check Local CLAUDE.md First
Every project in `aucdt-utilities/` may have a local `CLAUDE.md` in its root. Local files override the global defaults.
- Read it before generating any output
- Follow its model allocation rules (Sonnet for planning, Haiku for repetitive work)
- Document decisions that trade off requirements

### 3. Never Skip `/verify` Before Committing
When you change code, always run `/verify` to see the change in the running app:
- Tests the golden path and edge cases
- Catches regressions you can't see in diffs
- Prevents shipping broken features to production

### 4. Document Trade-offs in PRs
If your task involved choosing between multiple approaches, document why:
- What was considered?
- What was chosen and why?
- What was traded off (performance, simplicity, flexibility)?
- Put this in the PR description, not comments in code

### 5. One Project at a Time
The monorepo has 50+ projects. Context-switching burns tokens and slows you down.
- Identify which project you're working on in your first message
- Stay in that project's context until the task is complete
- Reference the project's local CLAUDE.md for its rules

## Get Started

**Starter Task:** Deploy TUC RMS (Results Management System) to production on `ai-tools.techbridge.edu.gh/rms/`

**Why:** It consolidates everything — deployment planning, architecture review, production hardening, and stakeholder communication. You'll see how TUCIS approaches a full app lifecycle.

**Where to start:**
1. Read `tuc-rms/DEPLOYMENT_READY.md` (deployment guide)
2. Review `tuc-rms/docs/TUC-ICT-SRS-2026-001-TUC-RMS.md` (IEEE spec)
3. Check `tuc-rms/deploy.ps1` and understand the deployment flow
4. Ask Claude Code to verify the deployment on a test server first
5. Document any issues you find and propose fixes

This gives you hands-on experience with TUCIS standards in a real production context.

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
