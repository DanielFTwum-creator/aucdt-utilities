#!/usr/bin/env node
/**
 * Fix missing/blank screenshots for:
 *  1. Apps with dist/ that timed out — retry with 60s timeout
 *  2. Backend/tool apps with no UI — generate a styled placeholder
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const http = require("http");
const handler = require("serve-handler");

const ROOT = path.resolve(__dirname, "..");
const CAT  = path.join(ROOT, "catalogue");

// ── Apps with dist that timed out ─────────────────────────────────────────────
const TIMEOUT_APPS = [
  "ai-techbridge",
  "ai-flyer-generator",
  "rophe-specialist-care-rpms",
];

// ── Backend/tool apps — generate placeholder ──────────────────────────────────
const BACKEND_APPS = [
  { slug: "backend",                  name: "TUC Auth API",              type: "Express / TypeScript API", desc: "JWT authentication & user management backend" },
  { slug: "internship-program",       name: "Internship Program",        type: "Node.js / Express API",    desc: "Internship management and tracking backend"  },
  { slug: "playwright",                name: "Puppeteer Screenshot Tool", type: "Automation Tool",           desc: "Playwright/Puppeteer screenshot automation"   },
  { slug: "research-portal",          name: "Research Portal",           type: "Node.js / Express API",    desc: "Research data management backend"             },
  { slug: "techbridge-sentinel-agent",name: "Techbridge Sentinel Agent", type: "Node.js / Express API",    desc: "Autonomous monitoring and governance agent"   },
  { slug: "tsapro-mapping-review",    name: "TSAPro Mapping Review",     type: "Node.js / Express API",    desc: "TSAPRO data mapping and review backend"       },
  { slug: "tuc-portal-tests",         name: "TUC Portal Tests",          type: "Test Suite",               desc: "End-to-end Playwright test suite"             },
];

function placeholderHTML(name, type, desc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1280px; height:800px; overflow:hidden;
    background:#0a0a0a;
    font-family: 'Georgia', serif;
    display:flex; align-items:center; justify-content:center;
  }
  .card {
    text-align:center;
    border: 1px solid rgba(200,168,75,0.3);
    padding: 60px 80px;
    max-width: 700px;
    position: relative;
  }
  .card::before {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(200,168,75,0.03) 0%, transparent 60%);
    pointer-events:none;
  }
  .type {
    font-family: 'Arial', sans-serif;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(200,168,75,0.6);
    margin-bottom: 28px;
  }
  .name {
    font-size: 42px;
    font-weight: bold;
    color: #f0ebe0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .divider {
    width: 60px; height: 1px;
    background: rgba(200,168,75,0.4);
    margin: 0 auto 24px;
  }
  .desc {
    font-style: italic;
    color: rgba(200,168,75,0.7);
    font-size: 18px;
    line-height: 1.6;
  }
  .tuc {
    position:absolute; bottom:20px; right:24px;
    font-family:'Arial',sans-serif; font-size:10px;
    letter-spacing:0.25em; text-transform:uppercase;
    color:rgba(200,168,75,0.3);
  }
</style>
</head>
<body>
  <div class="card">
    <p class="type">${type}</p>
    <h1 class="name">${name}</h1>
    <div class="divider"></div>
    <p class="desc">${desc}</p>
  </div>
  <span class="tuc">Techbridge University College</span>
</body>
</html>`;
}

async function serveAndShot(browser, distPath, outPath, timeoutMs = 60000) {
  const server = http.createServer((req, res) =>
    handler(req, res, { public: distPath, rewrites: [{ source: "**", destination: "/index.html" }] })
  );
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`http://localhost:${port}`, { waitUntil: "networkidle", timeout: timeoutMs });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: outPath, fullPage: false });
    const size = fs.statSync(outPath).size;
    await page.close();
    return size;
  } finally {
    server.close();
  }
}

async function main() {
  // Check serve-handler installed
  try { require("serve-handler"); } catch {
    console.error("Missing serve-handler — run: npm install serve-handler");
    process.exit(1);
  }

  const browser = await chromium.launch();
  let ok = 0, fail = 0;

  // ── 1. Retry timeout apps ────────────────────────────────────────────────
  console.log("\n── Retrying timeout apps (60s timeout) ──────────────────────");
  for (const slug of TIMEOUT_APPS) {
    const distPath = path.join(ROOT, slug, "dist");
    const outPath  = path.join(CAT, slug, "screenshot.png");
    fs.mkdirSync(path.join(CAT, slug), { recursive: true });

    if (!fs.existsSync(distPath)) {
      console.log(`  ✗ ${slug}: no dist/ folder`);
      fail++; continue;
    }

    process.stdout.write(`  → ${slug} ... `);
    try {
      const size = await serveAndShot(browser, distPath, outPath, 60000);
      console.log(`✓  ${(size/1024).toFixed(1)} KB`);
      ok++;
    } catch (e) {
      console.log(`✗  ${e.message.split("\n")[0]}`);
      fail++;
    }
  }

  // ── 2. Placeholder screenshots for backend/tool apps ─────────────────────
  console.log("\n── Generating placeholders for backend/tool apps ─────────────");
  for (const app of BACKEND_APPS) {
    const outPath = path.join(CAT, app.slug, "screenshot.png");
    fs.mkdirSync(path.join(CAT, app.slug), { recursive: true });

    process.stdout.write(`  → ${app.slug} ... `);
    try {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.setContent(placeholderHTML(app.name, app.type, app.desc), { waitUntil: "load" });
      await page.waitForTimeout(500);
      await page.screenshot({ path: outPath });
      const size = fs.statSync(outPath).size;
      await page.close();
      console.log(`✓  ${(size/1024).toFixed(1)} KB`);
      ok++;
    } catch (e) {
      console.log(`✗  ${e.message.split("\n")[0]}`);
      fail++;
    }
  }

  await browser.close();

  console.log(`\n✓ ${ok} fixed  ✗ ${fail} remaining\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
