import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart2,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Monitor,
  FileText,
  PhoneCall,
  DollarSign,
  UserCheck,
  MapPin,
  Briefcase,
  Headphones,
  Server,
  Activity,
  Star,
} from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' as const },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const phases = [
  {
    weeks: 'Weeks 1–2',
    label: 'Assessment & Alignment',
    color: 'bg-techbridge-blue',
    border: 'border-techbridge-blue',
    text: 'text-techbridge-blue',
    items: [
      'Government kickoff meeting',
      'Institutional onboarding audit (identify first 30 universities)',
      'Programme customisation workshop',
      'Platform configuration for Ghana national branding',
    ],
  },
  {
    weeks: 'Weeks 3–4',
    label: 'Onboarding & Training',
    color: 'bg-ghana-green',
    border: 'border-ghana-green',
    text: 'text-ghana-green',
    items: [
      'University administrator training (2 days per institution)',
      'Lecturer/educator orientation on platform tools',
      'Student registration portal activation',
      'First cohort enrollment begins',
    ],
  },
  {
    weeks: 'Weeks 5–6',
    label: 'Launch & Activation',
    color: 'bg-ghana-gold',
    border: 'border-ghana-gold',
    text: 'text-yellow-600',
    items: [
      'First courses go live across all enrolled institutions',
      'Real-time monitoring dashboard activated for government oversight',
      'Industry partner integration (internship pipeline opens)',
      'First student cohorts begin programme tracks',
    ],
  },
  {
    weeks: 'Weeks 7–8',
    label: 'Monitor & Scale',
    color: 'bg-ghana-red',
    border: 'border-ghana-red',
    text: 'text-ghana-red',
    items: [
      'Full programme running at initial institutions',
      'Performance data flowing to government dashboard',
      'Expansion plan for additional institutions confirmed',
      'First progress report to Ministry',
    ],
  },
]

const techbridgeTimeline = [
  { label: 'Week 1', detail: 'Kickoff & Assessment' },
  { label: 'Week 2', detail: 'Institutional Audit' },
  { label: 'Week 3', detail: 'Admin Training Begins' },
  { label: 'Week 4', detail: 'Enrollment Opens' },
  { label: 'Week 5', detail: 'Courses Go Live' },
  { label: 'Week 6', detail: 'Dashboard Active' },
  { label: 'Week 7', detail: 'Full Programme Running' },
  { label: 'Week 8', detail: 'Operational' },
]

const smartbridgeTimeline = [
  { label: 'Month 1–2', detail: 'Needs Ghana-specific setup' },
  { label: 'Month 3–4', detail: 'Platform build phase' },
  { label: 'Month 5–6', detail: 'Internal testing' },
  { label: 'Month 7+', detail: 'Maybe operational?' },
]

const governanceItems = [
  {
    icon: Monitor,
    title: 'Real-Time Dashboard Access',
    body: 'Ministry officials receive live access to programme dashboards showing enrollment numbers, course completions, and learner progress at any time.',
  },
  {
    icon: FileText,
    title: 'Monthly Impact Reports',
    body: 'Structured monthly reports covering students enrolled, course completion rates, and verified employment outcomes delivered directly to the Ministry.',
  },
  {
    icon: Users,
    title: 'Quarterly In-Person Reviews',
    body: 'Senior Techbridge leadership meets with government counterparts every quarter to review performance, address concerns, and plan the next phase.',
  },
  {
    icon: PhoneCall,
    title: 'Direct Ghana-Based Management',
    body: 'A dedicated government relations manager based in Accra provides a single point of contact for all enquiries and escalations.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Financial Reporting',
    body: 'Full financial disclosure on all programme spending, with all expenditure denominated and processed in Ghana cedis within the Ghanaian banking system.',
  },
  {
    icon: Zap,
    title: '24-Hour Escalation SLA',
    body: 'Any issue escalated by the Ministry receives a formal response and resolution plan within 24 hours, with direct access to executive leadership.',
  },
]

const sustainabilityPhases = [
  {
    phase: 'Phase 1',
    years: 'Year 1–2',
    title: 'National Platform Deployment',
    students: '200,000 students',
    color: 'bg-techbridge-blue',
    border: 'border-techbridge-blue',
    details: [
      'Full platform deployed at 30+ universities',
      'Core curriculum tracks live and running',
      'Government oversight systems operational',
      '200,000 students enrolled across Ghana',
    ],
  },
  {
    phase: 'Phase 2',
    years: 'Year 3–4',
    title: 'Full Ecosystem Maturity',
    students: '600,000 students',
    color: 'bg-ghana-green',
    border: 'border-ghana-green',
    details: [
      'Employer integration fully operational',
      'Internship-to-employment pipeline active',
      'Expanded to all 16 regions of Ghana',
      '600,000 students enrolled and progressing',
    ],
  },
  {
    phase: 'Phase 3',
    years: 'Year 5+',
    title: 'One Million Coders Milestone',
    students: '1,000,000+ students',
    color: 'bg-ghana-red',
    border: 'border-ghana-red',
    details: [
      'One Million Coders target achieved',
      'Ghana recognised as West Africa\'s digital hub',
      'Regional export of the programme model',
      'Self-sustaining alumni network operational',
    ],
  },
]

const managementRoles = [
  {
    icon: UserCheck,
    role: 'National Programme Director',
    detail: 'Ghana-based executive with full accountability for programme delivery and government relationship management.',
  },
  {
    icon: MapPin,
    role: 'Regional Coordinators',
    detail: 'One coordinator per region, locally hired, responsible for university engagement and on-the-ground support.',
  },
  {
    icon: Briefcase,
    role: 'University Liaison Officers',
    detail: 'Dedicated officers embedded within partner universities to manage day-to-day operations and student support.',
  },
  {
    icon: Headphones,
    role: 'Technical Support Team',
    detail: 'Accra HQ-based team providing platform support, troubleshooting, and infrastructure management around the clock.',
  },
  {
    icon: PhoneCall,
    role: 'Government Relations Manager',
    detail: 'Single point of contact for all Ministry communications, reporting, and escalation protocols.',
  },
  {
    icon: Users,
    role: 'Industry Partnership Manager',
    detail: 'Manages relationships with employers, coordinates internship pipelines, and validates curriculum alignment with industry needs.',
  },
]

const riskCards = [
  {
    icon: Server,
    title: 'Platform Downtime Risk',
    risk: 'Service disruptions affecting student access and programme continuity.',
    mitigation: '98.5% uptime record across all platform operations. Redundant infrastructure with automatic failover ensures continuity even during peak enrollment periods.',
    color: 'border-techbridge-blue',
    iconBg: 'bg-techbridge-blue/10',
    iconColor: 'text-techbridge-blue',
  },
  {
    icon: Activity,
    title: 'Student Dropout Risk',
    risk: 'Learners disengaging before completing programme tracks.',
    mitigation: 'Early-warning analytics system identifies at-risk students within 72 hours of disengagement. Dedicated intervention coordinators follow up with personalised support.',
    color: 'border-ghana-green',
    iconBg: 'bg-ghana-green/10',
    iconColor: 'text-ghana-green',
  },
  {
    icon: Star,
    title: 'Quality Risk',
    risk: 'Curriculum or delivery falling below required standards.',
    mitigation: 'Continuous assessment at every module, peer review processes embedded in course design, and quarterly industry validation panels ensure standards remain high.',
    color: 'border-ghana-gold',
    iconBg: 'bg-ghana-gold/10',
    iconColor: 'text-yellow-600',
  },
  {
    icon: TrendingUp,
    title: 'Scale Risk',
    risk: 'Platform or operational capacity unable to meet programme growth.',
    mitigation: 'Already proven at 8,000+ concurrent users with zero degradation. Infrastructure is horizontally scalable to handle full One Million Coders load.',
    color: 'border-ghana-red',
    iconBg: 'bg-ghana-red/10',
    iconColor: 'text-ghana-red',
  },
]

export default function ImplementationPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-navy via-techbridge-blue/30 to-techbridge-navy opacity-90" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-4"
          >
            One Million Coders Programme — Implementation Plan
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            From Agreement to Action — in 8 Weeks.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-techbridge-light/80 max-w-2xl mx-auto leading-relaxed"
          >
            While others spend months planning, Techbridge is already operational. Here's exactly how we deliver.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-10 inline-flex items-center gap-3 bg-techbridge-gold/10 border border-techbridge-gold/40 rounded-full px-6 py-3"
          >
            <Clock className="w-5 h-5 text-techbridge-gold" />
            <span className="text-techbridge-gold font-semibold text-sm tracking-wide">8 weeks vs 6+ months — the difference that matters</span>
          </motion.div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The 8-Week Deployment Roadmap
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-16 max-w-xl mx-auto"
          >
            Four structured phases, each building on the last, from government agreement to full programme operation.
          </motion.p>

          <div className="hidden md:flex items-stretch gap-0 relative mb-6">
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 z-0" />
            {phases.map((phase, i) => (
              <motion.div
                key={phase.weeks}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={scaleIn}
                className="flex-1 relative z-10 px-3"
              >
                <div className={`w-6 h-6 rounded-full ${phase.color} mx-auto mb-4 ring-4 ring-white shadow-md`} />
                <div className={`bg-white rounded-2xl border-t-4 ${phase.border} shadow-lg p-6 h-full`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${phase.text} mb-1`}>{phase.weeks}</p>
                  <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-4 leading-snug">{phase.label}</h3>
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.weeks}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`bg-white rounded-2xl border-l-4 ${phase.border} shadow-lg p-6`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest ${phase.text} mb-1`}>{phase.weeks}</p>
                <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-4">{phase.label}</h3>
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                      <span className="text-academic-slate text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            The Competitor Timeline
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-2xl mx-auto"
          >
            By the time a foreign vendor is operational, Techbridge has already trained thousands of students.
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border-2 border-ghana-green/40 bg-ghana-green/5 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-ghana-green/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-ghana-green" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ghana-green">Techbridge</h3>
                  <p className="text-xs text-academic-slate">Ghana — Operational in 8 weeks</p>
                </div>
              </div>
              <div className="space-y-3">
                {techbridgeTimeline.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === techbridgeTimeline.length - 1 ? 'bg-ghana-green ring-2 ring-ghana-green ring-offset-2' : 'bg-techbridge-blue'}`}>
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-lg px-4 py-2.5 ${i === techbridgeTimeline.length - 1 ? 'bg-ghana-green text-white font-bold' : 'bg-white border border-slate-200'}`}>
                      <span className={`font-semibold text-sm ${i === techbridgeTimeline.length - 1 ? 'text-white' : 'text-techbridge-navy'}`}>{step.label}</span>
                      <span className={`mx-2 text-xs ${i === techbridgeTimeline.length - 1 ? 'text-white/80' : 'text-academic-slate'}`}>—</span>
                      <span className={`text-sm ${i === techbridgeTimeline.length - 1 ? 'text-white' : 'text-academic-slate'}`}>{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="rounded-2xl border-2 border-ghana-red/30 bg-white p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-ghana-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-ghana-red" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ghana-red">SmartBridge / Foreign Vendor</h3>
                  <p className="text-xs text-academic-slate">India / Overseas — No Ghana infrastructure</p>
                </div>
              </div>
              <div className="space-y-3">
                {smartbridgeTimeline.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-lg px-4 py-2.5 border ${i === smartbridgeTimeline.length - 1 ? 'border-ghana-red/40 bg-ghana-red/5' : 'border-slate-200 bg-slate-50'}`}>
                      <span className={`font-semibold text-sm ${i === smartbridgeTimeline.length - 1 ? 'text-ghana-red' : 'text-slate-600'}`}>{step.label}</span>
                      <span className="mx-2 text-xs text-slate-400">—</span>
                      <span className={`text-sm ${i === smartbridgeTimeline.length - 1 ? 'text-ghana-red font-medium' : 'text-slate-500'}`}>{step.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-ghana-red/8 border border-ghana-red/20 px-5 py-4">
                <p className="text-sm text-ghana-red font-semibold leading-snug">
                  At Month 7, a foreign vendor is still uncertain. Techbridge has already trained thousands of Ghanaian students.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Governance & Oversight
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            What the Government gets from day one — complete visibility and direct accountability.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governanceItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-techbridge-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-techbridge-blue" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-2">{item.title}</h3>
                  <p className="text-academic-slate text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Sustainability & Long-Term Vision
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Three phases from national deployment to Ghana becoming West Africa's digital hub.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sustainabilityPhases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={scaleIn}
                className={`rounded-2xl border-2 ${phase.border} bg-white shadow-lg overflow-hidden`}
              >
                <div className={`${phase.color} px-6 py-5`}>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{phase.years}</p>
                  <h3 className="font-serif text-xl font-bold text-white leading-snug">{phase.phase}: {phase.title}</h3>
                </div>
                <div className="px-6 py-6">
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-academic-slate" />
                      <span className="font-bold text-techbridge-navy text-sm">{phase.students}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {phase.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate text-sm leading-snug">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-techbridge-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Programme Management Structure
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Every role in this programme is Ghana-based. Every decision is made locally.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementRoles.map((role, i) => {
              const Icon = role.icon
              return (
                <motion.div
                  key={role.role}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-ghana-green" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-techbridge-navy mb-1">{role.role}</h3>
                    <p className="text-academic-slate text-sm leading-relaxed">{role.detail}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-techbridge-navy text-center mb-4"
          >
            Risk Mitigation
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Every identified risk has a proven response. No contingency is theoretical.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className={`rounded-2xl border-2 ${card.color} bg-white p-7 hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-3">{card.title}</h3>
                  <div className="mb-4 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-academic-slate mb-1">Identified Risk</p>
                    <p className="text-academic-slate text-sm leading-snug">{card.risk}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ghana-green mb-1">Our Response</p>
                    <p className="text-techbridge-navy text-sm leading-relaxed font-medium">{card.mitigation}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-techbridge-navy py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 bg-techbridge-gold/15 border border-techbridge-gold/30 rounded-full px-5 py-2 mb-8">
              <Shield className="w-4 h-4 text-techbridge-gold" />
              <span className="text-techbridge-gold font-semibold text-sm tracking-wide">The Ask</span>
            </div>
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Techbridge asks for the opportunity to deliver Ghana's digital future.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="text-techbridge-light/80 text-xl mb-12 leading-relaxed"
          >
            We are ready today.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-techbridge-gold text-techbridge-navy font-bold text-base px-9 py-4 rounded-full hover:bg-ghana-gold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Begin Partnership Discussions
            </Link>
            <Link
              to="/track-record"
              className="inline-flex items-center gap-3 bg-transparent border-2 border-white/30 text-white font-semibold text-base px-9 py-4 rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-200"
            >
              See Our Track Record
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
