#!/usr/bin/env python3
"""
generate-portfolio-master.py
Regenerates APPLICATION-PORTFOLIO-MASTER.md from the current state of the monorepo.
"""

import os
import json
import re
from datetime import date as _date
from pathlib import Path

ROOT = Path(__file__).parent.parent
OUT  = ROOT / "APPLICATION-PORTFOLIO-MASTER.md"

SKIP = {
    'node_modules', '.git', 'catalogue', 'scripts', 'archive', 'docs',
    'dist', 'build', 'tests', 'test-results', 'backend', 'docker',
    'src', 'templates', 'reports', 'build-logs', 'install-logs',
    'build-validation-reports', 'aucdt-portal-tests', 'playwright-report',
}

# ── Category keyword rules (checked against directory slug) ──────────────────
CATEGORIES = [
    ("AI & Machine Learning",        ["ai-", "-ai-", "gemini", "llm", "nlp", "neural", "ml-", "gpt", "vision-ai", "claude", "openai", "genai", "intelligent", "autonomous", "knowledge-graph", "knowledge-compression", "creoai", "clipai", "dmcdai", "patois-lyricist", "entrainer", "playgrow"]),
    ("Analytics & Monitoring",       ["analytics", "dashboard", "monitor", "metrics", "insight", "report", "stats", "tracking", "kpi", "performance", "audit", "telemetry", "observability", "log-"]),
    ("Digital Twin & Simulation",    ["digital-twin", "twin", "simulation", "simulator", "city-model", "virtual-campus"]),
    ("Healthcare & Medical",         ["health", "medical", "patient", "clinic", "hospital", "telemedicine", "ehr", "pharmacy"]),
    ("Education & Learning",         ["learning", "curriculum", "assessment", "student", "course", "lms", "lecture", "quiz", "exam", "academic", "education", "university", "college", "tutor"]),
    ("Financial & Risk",             ["finance", "financial", "treasury", "budget", "risk", "investment", "revenue", "fees-comparison", "payroll", "procurement"]),
    ("Security & Compliance",        ["security", "compliance", "audit-trail", "governance", "access-control", "identity", "threat", "vulnerability", "incident-", "siem", "fraud"]),
    ("Infrastructure & DevOps",      ["infra", "devops", "deployment", "pipeline", "ci-cd", "container", "kubernetes", "docker-", "service-mesh", "api-gateway", "load-balance", "autoscale", "chaos", "dependency", "config-"]),
    ("Sentinel Systems",             ["sentinel"]),
    ("Techbridge Projects",          ["techbridge-", "tuc-", "aucdt-"]),
    ("Grooverx",                     ["grooverx"]),
    ("Communication & Media",        ["communication", "media", "email", "notification", "chat", "messaging", "social", "broadcast", "newsletter", "campaign", "crm", "support-ticket", "helpdesk"]),
    ("Business & Operations",        ["workflow", "operations", "resource", "scheduling", "inventory", "supply-chain", "logistics", "vendor", "contract", "project-manage", "task-manage", "kanban", "event-manage", "facility", "asset-manage", "staff", "hr-", "employee", "recruitment", "onboarding", "expense", "travel"]),
]
OTHER = "Other Applications"

def categorize(slug):
    s = slug.lower()
    for cat, keywords in CATEGORIES:
        for kw in keywords:
            if kw in s:
                return cat
    return OTHER

def to_title(slug):
    title = re.sub(r"[-_]", " ", slug)
    title = re.sub(r"\b(\w)", lambda m: m.group(1).upper(), title)
    title = re.sub(r"\bAi\b", "AI", title)
    title = re.sub(r"\bApi\b", "API", title)
    title = re.sub(r"\bUi\b", "UI", title)
    title = re.sub(r"\bTuc\b", "TUC", title)
    title = re.sub(r"\bLlm\b", "LLM", title)
    title = re.sub(r"\bMl\b", "ML", title)
    title = re.sub(r"\bNlp\b", "NLP", title)
    title = re.sub(r"\bHr\b", "HR", title)
    title = re.sub(r"\bCrm\b", "CRM", title)
    title = re.sub(r"\bSiem\b", "SIEM", title)
    title = re.sub(r"\bEhr\b", "EHR", title)
    title = re.sub(r"\bDevops\b", "DevOps", title)
    title = re.sub(r"\bCi Cd\b", "CI/CD", title)
    title = re.sub(r"\bKpi\b", "KPI", title)
    title = re.sub(r"\bV(\d+)\b", r"v\1", title)
    return title.strip()

def get_meta(app_dir):
    pkg_path = app_dir / "package.json"
    pom_path = app_dir / "pom.xml"
    desc = ""
    stack = "React/Vite"
    port = None

    if pkg_path.exists():
        try:
            pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
            desc = pkg.get("description", "")
            desc = re.sub(r"\s*App ID \d+", "", desc).strip()
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            # React/Vite if it has react or vite
            if "react" in deps or "vite" in deps or "@vitejs/plugin-react" in deps:
                stack = "React/Vite"
            # Pure Node.js if no react/vite but has express
            elif "express" in deps:
                stack = "Node.js/Express"
            else:
                stack = "React/Vite"  # default for frontend apps
        except Exception:
            pass
    elif pom_path.exists():
        stack = "Java/Spring Boot"

    # Detect port from Dockerfile EXPOSE
    dockerfile = app_dir / "Dockerfile"
    if dockerfile.exists():
        try:
            content = dockerfile.read_text(encoding="utf-8")
            m = re.search(r"EXPOSE\s+(\d+)", content)
            if m:
                port = int(m.group(1))
        except Exception:
            pass

    has_docker = dockerfile.exists()
    has_backend = (app_dir / "backend").is_dir() or (app_dir / "server").is_dir()

    return {
        "desc": desc,
        "stack": stack,
        "port": port,
        "has_docker": has_docker,
        "has_backend": has_backend,
    }

# ── Discover apps ─────────────────────────────────────────────────────────────
apps = []
for entry in sorted(ROOT.iterdir()):
    if not entry.is_dir():
        continue
    if entry.name in SKIP or entry.name.startswith("."):
        continue
    has_pkg = (entry / "package.json").exists()
    has_pom = (entry / "pom.xml").exists()
    if not (has_pkg or has_pom):
        continue
    meta = get_meta(entry)
    apps.append({
        "slug": entry.name,
        "title": to_title(entry.name),
        "category": categorize(entry.name),
        "desc": meta["desc"],
        "stack": meta["stack"],
        "port": meta["port"],
        "has_docker": meta["has_docker"],
        "has_backend": meta["has_backend"],
    })

# ── Group by category ─────────────────────────────────────────────────────────
cat_order = [c for c, _ in CATEGORIES] + [OTHER]
grouped = {c: [] for c in cat_order}
for app in apps:
    grouped[app["category"]].append(app)

total = len(apps)
docker_count = sum(1 for a in apps if a["has_docker"])
java_count   = sum(1 for a in apps if a["stack"] == "Java/Spring Boot")
node_count   = sum(1 for a in apps if a["stack"] == "Node.js/Express")
react_count  = sum(1 for a in apps if a["stack"] == "React/Vite")

# ── Build document ────────────────────────────────────────────────────────────
lines = []

lines.append("# Application Portfolio Master Reference")
lines.append("")
lines.append("## Techbridge University College — Complete App Catalogue")
lines.append("")
lines.append(f"**Total Applications:** {total}  ")
lines.append(f"**React/Vite Frontends:** {react_count}  ")
lines.append(f"**Node.js/Express Backends:** {node_count}  ")
lines.append(f"**Java/Spring Boot Services:** {java_count}  ")
lines.append(f"**Docker Coverage:** {docker_count}/{total} ({100*docker_count//total}%)  ")
lines.append(f"**Last Updated:** {_date.today().strftime('%B %d, %Y')}  ")
lines.append("")
lines.append("---")
lines.append("")

# Table of contents
lines.append("## Contents")
lines.append("")
for cat in cat_order:
    if grouped[cat]:
        anchor = cat.lower().replace(" ", "-").replace("&", "").replace("/", "").replace("--", "-")
        lines.append(f"- [{cat} ({len(grouped[cat])})](#{anchor})")
lines.append("")
lines.append("---")
lines.append("")

# A-Z quick index
lines.append("## A-Z Index")
lines.append("")
lines.append("| # | Application | Category | Stack | Docker |")
lines.append("|---|-------------|----------|-------|--------|")
for i, app in enumerate(apps, 1):
    docker_icon = "✅" if app["has_docker"] else "❌"
    anchor = app["slug"]
    lines.append(f"| {i} | [{app['title']}](#{anchor}) | {app['category']} | {app['stack']} | {docker_icon} |")
lines.append("")
lines.append("---")
lines.append("")

# Per-category sections
for cat in cat_order:
    cat_apps = grouped[cat]
    if not cat_apps:
        continue

    anchor = cat.lower().replace(" ", "-").replace("&", "").replace("/", "").replace("--", "-")
    lines.append(f"## {cat}")
    lines.append("")
    lines.append(f"**{len(cat_apps)} application{'s' if len(cat_apps) != 1 else ''}**")
    lines.append("")

    for app in cat_apps:
        lines.append(f"### {app['title']}")
        lines.append(f'<a name="{app["slug"]}"></a>')
        lines.append("")

        shot_path = f"catalogue/project-screenshots/{app['slug']}.png"
        shot_full = ROOT / shot_path
        if shot_full.exists() and shot_full.stat().st_size > 5000:
            lines.append(f"![{app['title']}]({shot_path})")
            lines.append("")

        lines.append(f"**Directory:** `{app['slug']}`  ")
        lines.append(f"**Stack:** {app['stack']}  ")
        if app["port"]:
            lines.append(f"**Port:** {app['port']}  ")
        lines.append(f"**Docker:** {'Yes' if app['has_docker'] else 'No'}  ")
        if app["desc"]:
            lines.append(f"**Description:** {app['desc']}  ")
        lines.append("")
        lines.append("```bash")
        lines.append(f"cd {app['slug']}")
        lines.append("pnpm install")
        lines.append("pnpm run dev")
        lines.append("```")
        lines.append("")

    lines.append("---")
    lines.append("")

lines.append("## Statistics Summary")
lines.append("")
lines.append("| Category | Count |")
lines.append("|----------|-------|")
for cat in cat_order:
    if grouped[cat]:
        lines.append(f"| {cat} | {len(grouped[cat])} |")
lines.append(f"| **Total** | **{total}** |")
lines.append("")
lines.append("---")
lines.append("")
lines.append(f"*Generated automatically from repository state — {_date.today().strftime('%B %d, %Y')}*  ")
lines.append("*Techbridge University College Development Team*  ")

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Written: {OUT}")
print(f"{total} apps | {react_count} React | {node_count} Node | {java_count} Java | {docker_count}/{total} Docker")

# Print category breakdown
for cat in cat_order:
    if grouped[cat]:
        print(f"  {cat}: {len(grouped[cat])}")
