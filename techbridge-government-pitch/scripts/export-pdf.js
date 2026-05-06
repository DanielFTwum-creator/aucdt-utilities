/**
 * Techbridge Government Pitch — PDF Export Script
 * Captures all 8 website pages + Executive Summary to PDF.
 *
 * Usage:
 *   pnpm run export-pdf
 *
 * Output:
 *   exports/Techbridge-One-Million-Coders-Proposal.pdf   (full site)
 *   exports/Techbridge-Executive-Summary.pdf              (exec summary)
 */

import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib'
import { spawn } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['node_modules/.bin/vite', 'preview', '--port', String(PORT), '--strictPort'],
      { cwd: ROOT, shell: process.platform === 'win32', stdio: 'pipe' }
    )
    let started = false
    proc.stdout.on('data', (d) => {
      const out = d.toString()
      if (!started && out.includes('Local:')) {
        started = true
        resolve(proc)
      }
    })
    proc.stderr.on('data', (d) => {
      const err = d.toString()
      if (!started && err.includes('Local:')) {
        started = true
        resolve(proc)
      }
    })
    proc.on('error', reject)
    setTimeout(() => {
      if (!started) {
        started = true
        resolve(proc)
      }
    }, 5000)
  })
}

async function capturePage(page, url, label) {
  console.log(`  → ${label}`)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await sleep(1500)
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
  console.log(`  ✅ Saved → ${outPath}`)
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

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 })

    // ── Full Site Export ──────────────────────────────────────────────────
    console.log('\n📄 Exporting full site PDF...')
    const siteBuffers = []
    for (const route of SITE_ROUTES) {
      const pdf = await capturePage(page, `http://localhost:${PORT}${route.path}`, route.label)
      siteBuffers.push(pdf)
    }
    await mergeAndSave(siteBuffers, 'Techbridge-One-Million-Coders-Proposal.pdf')

    // ── Executive Summary ─────────────────────────────────────────────────
    console.log('\n📋 Exporting Executive Summary...')
    const execBuf = await capturePage(page, `http://localhost:${PORT}/executive-summary`, 'Executive Summary')
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
