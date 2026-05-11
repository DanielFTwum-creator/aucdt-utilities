import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

async function generateLetterHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Letter</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
    }

    .document {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 25mm;
      background: white;
      position: relative;
    }

    .header {
      border-bottom: 3px solid #FCD116;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .institution {
      font-weight: 600;
      font-size: 14px;
      color: #0f2545;
    }

    .institution-details {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .date-section {
      margin-top: 24px;
      margin-bottom: 24px;
      font-size: 13px;
    }

    .recipient {
      margin-bottom: 24px;
      font-size: 13px;
    }

    .recipient-label {
      font-weight: 600;
      color: #0f2545;
    }

    h1 {
      font-size: 16px;
      font-weight: 700;
      color: #0f2545;
      margin: 24px 0 12px 0;
      line-height: 1.4;
    }

    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #0f2545;
      margin: 18px 0 10px 0;
    }

    p {
      font-size: 12px;
      line-height: 1.7;
      margin-bottom: 12px;
      text-align: justify;
    }

    .section {
      margin-bottom: 16px;
    }

    ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 6px;
    }

    .checkmark {
      margin-right: 8px;
      color: #059669;
      font-weight: bold;
    }

    .signature-section {
      margin-top: 32px;
      font-size: 12px;
    }

    .signature-name {
      font-weight: 600;
      color: #0f2545;
      margin-top: 12px;
    }

    .signature-title {
      color: #6b7280;
      font-size: 11px;
      margin-top: 4px;
    }

    .cc-section {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }

    strong {
      color: #0f2545;
      font-weight: 600;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .document { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="institution">TECHBRIDGE UNIVERSITY COLLEGE</div>
      <div class="institution-details">
        Oyibi, Greater Accra, Ghana<br>
        Tel: +233-302788895<br>
        Email: daniel.twum@techbridge.edu.gh<br>
        Web: www.techbridge.edu.gh
      </div>
    </div>

    <div class="date-section">
      <strong>Date:</strong> 7 May 2026
    </div>

    <div class="recipient">
      <div class="recipient-label">TO THE HONOURABLE MINISTRIES & SMARTBRIDGE EDUCATION SERVICES</div>
      <div style="margin-top: 8px;">
        <strong>RE:</strong> Strategic Partnership Proposal — Ghana's One Million Coders Programme
      </div>
    </div>

    <p style="margin-bottom: 16px;"><strong>DEAR SIRS AND MADAM,</strong></p>

    <div class="section">
      <p>Techbridge University College writes to formally introduce ourselves as a strategic partner for Ghana's One Million Coders Programme, in collaboration with SmartBridge Education Services.</p>
    </div>

    <div class="section">
      <h2>WHO WE ARE</h2>
      <p>Techbridge University College is Ghana's leading technical institution, headquartered in Oyibi, Greater Accra. We specialise in industry-aligned digital and engineering disciplines through accredited degree programmes and hands-on, project-based learning methodologies. Our four specialised programmes — Product Design and Entrepreneurship, Fashion Design Technology, Jewellery Design Technology, and Digital Media & Communications Design — address Ghana's highest-value industrial sectors and export opportunities.</p>

      <p>As a quality-focused institution, we maintain an excellence-driven enrolment of approximately 200 students, with demonstrable track records in:</p>
      <ul>
        <li><strong>Industrial Partnership:</strong> Direct collaboration with Ghanaian SMEs and enterprises on live projects</li>
        <li><strong>Curriculum Innovation:</strong> Bridging academic theory with real-world technology applications and industry standards</li>
        <li><strong>Data Sovereignty:</strong> Full compliance with Ghana's Data Protection Act and national digital policy</li>
        <li><strong>Institutional Credibility:</strong> Accredited programmes, proven delivery, and strong employer partnerships</li>
      </ul>
    </div>

    <div class="section">
      <h2>THE OPPORTUNITY</h2>
      <p>The Government of Ghana's One Million Coders Programme represents a transformative national initiative to equip young Ghanaians with critical digital skills for the 21st-century economy. This vision aligns perfectly with Techbridge's mission: to cultivate a generation of sovereign industrial architects capable of building, owning, and exporting technology rooted in Ghanaian context.</p>
    </div>

    <div class="section">
      <h2>WHY TECHBRIDGE?</h2>
      <p>We bring three irreplaceable assets to this programme:</p>
      <ul>
        <li><strong>Operational Readiness</strong> — Techbridge's existing campus infrastructure, trained personnel, and active student cohort eliminate the need for a lengthy build phase. The programme can commence within eight weeks of partnership ratification.</li>
        <li><strong>Local Institutional Credibility</strong> — We are not a foreign vendor. We are a Ghanaian institution with deep understanding of local policy, regulatory landscape, employer ecosystems, and student demographics. Government engagement, institutional partnerships, and curriculum alignment flow through trusted local channels.</li>
        <li><strong>Industrial Alignment</strong> — Our specialised programmes (CAD/CAM for Jewellery, Digital Textile for Fashion, AI-native Product Design) directly address Ghana's sectoral export strategies, ensuring graduate employability and economic impact.</li>
      </ul>
    </div>

    <div class="section">
      <h2>THE SMARTBRIDGE PARTNERSHIP</h2>
      <p>We propose integrating SmartBridge Education Services' proven Skill Wallet platform — a global experiential learning ecosystem with 2+ million learners across 3,000+ institutions — with Techbridge's institutional infrastructure and regional reach.</p>

      <p>This is not a capacity-building exercise. It is a <strong>structural transformation</strong> of Ghana's technical workforce:</p>
      <ul>
        <li><strong>SmartBridge India</strong> provides the global AI-native learning platform, algorithmic curriculum engine, and international quality standards</li>
        <li><strong>SmartBridge Ghana</strong> manages in-country deployment and government liaison</li>
        <li><strong>Techbridge</strong> anchors the partnership with physical facilities, accredited programmes, and sovereign data stewardship</li>
      </ul>

      <p>The result: world-class technology delivered with absolute Ghanaian control.</p>
    </div>

    <div class="section">
      <h2>OUR COMMITMENT</h2>
      <p>As Head of Institution, I commit Techbridge to:</p>
      <ul>
        <li><span class="checkmark">✓</span> <strong>100% alignment</strong> with Ghana's digital and sectoral policy frameworks</li>
        <li><span class="checkmark">✓</span> <strong>Full transparency</strong> in programme delivery, student outcomes, and government reporting</li>
        <li><span class="checkmark">✓</span> <strong>Data sovereignty</strong> — all student PII, learning records, and assessment data remain in Ghana under Techbridge stewardship</li>
        <li><span class="checkmark">✓</span> <strong>Economic retention</strong> — 60% of technical service fees circulate within Ghana's domestic economy through local hiring and infrastructure investment</li>
        <li><span class="checkmark">✓</span> <strong>Measurable impact</strong> — real-time government dashboards tracking enrolment, competency growth, regional distribution, and employer outcomes</li>
      </ul>
    </div>

    <div class="section">
      <h2>NEXT STEPS</h2>
      <p>We invite the Ministry of Communications and Digitalization, Presidential Special Initiatives, Youth and Employment Agency, Ghana Digital Centre, and SmartBridge leadership to a technical synchronisation workshop to:</p>
      <ul>
        <li>Finalise the Sovereign Access Node deployment plan</li>
        <li>Initiate the SME Demand Mapping audit</li>
        <li>Align curriculum with Ministry vocational standards</li>
        <li>Establish governance and oversight structures</li>
      </ul>

      <p>We have prepared a comprehensive Alliance Brief detailing the strategic vision, delivery framework, economic impact projections, and implementation roadmap. This document is ready for your review and discussion.</p>
    </div>

    <div class="section">
      <h2>CLOSING</h2>
      <p>Ghana's digital transformation is not a capacity-building exercise—it is a structural statement about our nation's sovereignty and economic future. By partnering with Techbridge and SmartBridge, the Government of Ghana can demonstrate that the One Million Coders Programme builds Ghana, for Ghanaians, with absolute control over our digital future.</p>

      <p>We stand ready to commence Phase One immediately upon agreement.</p>
    </div>

    <div class="signature-section">
      <p>Yours in service to Ghana's digital future,</p>
      <div class="signature-name">Daniel Frempong Twum</div>
      <div class="signature-title">Head of ICT & Special Adviser to the Founder</div>
      <div class="signature-title">Techbridge University College</div>
      <div style="margin-top: 8px; font-size: 11px; color: #6b7280;">
        Tel: +233-302788895<br>
        Email: daniel.twum@techbridge.edu.gh
      </div>
    </div>

    <div class="cc-section">
      <strong>Cc:</strong><br>
      Ministry of Communications and Digitalization<br>
      Presidential Special Initiatives<br>
      Youth and Employment Agency<br>
      Ghana Digital Centre<br>
      SmartBridge Education Services (India & Ghana)
    </div>
  </div>
</body>
</html>`;
}

async function generateEmailHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Techbridge Introductory Email</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: white;
    }

    .document {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 25mm;
      background: white;
      position: relative;
    }

    .email-header {
      border-bottom: 2px solid #FCD116;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }

    .email-subject {
      font-weight: 600;
      font-size: 14px;
      color: #0f2545;
      margin-bottom: 4px;
    }

    .email-meta {
      font-size: 12px;
      color: #6b7280;
    }

    .email-body {
      font-size: 12px;
      line-height: 1.7;
    }

    .email-body p {
      margin-bottom: 12px;
    }

    strong {
      color: #0f2545;
      font-weight: 600;
    }

    h3 {
      font-size: 13px;
      font-weight: 600;
      color: #0f2545;
      margin: 16px 0 8px 0;
    }

    ul {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 6px;
    }

    .signature {
      margin-top: 20px;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      font-size: 11px;
    }

    .signature-name {
      font-weight: 600;
      color: #0f2545;
      margin-top: 8px;
    }

    .signature-contact {
      color: #6b7280;
      margin-top: 4px;
    }

    .ps-section {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }

    .ps-section strong {
      color: #0f2545;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .document { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="email-header">
      <div class="email-subject">Subject: Strategic Partnership Proposal — Ghana's One Million Coders Programme (Techbridge University College)</div>
      <div class="email-meta">To: [Minister/Director Name]</div>
    </div>

    <div class="email-body">
      <p>Dear <strong>[Minister/Director Name]</strong>,</p>

      <p>I write from Techbridge University College to introduce a strategic partnership opportunity for Ghana's One Million Coders Programme.</p>

      <p><strong>Techbridge</strong> is Ghana's leading technical institution (Oyibi, Greater Accra) with ~200 quality-focused students, four accredited industrial-aligned degree programmes, and proven delivery across Product Design, Fashion Technology, Jewellery Design, and Digital Media. We bring operational readiness, institutional credibility, and deep local policy alignment—plus campus infrastructure ready to scale.</p>

      <p><strong>SmartBridge</strong> brings a global AI-native learning platform (Skill Wallet) proven across 3,000+ institutions and 2+ million learners worldwide.</p>

      <p>Together, we propose a <strong>three-entity alliance:</strong></p>
      <ul>
        <li>SmartBridge India provides the global technology platform</li>
        <li>SmartBridge Ghana manages in-country implementation</li>
        <li>Techbridge provides campus infrastructure, accredited programmes, and sovereign data stewardship</li>
      </ul>

      <p><strong>The outcome:</strong> World-class digital skills training for Ghana's one million young people, with 100% Ghanaian control, measurable employment outcomes, and 60% economic retention within Ghana's domestic economy.</p>

      <p><strong>Programme can launch within 8 weeks</strong> of partnership ratification, using Techbridge's existing infrastructure and personnel—no build phase required.</p>

      <p>I invite you to a technical synchronisation workshop to discuss the strategic vision, deployment roadmap, and governance structures. I have attached:</p>
      <ol style="margin-left: 20px;">
        <li><strong>SmartGhana Interactive Proposal</strong> (digital presentation)</li>
        <li><strong>Alliance Brief PDF</strong> (formal 3-page document)</li>
        <li><strong>Implementation Roadmap</strong> (5-phase, 32-week deployment)</li>
      </ol>

      <p><strong>Next steps:</strong> Please let me know your availability for a meeting in <strong>May/June 2026</strong> to discuss how Techbridge, SmartBridge, and the Government of Ghana can jointly transform digital workforce readiness.</p>

      <p>I look forward to partnering to build Ghana's digital future.</p>

      <div class="signature">
        <p>Best regards,</p>
        <div class="signature-name">Daniel Frempong Twum</div>
        <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">Head of ICT & Special Adviser to the Founder</div>
        <div style="font-size: 11px; color: #6b7280;">Techbridge University College</div>
        <div class="signature-contact">
          📧 daniel.twum@techbridge.edu.gh<br>
          📱 +233-302788895<br>
          🌐 www.techbridge.edu.gh<br>
          🏢 Oyibi, Greater Accra, Ghana
        </div>
      </div>

      <div class="ps-section">
        <p><strong>P.S.</strong> — This proposal aligns directly with:</p>
        <ul>
          <li>Ghana's National Digital Transformation Strategy</li>
          <li>The Ministry of Education's digital literacy targets</li>
          <li>The Ministry of Trade's sectoral export development agenda</li>
          <li>The Youth and Employment Agency's workforce readiness mandate</li>
        </ul>
        <p>We are ready to commence immediately upon government approval.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  try {
    // Create documents directory
    const docsDir = join(process.cwd(), 'public', 'documents');
    mkdirSync(docsDir, { recursive: true });
    console.log('✓ Documents directory ensured at', docsDir);

    // Launch Playwright
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport to A4
    await page.setViewportSize({ width: 794, height: 1123 });

    // Generate Introductory Letter PDF
    console.log('Generating Introductory Letter PDF...');
    const letterHTML = await generateLetterHTML();
    await page.setContent(letterHTML, { waitUntil: 'networkidle' });
    await page.pdf({
      path: join(docsDir, 'Techbridge-Intro-Letter.pdf'),
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log('✓ Introductory Letter PDF generated');

    // Generate Introductory Email PDF
    console.log('Generating Introductory Email PDF...');
    const emailHTML = await generateEmailHTML();
    await page.setContent(emailHTML, { waitUntil: 'networkidle' });
    await page.pdf({
      path: join(docsDir, 'Techbridge-Intro-Email.pdf'),
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log('✓ Introductory Email PDF generated');

    // Cleanup
    await browser.close();

    console.log('\n✅ PDF generation complete!');
    console.log(`Documents saved to: ${docsDir}`);
    console.log('  - Techbridge-Intro-Letter.pdf');
    console.log('  - Techbridge-Intro-Email.pdf');
  } catch (error) {
    console.error('❌ Error generating PDFs:', error);
    process.exit(1);
  }
}

main();
