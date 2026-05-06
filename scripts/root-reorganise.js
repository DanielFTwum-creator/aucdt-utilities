#!/usr/bin/env node
/**
 * Root Reorganisation — Pass 2
 * Cleans up the aucdt-utilities root directory.
 * Usage: node scripts/root-reorganise.js [--apply]
 */
const fs   = require('fs');
const path = require('path');

const APPLY = process.argv.includes('--apply');
const ROOT  = path.resolve(__dirname, '..');

const ops = [];
function move(from, to) { ops.push({ type: 'move', from: path.join(ROOT, from), to: path.join(ROOT, to) }); }
function del(file)       { ops.push({ type: 'del',  from: path.join(ROOT, file) }); }
function mkdir(dir)      { ops.push({ type: 'mkdir', dir: path.join(ROOT, dir) }); }

// ── directories to create ─────────────────────────────────────────────────────
mkdir('scripts/shell');
mkdir('archive/reports');

// ── delete: root copies already in catalogue/ ─────────────────────────────────
del('PROJECT_GALLERY.html');
del('PROOF_OF_CONCEPT.html');
del('TEMPLATE_index.html');

// ── delete: logs, ephemeral outputs ───────────────────────────────────────────
[
  'build-output.log', 'update-log.txt', 'validation-output.txt',
  'BROKEN_PROJECTS.txt', 'fix-report.json', 'screenshot-list.txt',
  'aucdt_urls.txt', 'aucdt_urls.json',
  'repo_audit_findings.csv', 'repo_audit_full.csv', 'repo_audit_full.json',
  'html-validation-report.json',
  'BUILD_VALIDATION_LOG.txt',
  'QUICK_REFERENCE_GUIDE.txt',
  'SERVICE_NAME_MAPPING.txt',
].forEach(del);

// ── move: JS scripts → scripts/ ───────────────────────────────────────────────
[
  'fast-html-validator.js',
  'fix-broken-projects.js',
  'generate-docker-compose-all.js',
  'generate-screenshot-gallery.js',
  'repo_audit.js',
  'screenshot-validator.js',
  'vite.config.template.js',
].forEach(f => move(f, `scripts/${f}`));

// ── move: shell scripts → scripts/shell/ ──────────────────────────────────────
[
  'analyze_packages.sh',
  'build-all-apps.sh',
  'build-docker.sh',
  'build-local.sh',
  'clean-dirs.sh',
  'cleanup-cra-migration.sh',
  'cleanup.sh',
  'configure-pnpm.sh',
  'fix-all-base-paths.sh',
  'migrate-cra-to-vite.sh',
  'migrate-to-typescript.sh',
  'update-vite-configs.sh',
  'update-vite-serve.sh',
  'generate-docker-compose.sh',
  'github.md',
].forEach(f => move(f, `scripts/shell/${f}`));

// PowerShell scripts (in root from previous ls — check existence before moving)
[
  'build-all-apps.ps1',
  'build-all-phases.ps1',
  'build-tracker-all-phases.ps1',
  'generate-compose-complete.ps1',
  'generate-docker-compose-all.ps1',
  'monitor-build.ps1',
  'update-vite-serve.ps1',
].forEach(f => move(f, `scripts/shell/${f}`));

// Python generators → scripts/
[
  'generate_all_srs.py',
  'generate_enhanced_react_apps.py',
  'generate_react_apps.py',
].forEach(f => move(f, `scripts/${f}`));

// ── move: historical reports → archive/reports/ ───────────────────────────────
[
  'ARCHITECTURE_GAP_ANALYSIS.md',
  'BUILD_TOOL_ANALYSIS_INDEX.md',
  'BUILD_TOOL_EXECUTIVE_SUMMARY.txt',
  'COMPREHENSIVE_GAP_ANALYSIS_20260302.md',
  'DEPLOYMENT_CHECKLIST.md',
  'DOCKER_BUILD_CHECKLIST.md',
  'DOCKER_COMPREHENSIVE_AUDIT_20260302.md',
  'DOCKER_ECOSYSTEM_GUIDE.md',
  'DOCKER_GUIDE.md',
  'DOCKER_IMPLEMENTATION_SUMMARY.md',
  'DOCKER_QUICK_REFERENCE.md',
  'DOCKER_QUICK_START.md',
  'DOCKER_STARTUP.md',
  'DOCUMENTATION_INDEX.md',
  'ENHANCED_GENERATION_SUMMARY.md',
  'GAP_ANALYSIS_COMPREHENSIVE_2026.md',
  'GAP_ANALYSIS_REPORT.md',
  'GENERATION_SUMMARY.md',
  'IMPLEMENTATION_PROGRESS.md',
  'IMPLEMENTATION_PROGRESS_20260302.md',
  'PACKAGE_ANALYSIS_SUMMARY.md',
  'PHASE_3_COMPLETION_REPORT.md',
  'PIPELINE_DOCUMENTATION.md',
  'QUICK_START.md',
  'README_COMPLETE.md',
  'SCREENSHOT_GALLERY_README.md',
  'THE_AGENT_ROADMAP.md',
  'TYPESCRIPT_PNPM_MIGRATION.md',
  'VITE_MIGRATION_SUMMARY.md',
  'WEEK1_IMPLEMENTATION_STATUS.md',
  'WORKLIST.md',
  'aucdt-sitemap-summary.md',
  'repo_audit_summary.md',
  'PACKAGE_ANALYSIS_SUMMARY.md',
  // Backups
  'bitbucket-pipelines-backup-20260220.yml',
  'docker-compose-all-apps.yml.backup',
  'CLAUDE.md.backup',
  // Phase log files
  'phase1-build.log',
  'phase1-fixed.log',
  'phase1-retry.log',
].forEach(f => move(f, `archive/reports/${f}`));

// ── execute ────────────────────────────────────────────────────────────────────

if (!APPLY) {
  console.log('\nDRY RUN — operations planned:\n');
  let moves = 0, dels = 0;
  for (const op of ops) {
    if (op.type === 'mkdir') { console.log(`  MKDIR  ${op.dir.replace(ROOT, '.')}`); continue; }
    if (!fs.existsSync(op.from)) continue; // skip non-existent
    if (op.type === 'del')  { console.log(`  DELETE ${op.from.replace(ROOT, '.')}`); dels++; }
    if (op.type === 'move') { console.log(`  MOVE   ${op.from.replace(ROOT, '.')}  →  ${op.to.replace(ROOT, '.')}`); moves++; }
  }
  console.log(`\nTotal: ${moves} moves, ${dels} deletes`);
  console.log('Re-run with --apply to execute.');
  process.exit(0);
}

// Apply
let moved = 0, deleted = 0, skipped = 0;
for (const op of ops) {
  if (op.type === 'mkdir') {
    fs.mkdirSync(op.dir, { recursive: true });
    continue;
  }
  if (!fs.existsSync(op.from)) { skipped++; continue; }
  if (op.type === 'del') {
    fs.unlinkSync(op.from);
    deleted++;
  } else if (op.type === 'move') {
    fs.mkdirSync(path.dirname(op.to), { recursive: true });
    fs.renameSync(op.from, op.to);
    moved++;
  }
}
console.log(`\nDone: ${moved} files moved, ${deleted} files deleted, ${skipped} skipped (not found).`);
