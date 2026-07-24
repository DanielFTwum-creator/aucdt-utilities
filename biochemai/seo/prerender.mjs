// seo/prerender.mjs — build-time SEO/GEO prerender for the TUC Vite fleet.
//
// Runs after `vite build` (see package.json "build"). Pure Node, no browser:
// the Plesk build box has no Chromium, and these apps hard-gate on auth, so a
// headless snapshot would only ever capture a login wall. Instead we inject a
// curated, crawler-visible content block plus JSON-LD from seo/seo.config.json,
// and emit robots.txt / sitemap.xml / llms.txt. One script, one config per app.
//
// What it produces in dist/:
//   - index.html  : JSON-LD graph in <head>, content block inside #root
//   - robots.txt  : crawl + generative-engine (GEO) directives
//   - sitemap.xml : the app's canonical URL
//   - llms.txt    : plain-text app summary for LLM answer engines
//
// React's createRoot() clears #root on boot, so the injected block is replaced
// for real users; crawlers and non-JS LLM scrapers keep the static content.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const distDir = join(root, 'dist');
const htmlPath = join(distDir, 'index.html');

const cfg = JSON.parse(readFileSync(join(here, 'seo.config.json'), 'utf8'));

if (!existsSync(htmlPath)) {
  console.error(`[seo] dist/index.html not found — run "vite build" first.`);
  process.exit(1);
}

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const today = new Date().toISOString().slice(0, 10);
const orgId = `${cfg.organization.url}#organization`;
const appId = `${cfg.url}#app`;

// ── JSON-LD @graph ─────────────────────────────────────────────────────────
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': orgId,
      name: cfg.organization.name,
      alternateName: cfg.organization.alternateName,
      url: cfg.organization.url,
      logo: cfg.organization.logo,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cfg.organization.locality,
        addressRegion: cfg.organization.region,
        addressCountry: cfg.organization.country,
      },
      sameAs: cfg.organization.sameAs || [],
    },
    {
      '@type': 'WebSite',
      '@id': `${cfg.url}#website`,
      url: cfg.url,
      name: cfg.name,
      inLanguage: cfg.inLanguage,
      publisher: { '@id': orgId },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': appId,
      name: cfg.name,
      alternateName: cfg.shortName,
      url: cfg.url,
      description: cfg.description,
      applicationCategory: cfg.applicationCategory,
      operatingSystem: cfg.operatingSystem,
      inLanguage: cfg.inLanguage,
      image: cfg.image,
      featureList: cfg.features,
      audience: { '@type': 'EducationalAudience', description: cfg.audience },
      publisher: { '@id': orgId },
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${cfg.url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: cfg.organization.name, item: cfg.organization.url },
        { '@type': 'ListItem', position: 2, name: cfg.name, item: cfg.url },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${cfg.url}#faq`,
      mainEntity: (cfg.faqs || []).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

// ── Crawler-visible content block (replaced by React on boot) ──────────────
const contentBlock = `
      <div class="biochemai-splash">
        <span class="biochemai-logo">Bio<span>Chem</span>AI</span>
        <div class="biochemai-status">Teaching Aid</div>
        <div class="biochemai-loading"></div>
      </div>
      <section aria-label="About ${esc(cfg.name)}" style="max-width:720px;margin:2rem auto;padding:0 1.25rem;font-family:var(--font-sans,system-ui,sans-serif);color:var(--color-text-primary,#334155);line-height:1.6;">
        <h1 style="font-size:1.6rem;margin:.5rem 0;">${esc(cfg.name)} — ${esc(cfg.tagline)}</h1>
        <p>${esc(cfg.description)}</p>
        <h2 style="font-size:1.15rem;margin:1.5rem 0 .5rem;">What ${esc(cfg.shortName)} does</h2>
        <ul style="padding-left:1.2rem;">
          ${cfg.features.map((f) => `<li>${esc(f)}</li>`).join('\n          ')}
        </ul>
        <p><strong>Who it is for:</strong> ${esc(cfg.audience)}.</p>
        <h2 style="font-size:1.15rem;margin:1.5rem 0 .5rem;">Frequently asked questions</h2>
        <dl>
          ${cfg.faqs
            .map((f) => `<dt style="font-weight:600;margin-top:.75rem;">${esc(f.q)}</dt>\n          <dd style="margin:.25rem 0 0;">${esc(f.a)}</dd>`)
            .join('\n          ')}
        </dl>
        <p style="margin-top:1.5rem;font-size:.9rem;opacity:.8;">Built by
          <a href="${esc(cfg.organization.url)}" style="color:inherit;">${esc(cfg.organization.name)}</a>,
          ${esc(cfg.organization.locality)}, ${esc(cfg.organization.region)}, Ghana.</p>
      </section>
    `;

// ── Inject into dist/index.html ────────────────────────────────────────────
let html = readFileSync(htmlPath, 'utf8');

html = html.replace(
  /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
  `<script type="application/ld+json" id="seo-jsonld">${JSON.stringify(graph)}</script>`,
);

html = html.replace(
  /<!-- seo:content-start -->[\s\S]*?<!-- seo:content-end -->/,
  `<!-- seo:content-start -->${contentBlock}<!-- seo:content-end -->`,
);

writeFileSync(htmlPath, html);

// ── Discovery files ────────────────────────────────────────────────────────
const geoBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-Web', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
const robots = cfg.index
  ? `# ${cfg.name} — ${cfg.url}\nUser-agent: *\nAllow: /\n\n# Generative engines (GEO) — allow answer-engine indexing\n${geoBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n')}\n\nSitemap: ${cfg.url}sitemap.xml\n`
  : `# ${cfg.name} — internal tool, not for indexing\nUser-agent: *\nDisallow: /\n`;
writeFileSync(join(distDir, 'robots.txt'), robots);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${cfg.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);

const llms = `# ${cfg.name}\n\n> ${cfg.tagline}. ${cfg.description}\n\nURL: ${cfg.url}\nPublisher: ${cfg.organization.name} (${cfg.organization.alternateName}), ${cfg.organization.locality}, ${cfg.organization.region}, Ghana.\n\n## Features\n${cfg.features.map((f) => `- ${f}`).join('\n')}\n\n## Audience\n${cfg.audience}.\n\n## FAQ\n${cfg.faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}\n`;
writeFileSync(join(distDir, 'llms.txt'), llms);

console.log(`[seo] injected JSON-LD + content block and wrote robots.txt, sitemap.xml, llms.txt for ${cfg.name} (${cfg.index ? 'indexable' : 'noindex'})`);
