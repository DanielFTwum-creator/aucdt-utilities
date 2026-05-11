/**
 * Generate PDF versions of introductory documents
 *
 * Usage:
 *   node scripts/generate-intro-pdfs.js
 *
 * Output:
 *   public/documents/Techbridge-Intro-Letter.pdf
 *   public/documents/Techbridge-Intro-Email.pdf
 */

import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_DIR = resolve(ROOT, 'public', 'documents');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function generateLetterHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Letter</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm;
      margin: 0 auto;
      box-sizing: border-box;
      background: white;
    }
    .header {
      margin-bottom: 30px;
      border-bottom: 2px solid #8C1A2E;
      padding-bottom: 15px;
    }
    .institution {
      font-size: 18px;
      font-weight: bold;
      color: #0f2545;
      margin-bottom: 5px;
    }
    .location {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }
    .date {
      text-align: right;
      font-size: 12px;
      color: #666;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .recipient {
      margin-bottom: 20px;
      font-size: 12px;
    }
    .salutation {
      margin-bottom: 20px;
      font-weight: bold;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #0f2545;
      margin-top: 15px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    p {
      font-size: 12px;
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.7;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    li {
      margin-bottom: 6px;
      line-height: 1.6;
    }
    .highlight {
      font-weight: bold;
      color: #0f2545;
    }
    .closing {
      margin-top: 30px;
      font-size: 12px;
    }
    .signature {
      margin-top: 40px;
      font-size: 12px;
    }
    .contact {
      margin-top: 15px;
      font-size: 11px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <div class="location">Oyibi, Greater Accra, Ghana</div>
      <div class="location">Tel: +233-302788895 | Email: daniel.twum@techbridge.edu.gh</div>
      <div class="location">Web: www.techbridge.edu.gh</div>
    </div>

    <div class="date">Date: 7 May 2026</div>

    <div class="recipient">
      <strong>TO THE HONOURABLE MINISTRIES & SMARTBRIDGE EDUCATION SERVICES</strong>
    </div>

    <p><strong>RE: Strategic Partnership Proposal — Ghana's One Million Coders Programme</strong></p>

    <div class="salutation">DEAR SIRS AND MADAM,</div>

    <p>Techbridge University College writes to formally introduce ourselves as a strategic partner for Ghana's One Million Coders Programme, in collaboration with SmartBridge Education Services.</p>

    <div class="section-title">WHO WE ARE</div>
    <p>Techbridge University College is Ghana's leading technical institution, headquartered in Oyibi, Greater Accra. We specialise in industry-aligned digital and engineering disciplines through accredited degree programmes and hands-on, project-based learning methodologies. Our four specialised programmes — Product Design and Entrepreneurship, Fashion Design Technology, Jewellery Design Technology, and Digital Media & Communications Design — address Ghana's highest-value industrial sectors and export opportunities.</p>

    <p>As a quality-focused institution, we maintain an excellence-driven enrolment of approximately 200 students, with demonstrable track records in:</p>
    <ul>
      <li><span class="highlight">Industrial Partnership:</span> Direct collaboration with Ghanaian SMEs and enterprises on live projects</li>
      <li><span class="highlight">Curriculum Innovation:</span> Bridging academic theory with real-world technology applications and industry standards</li>
      <li><span class="highlight">Data Sovereignty:</span> Full compliance with Ghana's Data Protection Act and national digital policy</li>
      <li><span class="highlight">Institutional Credibility:</span> Accredited programmes, proven delivery, and strong employer partnerships</li>
    </ul>

    <div class="section-title">THE OPPORTUNITY</div>
    <p>The Government of Ghana's One Million Coders Programme represents a transformative national initiative to equip young Ghanaians with critical digital skills for the 21st-century economy. This vision aligns perfectly with Techbridge's mission: to cultivate a generation of sovereign industrial architects capable of building, owning, and exporting technology rooted in Ghanaian context.</p>

    <div class="section-title">WHY TECHBRIDGE?</div>
    <p>We bring three irreplaceable assets to this programme:</p>
    <ul>
      <li><span class="highlight">Operational Readiness</span> — Techbridge's existing campus infrastructure, trained personnel, and active student cohort eliminate the need for a lengthy build phase. The programme can commence within eight weeks of partnership ratification.</li>
      <li><span class="highlight">Local Institutional Credibility</span> — We are not a foreign vendor. We are a Ghanaian institution with deep understanding of local policy, regulatory landscape, employer ecosystems, and student demographics.</li>
      <li><span class="highlight">Industrial Alignment</span> — Our specialised programmes directly address Ghana's sectoral export strategies, ensuring graduate employability and economic impact.</li>
    </ul>

    <div class="section-title">THE SMARTBRIDGE PARTNERSHIP</div>
    <p>We propose integrating SmartBridge Education Services' proven Skill Wallet platform — a global experiential learning ecosystem with 2+ million learners across 3,000+ institutions — with Techbridge's institutional infrastructure and regional reach.</p>

    <p>This is not a capacity-building exercise. It is a <span class="highlight">structural transformation</span> of Ghana's technical workforce:</p>
    <ul>
      <li><span class="highlight">SmartBridge India</span> provides the global AI-native learning platform, algorithmic curriculum engine, and international quality standards</li>
      <li><span class="highlight">SmartBridge Ghana</span> manages in-country deployment and government liaison</li>
      <li><span class="highlight">Techbridge</span> anchors the partnership with physical facilities, accredited programmes, and sovereign data stewardship</li>
    </ul>

    <p>The result: world-class technology delivered with absolute Ghanaian control.</p>

    <div class="section-title">OUR COMMITMENT</div>
    <p>As Head of Institution, I commit Techbridge to:</p>
    <ul>
      <li>✓ 100% alignment with Ghana's digital and sectoral policy frameworks</li>
      <li>✓ Full transparency in programme delivery, student outcomes, and government reporting</li>
      <li>✓ Data sovereignty — all student PII and assessment data remain in Ghana under Techbridge stewardship</li>
      <li>✓ Economic retention — 60% of technical service fees circulate within Ghana's domestic economy</li>
      <li>✓ Measurable impact — real-time government dashboards tracking enrolment, competency growth, and outcomes</li>
    </ul>

    <div class="section-title">NEXT STEPS</div>
    <p>We invite the relevant ministries and SmartBridge leadership to a technical synchronisation workshop to finalise the Sovereign Access Node deployment plan, initiate the SME Demand Mapping audit, align curriculum with Ministry vocational standards, and establish governance structures.</p>

    <p>We have prepared a comprehensive Alliance Brief detailing the strategic vision, delivery framework, economic impact projections, and implementation roadmap. This document is ready for your review and discussion.</p>

    <div class="section-title">CLOSING</div>
    <p>Ghana's digital transformation is not a capacity-building exercise—it is a structural statement about our nation's sovereignty and economic future. By partnering with Techbridge and SmartBridge, the Government of Ghana can demonstrate that the One Million Coders Programme builds Ghana, for Ghanaians, with absolute control over our digital future.</p>

    <p>We stand ready to commence Phase One immediately upon agreement.</p>

    <div class="closing">
      <p><strong>Yours in service to Ghana's digital future,</strong></p>

      <div class="signature">
        <p><strong>Daniel Frempong Twum</strong></p>
        <p>Head of ICT & Special Adviser to the Founder</p>
        <p>Techbridge University College</p>

        <div class="contact">
          <p>Tel: +233-302788895</p>
          <p>Email: daniel.twum@techbridge.edu.gh</p>
          <p>Mobile: [Your contact]</p>
        </div>
      </div>

      <p style="margin-top: 20px; font-size: 11px; color: #999;">
        Cc: Ministry of Communications and Digitalization | Presidential Special Initiatives | Youth and Employment Agency | Ghana Digital Centre | SmartBridge Education Services (India & Ghana)
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Email</title>
  <style>
    * { margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 25mm;
      margin: 0 auto;
      box-sizing: border-box;
      background: white;
    }
    .header {
      margin-bottom: 20px;
      border-bottom: 2px solid #8C1A2E;
      padding-bottom: 15px;
    }
    .institution {
      font-size: 16px;
      font-weight: bold;
      color: #0f2545;
    }
    .subject-line {
      margin: 20px 0;
      padding: 12px;
      background: #f5f5f5;
      border-left: 4px solid #8C1A2E;
    }
    .subject-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .subject-text {
      font-size: 13px;
      font-weight: bold;
      color: #0f2545;
      margin-top: 4px;
    }
    .greeting {
      margin-bottom: 15px;
      font-size: 12px;
    }
    p {
      font-size: 12px;
      margin-bottom: 12px;
      text-align: justify;
      line-height: 1.7;
    }
    .highlight {
      font-weight: bold;
      color: #0f2545;
    }
    ul {
      margin-left: 20px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    li {
      margin-bottom: 6px;
    }
    .signature-block {
      margin-top: 25px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
      font-size: 11px;
    }
    .signature-line {
      margin-bottom: 4px;
    }
    .checklist {
      margin: 15px 0;
      padding: 12px;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
    }
    .checklist-title {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .checklist-item {
      font-size: 11px;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <p style="font-size: 11px; color: #666; margin-top: 4px;">Oyibi, Greater Accra, Ghana | daniel.twum@techbridge.edu.gh | +233-302788895</p>
    </div>

    <div class="subject-line">
      <div class="subject-label">Email Subject:</div>
      <div class="subject-text">Strategic Partnership Proposal — Ghana's One Million Coders Programme (Techbridge University College)</div>
    </div>

    <div class="greeting">
      <strong>Dear [Minister/Director Name],</strong>
    </div>

    <p>I write from Techbridge University College to introduce a strategic partnership opportunity for Ghana's One Million Coders Programme.</p>

    <p><span class="highlight">Techbridge</span> is Ghana's leading technical institution (Oyibi, Greater Accra) with ~200 quality-focused students, four accredited industrial-aligned degree programmes, and proven delivery across Product Design, Fashion Technology, Jewellery Design, and Digital Media. We bring operational readiness, institutional credibility, and deep local policy alignment—plus campus infrastructure ready to scale.</p>

    <p><span class="highlight">SmartBridge</span> brings a global AI-native learning platform (Skill Wallet) proven across 3,000+ institutions and 2+ million learners worldwide.</p>

    <p>Together, we propose a <span class="highlight">three-entity alliance:</span></p>
    <ul>
      <li>SmartBridge India provides the global technology platform</li>
      <li>SmartBridge Ghana manages in-country implementation</li>
      <li>Techbridge provides campus infrastructure, accredited programmes, and sovereign data stewardship</li>
    </ul>

    <p><span class="highlight">The outcome:</span> World-class digital skills training for Ghana's one million young people, with 100% Ghanaian control, measurable employment outcomes, and 60% economic retention within Ghana's domestic economy.</p>

    <p><span class="highlight">Programme can launch within 8 weeks</span> of partnership ratification, using Techbridge's existing infrastructure and personnel—no build phase required.</p>

    <p>I invite you to a technical synchronisation workshop to discuss the strategic vision, deployment roadmap, and governance structures. I have attached:</p>
    <ul>
      <li>SmartGhana Interactive Proposal (digital presentation)</li>
      <li>Alliance Brief PDF (formal 3-page document)</li>
      <li>Implementation Roadmap (5-phase, 32-week deployment)</li>
    </ul>

    <p><strong>Next steps:</strong> Please let me know your availability for a meeting in <strong>May/June 2026</strong> to discuss how Techbridge, SmartBridge, and the Government of Ghana can jointly transform digital workforce readiness.</p>

    <p>I look forward to partnering to build Ghana's digital future.</p>

    <div class="signature-block">
      <div class="signature-line"><strong>Best regards,</strong></div>
      <div class="signature-line" style="margin-top: 12px;">Daniel Frempong Twum</div>
      <div class="signature-line">Head of ICT & Special Adviser to the Founder</div>
      <div class="signature-line">Techbridge University College</div>
      <div style="margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
        <div class="signature-line">📧 daniel.twum@techbridge.edu.gh</div>
        <div class="signature-line">📱 +233-302788895</div>
        <div class="signature-line">🌐 www.techbridge.edu.gh</div>
        <div class="signature-line">🏢 Oyibi, Greater Accra, Ghana</div>
      </div>
    </div>

    <p style="margin-top: 20px; font-size: 11px; color: #999;">
      <strong>P.S.</strong> — This proposal aligns directly with Ghana's National Digital Transformation Strategy, the Ministry of Education's digital literacy targets, the Ministry of Trade's sectoral export development agenda, and the Youth and Employment Agency's workforce readiness mandate. We are ready to commence immediately upon government approval.
    </p>
  </div>
</body>
</html>
  `;
}

async function generatePDF(htmlContent, filename) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 }, // A4 at 96dpi
    });
    const page = await context.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    await sleep(1000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      displayHeaderFooter: false,
    });

    const outPath = resolve(DOCS_DIR, filename);
    writeFileSync(outPath, pdfBuffer);
    console.log(`  ✅ Generated → public/documents/${filename}`);

  } finally {
    await browser.close();
  }
}

async function main() {
  mkdirSync(DOCS_DIR, { recursive: true });

  console.log('\n📄 Generating PDF versions of introductory documents...\n');

  await generatePDF(generateLetterHTML(), 'Techbridge-Intro-Letter.pdf');
  await generatePDF(generateEmailHTML(), 'Techbridge-Intro-Email.pdf');

  console.log('\n✅ PDF generation complete.\n');
}

main().catch(err => {
  console.error('\n❌ PDF generation failed:', err.message);
  process.exit(1);
});
