import { useEffect } from 'react'
import { CheckCircle, Printer } from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────────────── */
function GhanaStripe() {
  return (
    <div className="flex h-2">
      <div className="flex-1 bg-ghana-red" />
      <div className="flex-1 bg-ghana-gold" />
      <div className="flex-1 bg-ghana-green" />
    </div>
  )
}

function PageFooter({ page, total }: { page: number; total: number }) {
  return (
    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
      <span>Techbridge Education Services Ghana — Confidential</span>
      <span>One Million Coders Programme Proposal</span>
      <span>Page {page} of {total}</span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-0.5 bg-ghana-gold" />
      <span className="text-xs font-bold uppercase tracking-widest text-ghana-gold">{children}</span>
    </div>
  )
}

const TOTAL = 8

/* ─── component ──────────────────────────────────────────────── */
export default function ExecutiveSummaryPage() {
  useEffect(() => {
    document.title = 'Techbridge — Executive Summary'
    return () => { document.title = 'Techbridge — Ghana\'s One Million Coders Partner' }
  }, [])

  return (
    <div className="exec-doc font-sans bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:py-0">

      {/* ── Print Button (hidden in print) ──────────────────────── */}
      <div className="fixed top-24 right-6 z-50 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-techbridge-navy text-white px-5 py-3 rounded-xl shadow-xl font-semibold text-sm hover:bg-techbridge-blue transition-colors"
        >
          <Printer size={16} /> Download PDF
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 1 — COVER
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-techbridge-navy mx-auto mb-8 print:mb-0 relative overflow-hidden"
        style={{ width: '210mm', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>

        <GhanaStripe />

        {/* watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #FCD116 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, #006B3F 0%, transparent 50%)' }} />

        <div className="relative flex flex-col flex-1 p-14">
          {/* Logo block */}
          <div className="mb-16">
            <div className="font-serif text-4xl font-bold text-white tracking-tight mb-1">Techbridge</div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ghana-gold/80">Education Services Ghana</div>
          </div>

          {/* Main title */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-16 h-1 bg-ghana-gold mb-8" />
            <p className="text-ghana-gold/80 text-sm font-semibold uppercase tracking-widest mb-4">
              Official Proposal
            </p>
            <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-6">
              One Million Coders<br />
              <span className="text-techbridge-gold">Programme</span>
            </h1>
            <h2 className="text-xl text-blue-200 font-light leading-relaxed max-w-md">
              National Digital Skills Development Initiative —<br />
              Proposal for Programme Delivery Partnership
            </h2>
          </div>

          {/* Submission block */}
          <div className="border-t border-white/20 pt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Submitted to</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Ministry of Communications &amp; Digitalization<br />
                Presidential Special Initiatives Office<br />
                Youth &amp; Employment Agency, Ghana<br />
                Ghana Digital Centre
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Submitted by</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Techbridge Education Services Ghana<br />
                Techbridge University College<br />
                Oyibi, Greater Accra, Ghana<br />
                <span className="text-ghana-gold">government@techbridge.edu.gh</span>
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Date</p>
              <p className="text-white/90 text-sm">May 2026</p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Reference</p>
              <p className="text-white/90 text-sm">TUC-ICT-PROP-2026-001</p>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <GhanaStripe />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 2 — EXECUTIVE SUMMARY
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-ghana-gold" />
          <h2 className="font-serif text-3xl font-bold text-techbridge-navy">Executive Summary</h2>
        </div>

        <SectionLabel>Section 1</SectionLabel>

        <p className="text-gray-700 leading-relaxed mb-5 text-sm">
          Techbridge Education Services Ghana is the only Ghanaian-led, currently operational
          technology education platform with the institutional partnerships, infrastructure, and
          curriculum required to deliver the Government of Ghana's One Million Coders Programme
          at national scale. We are ready to onboard the first cohort within <strong>8 weeks</strong> of
          contract signing.
        </p>
        <p className="text-gray-700 leading-relaxed mb-5 text-sm">
          This proposal presents Techbridge's comprehensive plan to implement the One Million
          Coders Programme across Ghana's 50+ partner institutions — delivering experiential,
          project-based learning in Artificial Intelligence, Cloud Computing, Data Science, and
          Software Development — leading to verifiable Skill Wallet credentials and direct
          placement into Ghana's growing technology sector.
        </p>
        <p className="text-gray-700 leading-relaxed mb-10 text-sm">
          Unlike competing proposals from international vendors, Techbridge operates inside
          Ghana today. Our data remains in Ghana, our staff are Ghanaian, our profits recirculate
          into the Ghanaian economy, and our leadership is directly accountable to Ghanaian
          institutions — not a foreign board of directors.
        </p>

        {/* Key Numbers */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { n: '5+', l: 'Years Operating in Ghana', s: 'Founded 2019' },
            { n: '50+', l: 'Partner Institutions', s: 'Across all regions' },
            { n: '15,000+', l: 'Active Learners', s: 'On platform today' },
            { n: '8 Wks', l: 'To Full Deployment', s: 'From contract signing' },
          ].map(item => (
            <div key={item.l} className="rounded-xl bg-techbridge-light border border-techbridge-blue/10 p-4 text-center">
              <div className="font-serif text-3xl font-bold text-techbridge-navy mb-1">{item.n}</div>
              <div className="text-xs font-semibold text-techbridge-blue mb-0.5 leading-tight">{item.l}</div>
              <div className="text-xs text-gray-400">{item.s}</div>
            </div>
          ))}
        </div>

        {/* Three-point summary */}
        <div className="space-y-3 mb-10">
          {[
            ['Operational Platform', 'techbridge.edu.gh is live, serving 15,000+ students, with 98.5% uptime since 2020. No setup phase required.'],
            ['Ghanaian-Led & Accountable', 'Founded and managed in Ghana. Data sovereignty maintained. Profits reinvested locally. Leadership answerable to Ghanaian law.'],
            ['8-Week Deployment Timeline', 'International vendors require 6–12 months to configure, localise, and staff. Techbridge can scale the first 50,000 learners in 8 weeks.'],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50">
              <CheckCircle size={18} className="text-ghana-green shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-techbridge-navy text-sm">{title} — </span>
                <span className="text-gray-600 text-sm">{body}</span>
              </div>
            </div>
          ))}
        </div>

        <PageFooter page={2} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 3 — NATIONAL CONTEXT + ABOUT TECHBRIDGE
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 2 &amp; 3</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Background, National Context &amp; About Techbridge
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide border-b border-ghana-gold pb-2">National Context</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Ghana faces a structural digital skills gap at a pivotal moment. With a youth
              population exceeding 15 million and 46% of young people classified as
              underemployed, the One Million Coders Programme represents the Government's
              highest-impact economic intervention.
            </p>
            <div className="space-y-2">
              {[
                ['15M+', 'Youth population (ages 15–35)'],
                ['46%', 'Youth underemployment rate'],
                ['$4.2B', 'Ghana 2030 digital economy target'],
                ['$800M+', 'Annual foreign tech services spend'],
              ].map(([n, l]) => (
                <div key={l} className="flex gap-2 items-baseline">
                  <span className="font-bold text-techbridge-blue text-base w-16 shrink-0">{n}</span>
                  <span className="text-gray-500 text-xs">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide border-b border-ghana-gold pb-2">About Techbridge</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Techbridge Education Services Ghana is a Ghanaian-founded technology education
              company established in 2019. We operate Techbridge University College (TUC) in
              Oyibi, Greater Accra, and a national network of partner institutions.
            </p>
            <div className="space-y-2">
              {[
                'Founded 2019 — Ghanaian-owned and operated',
                'Physical campus at Oyibi, Greater Accra',
                'Accredited by the National Accreditation Board',
                'Technology Education & Workforce Development mandate',
                'Active MoUs with 50+ tertiary institutions nationally',
              ].map(item => (
                <div key={item} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-ghana-green mt-1.5 shrink-0" />
                  <span className="text-gray-600 text-xs leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* National Opportunity */}
        <div className="bg-techbridge-navy rounded-xl p-6 mb-4">
          <h3 className="font-serif text-lg font-bold text-white mb-4">
            The National Opportunity (Section 7)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              ['Employment Creation', 'Every 100 coders trained creates ~40 indirect jobs in the Ghanaian economy through supply chain and demand effects.'],
              ['Export Revenue', "Ghana's tech services export market could reach $1.2B annually by 2030 with a trained domestic workforce pipeline."],
              ['Import Substitution', 'Ghana currently spends $800M+ on foreign tech services annually. Domestic skills retain this spend inside Ghana.'],
            ].map(([t, b]) => (
              <div key={t} className="border-l-2 border-ghana-gold pl-3">
                <div className="text-ghana-gold font-semibold text-xs mb-1">{t}</div>
                <div className="text-blue-200 text-xs leading-relaxed">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={3} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 4 — CREDENTIALS, TRACK RECORD & PARTNERSHIPS
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 4 &amp; 5</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Credentials, Track Record &amp; Technology Partnerships
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { n: '5+', l: 'Years operational', s: 'Since 2019' },
            { n: '15,000+', l: 'Students trained', s: 'Active platform users' },
            { n: '50+', l: 'Partner institutions', s: 'Universities, TVETs, polytechnics' },
            { n: '2,400+', l: 'Internships facilitated', s: 'Industry placements' },
            { n: '98.5%', l: 'Platform uptime', s: 'Since 2020 launch' },
            { n: '8 Regions', l: 'National coverage', s: 'All major regions' },
          ].map(item => (
            <div key={item.l} className="rounded-lg bg-techbridge-light border border-gray-200 p-4">
              <div className="font-serif text-2xl font-bold text-techbridge-navy mb-1">{item.n}</div>
              <div className="text-xs font-semibold text-techbridge-blue leading-tight mb-0.5">{item.l}</div>
              <div className="text-xs text-gray-400">{item.s}</div>
            </div>
          ))}
        </div>

        {/* Tech Partnerships */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Global Technology Ecosystem Partnerships</h3>
          <div className="flex flex-wrap gap-2">
            {['Google Cloud', 'GitHub / Microsoft', 'Amazon Web Services', 'MongoDB', 'HubSpot Academy', 'IBM SkillsBuild', 'Cisco NetAcad'].map(p => (
              <span key={p} className="px-3 py-1.5 rounded-full bg-techbridge-navy text-white text-xs font-semibold">{p}</span>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
            Students learn and are assessed directly on industry-standard platforms, earning
            globally recognised certifications alongside Techbridge Skill Wallet credentials.
          </p>
        </div>

        {/* Timeline milestones */}
        <div>
          <h3 className="font-semibold text-techbridge-navy mb-4 text-sm uppercase tracking-wide">Key Milestones 2019–2026</h3>
          <div className="relative pl-6 border-l-2 border-techbridge-gold/30 space-y-4">
            {[
              ['2019', 'Techbridge founded in Accra; TUC campus opened; first technology curriculum launched'],
              ['2020', 'techbridge.edu.gh launched; first 1,000 learners enrolled; platform uptime at 98.5%+'],
              ['2022', '10,000 learners milestone; first cohort of 500 internship placements across Ghana'],
              ['2023', 'Google Cloud Campus Partner status awarded; AWS EdStart programme accepted'],
              ['2024', '50+ institutional MoUs signed; ai.techbridge.edu.gh AI platform launched'],
              ['2026', '15,000+ active learners; ready for national One Million Coders scale-up'],
            ].map(([year, event]) => (
              <div key={year} className="flex gap-3 items-start">
                <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-techbridge-gold mt-0.5" style={{ position: 'relative', left: '-1.5rem', flexShrink: 0 }}/>
                <span className="font-bold text-techbridge-blue text-xs w-10 shrink-0">{year}</span>
                <span className="text-gray-600 text-xs leading-relaxed">{event}</span>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={4} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 5 — WHY TECHBRIDGE (vs SmartBridge comparison)
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Competitive Position</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-2">
          Why Techbridge Over Foreign Vendors
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          The Government of Ghana has received proposals from international vendors including
          SmartBridge Education Services Ltd (India). The table below compares the critical
          programme delivery factors.
        </p>

        <div className="rounded-xl overflow-hidden border border-gray-200 mb-8 text-xs">
          <table className="w-full">
            <thead>
              <tr className="bg-techbridge-navy text-white">
                <th className="py-3 px-4 text-left font-semibold">Criteria</th>
                <th className="py-3 px-4 text-center font-semibold text-ghana-gold">Techbridge Ghana</th>
                <th className="py-3 px-4 text-center font-semibold text-red-300">SmartBridge India</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Headquarters', '🇬🇭 Accra, Ghana', '🇮🇳 Hyderabad, India'],
                ['Currently operational in Ghana', '✓ Active today', '✗ Not established'],
                ['Ghanaian learners on platform', '15,000+ verified', 'None — new market'],
                ['Deployment timeline', '8 weeks', '6–12 months (estimate)'],
                ['Time to first learner cohort', '8 weeks', '6+ months'],
                ['Data sovereignty', '✓ Ghana-hosted', '✗ Data leaves Ghana'],
                ['Local accountability', '✓ Ghanaian law', '✗ Indian corporate law'],
                ['Profits reinvested in Ghana', '✓ 100%', '✗ Repatriated to India'],
                ['Established institutional MoUs', '50+ signed', '0 in Ghana'],
                ['Ghana-specific content', '✓ Built in', '✗ Requires localisation'],
                ['Government reporting ready', '✓ Framework in place', '✗ To be configured'],
              ].map(([criteria, us, them], i) => (
                <tr key={criteria} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2.5 px-4 font-medium text-techbridge-navy">{criteria}</td>
                  <td className="py-2.5 px-4 text-center text-ghana-green font-semibold">{us}</td>
                  <td className="py-2.5 px-4 text-center text-gray-400">{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-ghana-green/10 border border-ghana-green/30 rounded-xl p-5">
          <p className="text-techbridge-navy text-sm font-semibold mb-1">
            The Sovereignty Argument
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every GHS spent on a foreign vendor for this programme leaves Ghana. Data about
            Ghanaian citizens sits on foreign servers under foreign law. A local partner is not
            merely preferable — it is a matter of national data sovereignty and economic
            self-determination.
          </p>
        </div>

        <PageFooter page={5} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 6 — PROGRAMME ARCHITECTURE & PLATFORM
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 6, 8–13</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Programme Architecture, Platform &amp; Skill Wallet
        </h2>

        {/* 4 Tracks */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">The 4 Core Technology Tracks</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { track: 'Artificial Intelligence & ML', tools: 'Python · TensorFlow · Hugging Face', colour: 'border-techbridge-blue' },
              { track: 'Cloud Computing', tools: 'Google Cloud · AWS · Azure', colour: 'border-ghana-green' },
              { track: 'Data Science & Analytics', tools: 'SQL · Power BI · Tableau · Python', colour: 'border-ghana-red' },
              { track: 'Software Development & DevOps', tools: 'GitHub · Docker · Kubernetes · CI/CD', colour: 'border-techbridge-gold' },
            ].map(item => (
              <div key={item.track} className={`rounded-lg border-l-4 ${item.colour} bg-techbridge-light p-3`}>
                <div className="font-semibold text-techbridge-navy text-xs mb-1">{item.track}</div>
                <div className="text-gray-400 text-xs">{item.tools}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Lifecycle */}
        <div className="mb-8">
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Experiential Learning Project Lifecycle (Section 13)</h3>
          <div className="flex items-start gap-0 overflow-hidden rounded-lg border border-gray-200">
            {[
              { n: '01', t: 'Enrolment', c: 'bg-techbridge-gold text-techbridge-navy' },
              { n: '02', t: 'Foundations', c: 'bg-techbridge-blue text-white' },
              { n: '03', t: 'Industry Sprint', c: 'bg-ghana-green text-white' },
              { n: '04', t: 'Assessment', c: 'bg-academic-amber text-white' },
              { n: '05', t: 'Placement', c: 'bg-ghana-red text-white' },
            ].map((phase, i) => (
              <div key={phase.n} className={`flex-1 ${phase.c} py-3 px-2 text-center ${i > 0 ? 'border-l border-white/30' : ''}`}>
                <div className="font-bold text-xs mb-0.5">{phase.n}</div>
                <div className="text-xs font-medium leading-tight">{phase.t}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              ['12–16 weeks', 'Per cohort duration'],
              ['4 intakes/year', 'National cadence'],
              ['Blended delivery', 'Online + on-campus labs'],
            ].map(([v, l]) => (
              <div key={l} className="text-center border border-gray-100 rounded-lg p-3">
                <div className="font-bold text-techbridge-navy text-sm">{v}</div>
                <div className="text-gray-400 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform + Skill Wallet */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-2 text-xs uppercase tracking-wide">Platform Architecture (Section 9–10, 14)</h3>
            <div className="space-y-2">
              {[
                ['techbridge.edu.gh', 'Main LMS — 15,000+ learners, 200+ courses'],
                ['ai-tools.techbridge.edu.gh', 'AI Tools Hub — 30+ productivity tools'],
                ['ai.techbridge.edu.gh', 'Adaptive AI Learning Platform'],
              ].map(([d, l]) => (
                <div key={d} className="p-2 rounded bg-techbridge-light border border-techbridge-blue/10">
                  <div className="font-mono text-xs font-bold text-techbridge-blue">{d}</div>
                  <div className="text-xs text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-2 text-xs uppercase tracking-wide">Skill Wallet (Section 9)</h3>
            <div className="border border-techbridge-gold/40 rounded-lg overflow-hidden">
              <div className="bg-techbridge-navy px-4 py-3">
                <div className="text-ghana-gold text-xs font-bold uppercase tracking-widest mb-1">Techbridge Skill Wallet</div>
                <div className="text-white text-sm font-semibold">Ama Korantema</div>
                <div className="text-white/50 text-xs">AI Track · Cohort 2025</div>
              </div>
              <div className="bg-white px-4 py-3 space-y-1.5">
                {['Blockchain-verified credentials', 'NQF-aligned certification', 'Employer-facing skills profile', 'AI internship matching'].map(f => (
                  <div key={f} className="flex gap-2 items-center">
                    <CheckCircle size={12} className="text-ghana-green shrink-0" />
                    <span className="text-xs text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PageFooter page={6} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 7 — IMPLEMENTATION ROADMAP
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Section 16</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Implementation Roadmap — 8 Weeks to First Cohort
        </h2>

        <div className="space-y-3 mb-8">
          {[
            { weeks: 'Week 1–2', phase: 'Contract & Governance', tasks: ['Partnership agreement signed', 'National Programme Director appointed', 'Steering committee established with MoCD, GYEEDA, Ghana Digital Centre'] },
            { weeks: 'Week 3–4', phase: 'Platform Configuration', tasks: ['Government branding applied to platform', 'Cohort intake 1 registration portal opened', 'LMS configured for 50,000-learner capacity'] },
            { weeks: 'Week 5–6', phase: 'Educator Onboarding', tasks: ['Facilitators trained at 30 institutions', 'Track-specific mentors confirmed from industry partners', 'Assessment framework submitted to accreditation board'] },
            { weeks: 'Week 7–8', phase: 'Launch & Enrolment', tasks: ['National launch event with government stakeholders', 'First 50,000 learners enrolled and active', 'Reporting dashboard live for Ministry access'] },
          ].map((row, i) => (
            <div key={row.weeks} className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="shrink-0 w-20 text-center">
                <div className="inline-block bg-techbridge-navy text-white text-xs font-bold px-3 py-1 rounded-full">{row.weeks}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-techbridge-navy text-sm mb-1.5">Phase {i + 1}: {row.phase}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {row.tasks.map(t => (
                    <div key={t} className="flex gap-1.5 items-start">
                      <CheckCircle size={11} className="text-ghana-green shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-xs">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scale timeline */}
        <div>
          <h3 className="font-semibold text-techbridge-navy mb-3 text-sm uppercase tracking-wide">Scale-Up to One Million Coders</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { year: 'Year 1', n: '50,000', sub: '30 institutions' },
              { year: 'Year 2', n: '150,000', sub: '50 institutions' },
              { year: 'Year 3', n: '300,000', sub: 'All accredited' },
              { year: 'Year 5', n: '1,000,000', sub: 'National milestone' },
            ].map((item, i) => (
              <div key={item.year} className={`rounded-xl p-4 text-center border-2 ${
                i === 3 ? 'border-ghana-gold bg-ghana-gold/10' : 'border-techbridge-blue/30 bg-techbridge-light'
              }`}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{item.year}</div>
                <div className="font-serif text-2xl font-bold text-techbridge-navy">{item.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <PageFooter page={7} total={TOTAL} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          PAGE 8 — GOVERNANCE, SUSTAINABILITY & NEXT STEPS
      ═══════════════════════════════════════════════════════════ */}
      <div className="exec-page bg-white mx-auto mb-8 print:mb-0 p-14 flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}>

        <SectionLabel>Sections 17–20</SectionLabel>

        <h2 className="font-serif text-2xl font-bold text-techbridge-navy mb-6">
          Governance, Sustainability &amp; Next Steps
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-xs uppercase tracking-wide border-b border-ghana-gold pb-2">Governance Framework (Section 17)</h3>
            <div className="space-y-2">
              {[
                ['National Programme Director', 'Techbridge senior appointment'],
                ['Government Liaison Officer', 'Joint Techbridge / MoCD appointment'],
                ['Regional Coordinators ×8', 'One per region, local hires'],
                ['Institutional Liaison Network', 'Representative at each partner university'],
                ['Independent Assessment Board', 'External assessors, NQF-aligned'],
                ['Ministerial Steering Committee', 'Quarterly oversight with MoCD'],
              ].map(([role, note]) => (
                <div key={role} className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-techbridge-gold mt-1.5 shrink-0" />
                  <div>
                    <span className="text-techbridge-navy text-xs font-semibold">{role}</span>
                    <span className="text-gray-400 text-xs"> — {note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-techbridge-navy mb-3 text-xs uppercase tracking-wide border-b border-ghana-gold pb-2">Sustainability (Section 18)</h3>
            <div className="space-y-3">
              {[
                { phase: 'Years 1–2', model: 'Government grant-funded; co-funded by employer partners via certification licensing fees' },
                { phase: 'Years 3–4', model: 'Self-sustaining through Skill Wallet credential revenue and corporate recruitment partnerships' },
                { phase: 'Year 5+', model: 'Fully commercially viable; government retains dashboard access and KPI reporting at zero additional cost' },
              ].map(item => (
                <div key={item.phase} className="border-l-2 border-techbridge-blue/30 pl-3">
                  <div className="font-semibold text-techbridge-blue text-xs mb-0.5">{item.phase}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{item.model}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-techbridge-navy rounded-xl p-6 mb-6">
          <h3 className="font-serif text-lg font-bold text-white mb-4">Next Steps — Three Asks from Government (Section 20)</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: '01', ask: 'Schedule Ministerial Briefing', detail: 'A 60-minute formal presentation for the Ministry of Communications & Digitalization and Presidential Special Initiatives' },
              { n: '02', ask: 'Issue Letter of Intent', detail: 'A non-binding Letter of Intent to partner allows Techbridge to begin institutional pre-enrolment with 30 universities' },
              { n: '03', ask: 'Commence Contract Negotiation', detail: 'Formal partnership agreement with defined KPIs, reporting structure, and 8-week deployment commencement date' },
            ].map(item => (
              <div key={item.n} className="border border-white/20 rounded-lg p-4">
                <div className="w-7 h-7 rounded-full bg-ghana-gold flex items-center justify-center text-techbridge-navy font-bold text-xs mb-2">{item.n}</div>
                <div className="text-ghana-gold font-semibold text-xs mb-1">{item.ask}</div>
                <div className="text-blue-200 text-xs leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="border border-gray-200 rounded-xl p-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-techbridge-navy mb-1">Government Partnerships Team</div>
            <div className="text-gray-500 text-xs leading-relaxed">
              Techbridge Education Services Ghana<br />
              Techbridge University College, Oyibi, Greater Accra
            </div>
          </div>
          <div className="text-xs text-gray-500 leading-relaxed">
            <div><strong className="text-techbridge-navy">Email:</strong> government@techbridge.edu.gh</div>
            <div><strong className="text-techbridge-navy">Platform:</strong> techbridge.edu.gh</div>
            <div><strong className="text-techbridge-navy">Reference:</strong> TUC-ICT-PROP-2026-001</div>
          </div>
        </div>

        <PageFooter page={8} total={TOTAL} />
      </div>

    </div>
  )
}
