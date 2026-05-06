#!/usr/bin/env node
const { chromium } = require("playwright");
const http  = require("http");
const handler = require("serve-handler");
const path  = require("path");
const fs    = require("fs");

const ROOT = path.resolve(__dirname, "..");
const CAT  = path.join(ROOT, "catalogue");
const API_KEY = "AIzaSyC7LpZwibE5Hwb5P7kzyOxI2Xe-pzSGRLI";

// Apps that have dist and should render fine now
const DIST_APPS = [
  "lems",
  "sashmade-kente-academy-proposal",
  "visual-quiz-master-v1",
  "biochemai-v151120252049",
  "container-health-auditor-2",
  "sentinel-agent",
  "dictation-app",
  "midjourney-prompt-helper",
  "omniextract",
];

// Apps that need placeholder (no UI)
const PLACEHOLDER_APPS = [
  { slug: "accommodation-management",    name: "Accommodation Management",       type: "Node.js / Express API",  desc: "Student accommodation booking and management backend" },
  { slug: "alumni-network",              name: "Alumni Network",                  type: "Node.js / Express API",  desc: "Alumni connection and engagement backend"            },
  { slug: "lecturer-assessment-portal",  name: "Lecturer Assessment Portal",      type: "Legacy Project",         desc: "Lecturer performance assessment and review system"   },
  { slug: "modern-product-dev-lifecycle",name: "Modern Product Dev Lifecycle",    type: "Legacy Project",         desc: "Product development lifecycle management tool"       },
  { slug: "patois-app",                  name: "Patois App",                      type: "Legacy Project",         desc: "Patois language tools and utilities"                 },
];

function placeholder(name, type, desc) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:800px;background:#0a0a0a;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center}
.card{text-align:center;border:1px solid rgba(200,168,75,.3);padding:60px 80px;max-width:700px}
.type{font-family:Arial,sans-serif;font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:rgba(200,168,75,.6);margin-bottom:28px}
.name{font-size:42px;font-weight:bold;color:#f0ebe0;letter-spacing:.05em;text-transform:uppercase;line-height:1.1;margin-bottom:24px}
.line{width:60px;height:1px;background:rgba(200,168,75,.4);margin:0 auto 24px}
.desc{font-style:italic;color:rgba(200,168,75,.7);font-size:18px;line-height:1.6}
.tuc{position:fixed;bottom:20px;right:24px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:rgba(200,168,75,.3)}
</style></head><body>
<div class="card"><p class="type">${type}</p><h1 class="name">${name}</h1><div class="line"></div><p class="desc">${desc}</p></div>
<span class="tuc">Techbridge University College</span>
</body></html>`;
}

async function serveAndShot(browser, distPath, outPath, env = {}) {
  // Inject env vars into index.html for API-key apps
  let indexContent = null;
  const indexPath = path.join(distPath, "index.html");
  if (Object.keys(env).length && fs.existsSync(indexPath)) {
    const orig = fs.readFileSync(indexPath, "utf8");
    const inject = `<script>${Object.entries(env).map(([k,v]) => `window.${k}=${JSON.stringify(v)}`).join(";")}</script>`;
    indexContent = orig.replace("</head>", inject + "</head>");
    fs.writeFileSync(indexPath, indexContent, "utf8");
  }

  const server = http.createServer((req, res) =>
    handler(req, res, { public: distPath, rewrites: [{ source: "**", destination: "/index.html" }] })
  );
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`http://localhost:${port}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: outPath });
    const size = fs.statSync(outPath).size;
    await page.close();
    return { size, errors };
  } finally {
    server.close();
    // Restore original index.html if we modified it
    if (indexContent && fs.existsSync(indexPath)) {
      const orig = fs.readFileSync(indexPath, "utf8");
      fs.writeFileSync(indexPath, orig.replace(/<script>window\..+?<\/script>/, ""), "utf8");
    }
  }
}

async function main() {
  const browser = await chromium.launch();
  let ok = 0, fail = 0;

  console.log("\n── Retaking dist-based screenshots ──────────────────────────");
  for (const slug of DIST_APPS) {
    const distPath = path.join(ROOT, slug, "dist");
    const outPath  = path.join(CAT, slug, "screenshot.png");
    if (!fs.existsSync(distPath)) { console.log(`  ✗ ${slug}: no dist`); fail++; continue; }
    fs.mkdirSync(path.join(CAT, slug), { recursive: true });
    process.stdout.write(`  → ${slug} ... `);
    try {
      // API-key apps get the key injected
      const needsKey = ["biochemai-v151120252049","container-health-auditor-2","sentinel-agent"].includes(slug);
      const env = needsKey ? { GEMINI_API_KEY: API_KEY, process: { env: { API_KEY } } } : {};
      const { size, errors } = await serveAndShot(browser, distPath, outPath, {});
      if (size < 15000) console.log(`⚠  ${(size/1024).toFixed(1)} KB (may be blank) errors: ${errors.slice(0,1).join("")}`);
      else { console.log(`✓  ${(size/1024).toFixed(1)} KB`); }
      ok++;
    } catch(e) { console.log(`✗  ${e.message.split("\n")[0]}`); fail++; }
  }

  console.log("\n── Generating placeholders ───────────────────────────────────");
  for (const app of PLACEHOLDER_APPS) {
    const outPath = path.join(CAT, app.slug, "screenshot.png");
    fs.mkdirSync(path.join(CAT, app.slug), { recursive: true });
    process.stdout.write(`  → ${app.slug} ... `);
    try {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.setContent(placeholder(app.name, app.type, app.desc), { waitUntil: "load" });
      await page.waitForTimeout(300);
      await page.screenshot({ path: outPath });
      const size = fs.statSync(outPath).size;
      await page.close();
      console.log(`✓  ${(size/1024).toFixed(1)} KB`);
      ok++;
    } catch(e) { console.log(`✗  ${e.message.split("\n")[0]}`); fail++; }
  }

  await browser.close();
  console.log(`\n✓ ${ok} fixed   ✗ ${fail} remaining\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
