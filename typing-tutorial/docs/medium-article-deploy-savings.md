# How We Saved Thousands in CI/CD Costs by Writing a 116-Line PowerShell Script

**By Daniel Frempong Twum** · Head of ICT & Special Advisor to the Founder, Techbridge University College, Ghana

*8 min read · DevOps · Education Technology · Cost Engineering*

---

When you run an AI research lab inside a university college in Oyibi, Greater Accra, every budget line matters. We are not a Series B startup with a runway measured in millions. We are an institution where research funds have to stretch across student tools, infrastructure, electricity, and the salaries of the people who build things. So when I sat down one evening and ran the numbers on what our CI/CD pipeline was about to cost us at scale, I stopped and rewrote the whole approach in a Saturday afternoon.

This is that story.

---

## The fleet nobody warned us about

Techbridge University College runs an internal AI Lab — a growing suite of web applications that students, lecturers, and researchers use daily. Typing tutors. Language learning tools. Glucose monitoring dashboards. Radio streaming interfaces. LMS platforms. AI-assisted thesis tools. A full catalog of educational micro-apps, all maintained by a small ICT team.

Over time, that catalog grew. Then it kept growing.

Today, we maintain a fleet of **300 applications**. Some are tiny single-page tools. Others are full-stack systems with Spring Boot backends and React frontends. All of them need to be deployed — and in active development cycles, they get deployed often. On a heavy day, a single application might see 10 to 15 deploys as the team iterates in real time.

That number — 300 applications, multiple deploys per day — is the detail that changes everything when you start pricing out CI/CD tooling.

---

## The CI/CD cost trap

CI/CD platforms sell themselves on convenience, and they are genuinely convenient. Push to a branch, a pipeline triggers, your code is built, tested, and deployed automatically. For a team of five engineers at a funded startup, the monthly invoice barely registers.

But the pricing model has a structure that punishes scale.

Bitbucket Pipelines, for example, gives you 50 free build minutes per month on the standard plan. Fifty minutes. That is approximately 25 two-minute builds — enough to deploy one application once a day for three weeks before the meter starts running. After that, you are paying $10 per 1,000 additional minutes.

Let us do the arithmetic properly.

**Conservative scenario: 5 deploys per app per day**

- 300 apps × 5 deploys × 30 days = **45,000 builds per month**
- At 2 minutes per build: **90,000 build minutes per month**
- Subtract the 50 free minutes: **89,950 paid minutes**
- At $0.01 per minute: **$899.50 per month in build minutes alone**
- Add the plan fee and user seats: **~$915 per month**
- **Annually: $10,980**

GitHub Actions is more generous with its free tier — 2,000 minutes per month on public repositories — but the principle is the same. At fleet scale, you are paying for compute time that is almost entirely predictable and repetitive. Every deploy runs the same steps: clone, install dependencies, build, sync files. Nothing novel. Nothing that requires a cloud vendor's infrastructure.

That $10,980 is not money we had earmarked for a CI/CD vendor. It is money that was supposed to fund student research projects and lab equipment.

---

## What we built instead

The alternative is conceptually simple: if you already have a server running your applications, build on that server.

Our infrastructure runs on a Plesk-managed Ubuntu host at `techbridge.edu.gh`. It is always on. It has Node.js installed. It has `pnpm`. It has `git`. Everything a build needs is already there, already paid for as part of our hosting costs.

So we wrote a deployment script.

```powershell
# typing-tutorial — Deploy Script
# Usage: .\deploy.ps1 -Build

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/.../typing-tutor/",
    [switch]$Build = $false
)
```

The script does the following when invoked with the `-Build` flag:

1. **Pre-flight checks** — confirms SSH connectivity and git state
2. **Commits the current state** — captures the exact git SHA being deployed
3. **SSHes into the server** — opens a single connection and streams a bash script via base64
4. **Clones the repository** — sparse, depth-1, pulling only the relevant subdirectory from our monorepo
5. **Installs dependencies** — `pnpm install`
6. **Builds the project** — `pnpm build`, producing a static `dist/` folder
7. **Syncs to the web root** — `rsync -a --delete dist/. /var/www/...`
8. **Writes `.htaccess`** — handles SPA routing and cache headers
9. **Sets permissions** — `chown` and `chmod` for the Plesk user
10. **Health check** — confirms `index.html` is present at the target path

Total time: around 60–90 seconds per deploy. Total cost: $0 in third-party compute charges.

---

## The gotcha that will catch you

If you adopt this pattern, there is one trap almost everyone falls into, and we hit it ourselves.

Our server has Node.js installed via `nvm` — the Node Version Manager. `nvm` works by adding the active Node version to your shell's `PATH` through your `.bashrc` or `.bash_profile`. When you open a terminal and SSH interactively, those files are sourced and everything works. Type `node --version` and you get back `v24.17.0`. Excellent.

But when your deploy script SSHes into the server and runs a heredoc — a non-interactive shell — those files are never sourced. The shell that executes your build commands has no idea where Node lives.

This is what our deployment log looked like before the fix:

```
[SERVER] [3/5] Installing dependencies...
/usr/bin/env: 'node': No such file or directory
[WARN] Server build returned 127
```

Exit code 127 means "command not found." The build silently failed. The deployment script moved on, found an `index.html` from the previous deploy, reported `DEPLOYMENT COMPLETE`, and we had no idea the new code had not actually shipped.

The fix is three lines, added to the top of the server-side bash script:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts >/dev/null 2>&1 || true
```

This explicitly sources `nvm` before any build commands run. The non-interactive shell now knows where Node is, and every subsequent deploy picks up the correct version. In our case, that is Node v24.17.0 — necessary because `pnpm` 11.x requires Node v22.13 or higher, and our previous system Node was v20.

The lesson: always validate that your deploy actually built new code, not just that a file exists. Add a checksum or embed the git SHA into the deployed output and verify it after deployment.

---

## The numbers, properly scaled

With 300 applications in the fleet, the savings compound. Here is the realistic picture across deployment scenarios:

| Deploys per app per day | Builds/month | Minutes/month | Bitbucket cost | Deploy script cost |
|---|---|---|---|---|
| 3 | 27,000 | 54,000 | ~$555/mo | $0 |
| 5 | 45,000 | 90,000 | ~$915/mo | $0 |
| 10 | 90,000 | 180,000 | ~$1,815/mo | $0 |
| 15 (peak dev day) | 135,000 | 270,000 | ~$2,715/mo | $0 |

At our actual development pace — which regularly hits 10–15 deploys on active projects — the annual savings versus a CI/CD platform sit somewhere between **$11,000 and $32,000 per year**.

That is a meaningful number for a university AI lab. That is student stipends. That is research computing credits. That is server capacity.

---

## What you give up — and whether it matters

This approach is not free of trade-offs. It is worth being honest about them.

**You lose build isolation.** A cloud CI runner is a clean environment every time. Your server accumulates state — cached `node_modules`, leftover temp directories, tool version drift. We mitigate this by running each deploy in a fresh `/tmp/` directory and deleting it after.

**You lose parallelism.** If three developers push at the same time, three deploy scripts try to SSH and build concurrently. On a single server, this can cause contention. For our team size, this has not been a problem in practice.

**You lose the ecosystem.** Bitbucket Pipelines and GitHub Actions have marketplaces full of pre-built steps — Slack notifications, Lighthouse audits, automated testing integration. We wire these up manually where we need them, but it takes slightly more effort.

**You gain cost control, ownership, and speed.** Our deploys are fast because we are not waiting for a cloud runner to spin up. We have full visibility into what runs on our server. And the cost is bounded by our existing infrastructure budget, not by how many times our team decides to push code.

For an institution managing a fleet of this size on a research budget, the trade-offs land clearly on one side.

---

## The broader principle

The CI/CD industry sells on automation and convenience, and those things have genuine value. But the pricing models were designed for teams where compute spend is a minor line item, not the deciding factor in whether a student research project gets funded.

If you are building for an institution, a non-profit, a university, or any organisation where the budget has hard limits, it is worth asking: what am I actually paying for here? In many cases, the answer is compute time and a web interface — both of which you can replicate on infrastructure you already own.

A 116-line PowerShell script is not glamorous. It does not have a dashboard. It does not send Slack notifications (yet). But it deploys 300 applications reliably, at zero marginal cost per build, and the money it saves goes directly back into the work that matters.

Sometimes the right engineering decision is the boring one.

---

*Daniel Frempong Twum is Head of ICT and Special Advisor to the Founder at Techbridge University College, Oyibi, Greater Accra, Ghana. He leads the development of the college's AI Lab, internal tools fleet, and educational technology infrastructure.*

*Follow the work: [ai-tools.techbridge.edu.gh](https://ai-tools.techbridge.edu.gh)*
