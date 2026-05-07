import { useEffect } from 'react';

const TECHBRIDGE_LOGO = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';

const today = new Date();
const BRIEF_DATE = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function ConfidentialFooter() {
  return (
    <div className="brief-footer">
      <div className="brief-footer-inner">
        <span>Confidential</span>
        <span className="brief-footer-dot">✦</span>
        <span>Techbridge University College × SmartBridge (India & Ghana)</span>
        <span className="brief-footer-dot">✦</span>
        <span>TUC-ICT-PROP-2026-002</span>
      </div>
    </div>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="brief-section-header">
      <span className="brief-section-number">{number}.</span>
      <span className="brief-section-title">{title}</span>
    </div>
  );
}

function BulletItem({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="brief-bullet">
      <span className="brief-bullet-mark">■</span>
      <p className="brief-bullet-text">
        {label && <strong>{label}:</strong>}{' '}{children}
      </p>
    </div>
  );
}

export default function AllianceBrief() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === '1') {
      setTimeout(() => window.print(), 800);
    }
  }, []);

  return (
    <div className="brief-document" id="alliance-brief">

      {/* ── PAGE 1 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Letterhead */}
        <header className="brief-letterhead">
          <div className="brief-letterhead-left">
            <img
              src={TECHBRIDGE_LOGO}
              alt="Techbridge University College"
              className="brief-logo"
              referrerPolicy="no-referrer"
            />
            <div className="brief-institution">
              <div className="brief-institution-name">Techbridge University College</div>
              <div className="brief-institution-sub">Oyibi, Greater Accra, Ghana</div>
              <div className="brief-institution-sub">daniel.twum@techbridge.edu.gh</div>
            </div>
          </div>
          <div className="brief-letterhead-right">
            <div className="brief-document-type">PROPOSAL BRIEF</div>
          </div>
        </header>

        <div className="brief-rule-gold" />

        {/* Header Block */}
        <table className="brief-header-block">
          <tbody>
            <tr>
              <td className="brief-header-label">To:</td>
              <td className="brief-header-value">The Executive Boards, SmartBridge India & SmartBridge Ghana</td>
            </tr>
            <tr>
              <td className="brief-header-label">From:</td>
              <td className="brief-header-value">Techbridge University College, ICT Division</td>
            </tr>
            <tr>
              <td className="brief-header-label">Date:</td>
              <td className="brief-header-value">{BRIEF_DATE}</td>
            </tr>
            <tr>
              <td className="brief-header-label">Reference:</td>
              <td className="brief-header-value">TUC-ICT-PROP-2026-002</td>
            </tr>
            <tr>
              <td className="brief-header-label">Subject:</td>
              <td className="brief-header-value brief-header-subject">
                Sovereign Deployment Framework for Ghana's One Million Coders Programme
              </td>
            </tr>
          </tbody>
        </table>

        <div className="brief-rule-light" />

        {/* Section 1 */}
        <section className="brief-section">
          <SectionHeader number={1} title="STRATEGIC VISION" />
          <p className="brief-body">
            Techbridge University College proposes a structured alliance with SmartBridge — delivered
            through SmartBridge Educational Services Ltd. (Ghana), under the strategic direction of
            SmartBridge Education Services Pvt. Ltd. (India) — to serve as the unified technical
            and operational partner for the One Million Coders Programme in Ghana. This proposal sets
            out the framework, delivery model, and projected outcomes of a three-entity collaboration
            designed to transform the initiative from a generic skills-delivery exercise into a
            nationally-aligned programme of industrial and digital capacity building.
          </p>
          <p className="brief-body">
            SmartBridge India provides the Skill Wallet platform — a proven experiential learning
            ecosystem that has trained 2 million+ learners across 3,000+ institutions globally over
            more than a decade. SmartBridge Ghana, headquartered in Accra, manages in-country
            deployment and government liaison. Techbridge University College provides the institutional
            anchor: established local infrastructure, validated delivery experience, active operational
            capacity of 15,000+ enrolled students, and proven alignment with national digital policy.
          </p>
          <p className="brief-body">
            This alliance moves beyond the standard SaaS procurement model. By combining SmartBridge's
            Skill Wallet platform and global experiential learning methodology with Techbridge's
            institutional infrastructure and regional reach, the partnership creates a delivery model
            that is simultaneously world-class in technical capability and sovereign in its operation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="brief-section">
          <SectionHeader number={2} title="THE 6R DELIVERY FRAMEWORK" />
          <p className="brief-body">
            We propose the 6R Strategic Delivery Framework as the operational structure for the
            alliance. Each stage represents a distinct phase of programme development, with clear
            ownership and measurable outcomes:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Review — Demand Mapping">
              A structured audit of over 1,000 local SMEs and government agencies to identify
              the precise AI-native and vocational competencies required across Ghana's
              growth sectors, ensuring the programme responds to genuine market demand.
            </BulletItem>
            <BulletItem label="Reduce — Curriculum Pruning">
              Removal of legacy theoretical content and proprietary software dependencies
              from existing curricula, replaced with AI-augmented, open-source pathways
              that reduce the barrier to technical mastery by an estimated 45 per cent.
            </BulletItem>
            <BulletItem label="Refine — Vertical Specialisation">
              Integration of Techbridge's CAD/CAM and Digital Twin capabilities into
              specialised coding tracks aligned with the Jewellery, Fashion, and Product
              Design sectors — Ghana's highest-value industrial export categories.
            </BulletItem>
            <BulletItem label="Reuse — Node Activation">
              Deployment of Techbridge's Oyibi campus as the primary Sovereign Access Node,
              providing high-bandwidth infrastructure and GPU rendering capacity for the
              One Million Coders Programme in Greater Accra and surrounding regions.
            </BulletItem>
            <BulletItem label="Regenerate — IP Genesis">
              Establishment of joint Sovereign Tooling Laboratories in which students
              design and build the enterprise software and industrial tools used within
              their own sectors — creating a domestic IP ownership tier.
            </BulletItem>
            <BulletItem label="Reinforce — Policy Alignment">
              Integration of real-time Ministry monitoring dashboards to enable automated
              certification alignment with Ghana's national vocational standards framework,
              providing government with direct programme oversight.
            </BulletItem>
          </div>
        </section>

        <ConfidentialFooter />
      </div>

      {/* ── PAGE 2 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Section 3 */}
        <section className="brief-section">
          <SectionHeader number={3} title="PROGRAMME DELIVERY AND OPERATIONAL SYNERGY" />
          <p className="brief-body">
            The alliance will operate under a Sovereign Execution Model structured across three
            complementary entities. SmartBridge India provides the Skill Wallet platform, global
            curriculum engine, and AI-native tutoring systems (Kibo bots for knowledge support).
            SmartBridge Ghana manages in-country implementation, government liaison, and regulatory
            alignment. Techbridge provides physical campus infrastructure, accredited degree programmes,
            and sovereign data stewardship under Ghana Data Protection Act compliance. This tripartite
            structure is aligned around four core operational principles:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Joint Curriculum Engineering">
              SmartBridge's global algorithmic learning engine will be merged with
              Techbridge's industrial design frameworks, producing a curriculum that
              is technically rigorous and contextually relevant to Ghana's economic
              priorities. Content development will be jointly owned and locally hosted.
            </BulletItem>
            <BulletItem label="Physical Infrastructure Utilisation">
              Techbridge's campuses will serve as hands-on industrial laboratories,
              providing equipment-based learning that complements the digital delivery
              platform. This is particularly critical for the Jewellery Design, Fashion
              Technology, and Product Engineering tracks, where physical tools and
              materials cannot be replicated digitally.
            </BulletItem>
            <BulletItem label="Data Sovereignty and Compliance">
              All student records, learning pathways, and assessment data for the
              programme's one million participants will be stored and managed within
              Ghanaian jurisdiction, in full compliance with the Ghana Data Protection
              Act. Techbridge will serve as the designated Local Data Steward under
              the alliance agreement.
            </BulletItem>
            <BulletItem label="National Policy Synchronisation">
              Every programme KPI will be aligned with the Ministry of Trade's strategy
              for sectoral export development and the Ministry of Education's digital
              literacy targets, ensuring government accountability and a clear pathway
              to programme sustainability beyond the initial funding period.
            </BulletItem>
          </div>
        </section>

        {/* Section 4 */}
        <section className="brief-section">
          <SectionHeader number={4} title="THE FOUR SPECIALIST DEGREE PROGRAMMES" />
          <p className="brief-body">
            Techbridge contributes four active, accredited degree programmes to the alliance,
            each engineered for Ghana's emerging digital sectors. These programmes are currently
            operational at the Oyibi campus and provide the industrial backbone for the
            specialised coding tracks:
          </p>
          <div className="brief-bullets">
            <BulletItem label="Product Design and Entrepreneurship">
              Integrating UI/UX design methodology with AI-native product development
              workflows and Ghanaian market commercialisation strategies. Graduates are
              equipped to launch and scale digital products within the domestic SME sector.
            </BulletItem>
            <BulletItem label="Fashion Design Technology">
              Combining digital textile engineering, 3D garment visualisation, and smart
              supply chain technology into a creative technologist's curriculum. West
              Africa's fashion sector is projected to generate 120,000 new artisanal
              roles by 2030; this programme prepares graduates to lead that transition.
            </BulletItem>
            <BulletItem label="Jewellery Design Technology">
              Applying high-precision CAD/CAM modelling and generative design tools to
              Ghana's gold and artisan sector. The programme creates a structured pathway
              from traditional craft to export-grade industrial production, supporting
              an estimated $450 million export potential.
            </BulletItem>
            <BulletItem label="Digital Media and Communications Design">
              Equipping graduates with AI-driven storytelling, generative video production,
              and brand architecture skills for the West African media and advertising
              market. The programme draws on Techbridge's existing partnerships with
              Ghanaian broadcasters and digital agencies.
            </BulletItem>
          </div>
          <p className="brief-body brief-body-note">
            Each programme is structured as a four-year degree with built-in industry placements
            and live project briefs drawn from Ghanaian enterprises. All four are eligible
            for direct alignment with the One Million Coders Programme certification framework.
          </p>
        </section>

        <ConfidentialFooter />
      </div>

      {/* ── PAGE 3 ─────────────────────────────────── */}
      <div className="brief-page">

        {/* Section 5 */}
        <section className="brief-section">
          <SectionHeader number={5} title="ECONOMIC IMPACT AND PROJECTIONS" />
          <p className="brief-body">
            The alliance model creates measurable economic value at three levels — national,
            sectoral, and operational — each of which is supported by independently modelled
            projections:
          </p>

          <div className="brief-metric-grid">
            <div className="brief-metric-card">
              <div className="brief-metric-label">National Digital GVA</div>
              <div className="brief-metric-value">$0.8B → $7.0B</div>
              <div className="brief-metric-desc">
                Projected growth in Ghana's digital Gross Value Added from 2024 to 2030,
                positioning Ghana as the continental benchmark for technical-vocational
                sovereignty.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Import Substitution</div>
              <div className="brief-metric-value">42% reduction</div>
              <div className="brief-metric-desc">
                Projected reduction in foreign software procurement dependency over five
                years, generating an estimated saving of $800 million for the Ghanaian
                economy.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Local Economic Retention</div>
              <div className="brief-metric-value">60% of fees</div>
              <div className="brief-metric-desc">
                Proportion of programme service fees retained within Ghana's domestic
                economy through local hiring, infrastructure investment, and tax
                contributions — versus near-total capital flight under direct
                international procurement.
              </div>
            </div>
            <div className="brief-metric-card">
              <div className="brief-metric-label">Alliance Cost Efficiency</div>
              <div className="brief-metric-value">GHS 455M vs GHS 840M</div>
              <div className="brief-metric-desc">
                Estimated 45 per cent cost reduction against equivalent direct
                international procurement, whilst maintaining full technical capability
                and programme scope.
              </div>
            </div>
          </div>

          <p className="brief-body">
            The full Economic Impact Model, including year-by-year GVA trajectory, sectoral
            contribution breakdown, and workforce absorption projections, is available in
            the accompanying digital presentation at the reference above.
          </p>
        </section>

        {/* Section 6 */}
        <section className="brief-section">
          <SectionHeader number={6} title="CONCLUSION AND CALL TO ACTION" />
          <p className="brief-body">
            Techbridge University College is prepared to begin deployment immediately. Our
            existing infrastructure, trained personnel, and active student cohort provide
            a platform that requires no build phase — only integration with the SmartBridge
            delivery engine. The full programme can be operational within eight weeks of
            alliance ratification.
          </p>
          <p className="brief-body">
            We propose an immediate technical synchronisation workshop to finalise the
            Sovereign Access Node deployment plan and initiate the SME Demand Mapping audit.
            Following workshop agreement, joint curriculum engineering can commence within
            the first fortnight.
          </p>
          <p className="brief-body">
            This is not a capacity-building exercise in the conventional sense. It is a
            structural transformation of Ghana's technical workforce — with sovereignty,
            accountability, and long-term export capability built into the architecture
            from the outset. The distinction between a domestic alliance and a direct
            international procurement is the distinction between a programme that builds
            Ghana and one that merely operates within it.
          </p>
          <p className="brief-body">
            We invite the SmartBridge Executive Board to ratify this alliance and authorise
            commencement of Phase One.
          </p>
        </section>

        <div className="brief-rule-light brief-rule-wide" />

        {/* Authorisation Block */}
        <div className="brief-auth">
          <p className="brief-auth-label">Authorised by:</p>
          <p className="brief-auth-name">Daniel Frempong Twum</p>
          <p className="brief-auth-title">Head of ICT &amp; Special Adviser to the Founder</p>
          <p className="brief-auth-title">Techbridge University College, Oyibi, Greater Accra, Ghana</p>
          <p className="brief-auth-coordination">
            In co-ordination with the Ministry of Trade and Industry, Ghana
          </p>
        </div>

        <ConfidentialFooter />
      </div>

    </div>
  );
}
