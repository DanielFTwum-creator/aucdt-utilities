#!/usr/bin/env node
// SessionStart hook: inject a compact, always-current governance banner so the
// authoritative docs are never skipped. CLAUDE.md is auto-loaded by Claude Code
// already; this hook covers the two files that are NOT auto-loaded and have
// caused costly bites when missed:
//   - PATTERNS.md   (2,800+ lines) — too large to auto-load in full, so we
//                    inject only the live index: which pattern to open, when.
//   - CONSTRAINTS.md (one per project, 39+) — the active project's file
//                    overrides defaults; we list the projects that have one.
//
// The index and the project list are generated from disk on every session, so
// adding a pattern or a CONSTRAINTS.md keeps this current with zero maintenance
// (drift is exactly what has bitten this repo before).
//
// Output mirrors the proven PreToolUse hook (.claude/hooks/no-npm.mjs): a
// `hookSpecificOutput` envelope. For SessionStart the field is
// `additionalContext`, a string added to the session context.
//
// Wired in .claude/settings.json under hooks.SessionStart via the exec form
// ("command":"node","args":[...]) so no shell quoting is involved and it is
// portable across git-bash and PowerShell.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();

function patternIndex() {
  const p = path.join(ROOT, 'PATTERNS.md');
  if (!existsSync(p)) return [];
  try {
    return readFileSync(p, 'utf8')
      .split('\n')
      .filter((l) => /^## PATTERN \d+:/i.test(l))
      .map((l) => l.replace(/^##\s*/, '').trim());
  } catch {
    return [];
  }
}

function projectsWithConstraints() {
  const names = [];
  let entries = [];
  try {
    entries = readdirSync(ROOT, { withFileTypes: true });
  } catch {
    return names;
  }
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.') || e.name === 'node_modules') continue;
    if (existsSync(path.join(ROOT, e.name, 'CONSTRAINTS.md'))) names.push(e.name);
  }
  return names.sort();
}

function buildBanner() {
  const patterns = patternIndex();
  const projects = projectsWithConstraints();
  const lines = [];

  lines.push('AUCDT-UTILITIES GOVERNANCE — read before generating output.');
  lines.push('');
  lines.push('CLAUDE.md is already loaded; follow it, including the Session Start Protocol.');
  lines.push('AGENT_OPERATING_NOTES.md holds hard zero-assumption rules (server paths, SSH quoting, size-before-shaping) — open it.');
  lines.push('');

  if (patterns.length) {
    lines.push(`PATTERNS.md is the authoritative fleet pattern library (${patterns.length} patterns). Do NOT`);
    lines.push('reimplement a fleet pattern from memory. Open the relevant pattern in PATTERNS.md');
    lines.push('before doing its kind of work (deploys, OAuth/WMS relay, images/code-split,');
    lines.push('sub-path SPA serving, DB provisioning, HTML/theming). Live index:');
    for (const t of patterns) lines.push(`  - ${t}`);
    lines.push('');
  }

  if (projects.length) {
    lines.push('CONSTRAINTS.md is per project and OVERRIDES all defaults (OS, services, ports,');
    lines.push("tooling). Before writing or changing code in a project, read THAT project's");
    lines.push(`CONSTRAINTS.md first. Projects that have one (${projects.length}):`);
    lines.push('  ' + projects.join(', '));
    lines.push('');
  }

  lines.push('Skipping these files has caused costly incidents. Treat this as mandatory.');
  return lines.join('\n');
}

// Consume stdin (the SessionStart payload) then emit the banner. We inject on
// every source (startup/resume/clear/compact); the banner is small and being
// present after a compaction is exactly when it matters most.
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  let banner;
  try {
    banner = buildBanner();
  } catch {
    process.exit(0); // never block a session start on a hook error
  }
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: banner,
    },
  }));
  process.exit(0);
});
