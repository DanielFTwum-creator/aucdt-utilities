/**
 * Techbridge Government Pitch — PDF Export Script
 * Captures all 8 website pages + Executive Summary to PDF using Playwright.
 *
 * Usage:
 *   pnpm run export-pdf
 *
 * Output:
 *   exports/Techbridge-One-Million-Coders-Proposal.pdf   (full site)
 *   exports/Techbridge-Executive-Summary.pdf              (exec summary)
 */

import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import { spawn } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const EXPORTS = resolve(ROOT, 'exports')
const PORT = 4174

const SITE_ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/why-techbridge', label: 'Why Techbridge' },
  { path: '/programme', label: 'The Programme' },
  { path: '/platform', label: 'Our Platform' },
  { path: '/track-record', label: 'Track Record' },
  { path: '/impact', label: 'Impact' },
  { path: '/implementation', label: 'Implementation' },
  { path: '/contact', label: 'Contact' },
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function testPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(res.statusCode < 500)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(500, () => req.destroy())
  })
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['node_modules/.bin/vite', 'preview', '--port', String(PORT)],
      { cwd: ROOT, shell: process.platform === 'win32', stdio: 'inherit' }
    )

    proc.on('error', reject)

    // Poll for port to be ready (with fallback to alternate ports)
    let attempts = 0
    const checkReady = async () => {
      attempts++
      if (attempts > 30) {
        reject(new Error(`Preview server failed to start after 30 attempts`))
        return
      }

      // Try the requested port first, then check 4173 (default Vite preview port)
      const portReady = await testPort(PORT) || await testPort(4173)
      if (portReady) {
        resolve(proc)
      } else {
        setTimeout(checkReady, 200)
      }
    }

    setTimeout(checkReady, 500)
  })
}

async function capturePage(page, url, label) {
  console.log(`  → ${label}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await sleep(1200)
  return page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  })
}

async function mergeAndSave(buffers, filename) {
  const merged = await PDFDocument.create()
  for (const buf of buffers) {
    const doc = await PDFDocument.load(buf)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach(p => merged.addPage(p))
  }
  const bytes = await merged.save()
  const outPath = resolve(EXPORTS, filename)
  writeFileSync(outPath, bytes)
  console.log(`  ✅ Saved → exports/${filename}`)
}

async function main() {
  mkdirSync(EXPORTS, { recursive: true })

  if (!existsSync(resolve(ROOT, 'dist'))) {
    console.log('⚙  No dist found — building first...')
    const { execSync } = await import('child_process')
    execSync('node node_modules/.bin/vite build', { cwd: ROOT, stdio: 'inherit' })
  }

  console.log('\n🚀 Starting preview server...')
  const server = await startPreviewServer()

  // Extra wait to ensure server is fully ready
  await sleep(2000)

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  try {
    const page = await context.newPage()

    // Detect actual port (try PORT first, then 4173 default)
    let actualPort = PORT
    if (!(await testPort(PORT))) {
      if (await testPort(4173)) {
        actualPort = 4173
      } else {
        throw new Error('Preview server not responding on ports 4174 or 4173')
      }
    }

    // ── Full Site Export ──────────────────────────────────────────
    console.log(`\n📄 Exporting full site PDF (port ${actualPort})...`)
    const siteBuffers = []
    for (const route of SITE_ROUTES) {
      const pdf = await capturePage(page, `http://localhost:${actualPort}${route.path}`, route.label)
      siteBuffers.push(pdf)
    }
    await mergeAndSave(siteBuffers, 'Techbridge-One-Million-Coders-Proposal.pdf')

    // ── Executive Summary ─────────────────────────────────────────
    console.log('\n📋 Exporting Executive Summary...')
    const execBuf = await capturePage(page, `http://localhost:${actualPort}/executive-summary`, 'Executive Summary')
    await mergeAndSave([execBuf], 'Techbridge-Executive-Summary.pdf')

  } finally {
    await browser.close()
    server.kill()
  }

  console.log('\n✅ All PDFs exported to ./exports/')
}

main().catch(err => {
  console.error('Export failed:', err.message)
  process.exit(1)
})
