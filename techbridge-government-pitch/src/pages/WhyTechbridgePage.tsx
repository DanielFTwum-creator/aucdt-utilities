import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Shield, Zap, Globe, TrendingUp, AlertTriangle } from 'lucide-react'

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

const comparisonRows = [
  {
    criterion: 'Local Ownership',
    techbridge: 'Ghanaian-founded',
    smartbridge: 'India-based',
    others: 'Foreign-based',
  },
  {
    criterion: 'Established Presence',
    techbridge: '5+ years in Ghana',
    smartbridge: 'New to Ghana',
    others: 'Minimal presence',
  },
  {
    criterion: 'Speed to Market',
    techbridge: '8 weeks',
    smartbridge: '6+ months',
    others: '6+ months',
  },
  {
    criterion: 'Platform Ready',
    techbridge: 'techbridge.edu.gh live now',
    smartbridge: 'New deployment required',
    others: 'New build required',
  },
  {
    criterion: 'Accountability',
    techbridge: 'Direct to Ghana Govt',
    smartbridge: 'Indirect via India',
    others: 'Indirect via HQ',
  },
  {
    criterion: 'Cost Structure',
    techbridge: 'Competitive, locally set',
    smartbridge: 'Higher fees',
    others: 'Premium pricing',
  },
  {
    criterion: 'Profit Retention',
    techbridge: 'Reinvested in Ghana',
    smartbridge: 'Repatriated to India',
    others: 'Sent abroad',
  },
  {
    criterion: 'Cultural Fit',
    techbridge: 'Ghanaian-designed programs',
    smartbridge: 'Generic global templates',
    others: 'Adapted foreign curriculum',
  },
]

const pillars = [
  {
    icon: Shield,
    title: 'Accountability & Governance',
    body: 'Decision-making sits in Accra, not Mumbai or London. Techbridge is directly accountable to the Ghana Government, its citizens, and the One Million Coders Programme beneficiaries — with no intermediary overseas board or foreign shareholder structure diluting that responsibility.',
  },
  {
    icon: Zap,
    title: 'Immediate Platform Availability',
    body: 'techbridge.edu.gh is operational today. There is no build phase, no protracted vendor onboarding, and no discovery sprint. The programme can begin enrolling learners within eight weeks of contract award — a timeline no foreign vendor can match.',
  },
  {
    icon: Globe,
    title: 'Deep Ghana Knowledge',
    body: 'More than five years of continuous operation in Ghana has given Techbridge an unmatched understanding of Ghana\'s tertiary institutions, student demographics, connectivity constraints, local languages, and the lived realities of Ghanaian learners.',
  },
  {
    icon: TrendingUp,
    title: 'Economic Impact',
    body: 'Every cedi paid to Techbridge stays in Ghana. Revenues fund Ghanaian salaries, Ghanaian infrastructure, and Ghanaian innovation. Contracting foreign vendors exports capital that should be building Ghana\'s own digital economy.',
  },
]

const foreignRisks = [
  'Deployment risk — 6+ months before a single learner is enrolled',
  'Accountability gap — disputes resolved in foreign jurisdictions',
  'Profit outflow — revenues leave Ghana permanently',
  'Cultural mismatch — generic curricula misaligned with Ghana\'s context',
  'No established Ghana presence — no local support infrastructure',
]

const techbridgeBenefits = [
  '8-week deployment guarantee — programme launches on schedule',
  'Direct local accountability — Ghanaian leadership, Ghanaian answers',
  'Profits stay in Ghana — reinvested into digital infrastructure',
  'Culturally aligned — built by Ghanaians, for Ghanaians',
  'Proven platform — techbridge.edu.gh already serving learners',
]

export default function WhyTechbridgePage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      <section className="relative bg-techbridge-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-2 flex">
            <div className="flex-1 bg-ghana-red" />
            <div className="flex-1 bg-ghana-gold" />
            <div className="flex-1 bg-ghana-green" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-techbridge-navy via-techbridge-blue/30 to-techbridge-navy opacity-80" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-4"
          >
            One Million Coders Programme — Ghana
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Why Techbridge?
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-techbridge-light/80 max-w-2xl mx-auto leading-relaxed"
          >
            The case for choosing Ghana's own digital skills partner over foreign vendors.
          </motion.p>
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
            The Comparison
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-12 max-w-xl mx-auto"
          >
            Measured across eight critical criteria, Techbridge leads in every category.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="overflow-x-auto rounded-2xl shadow-xl border border-slate-200"
          >
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-techbridge-navy text-white">
                  <th className="px-5 py-4 text-left font-semibold tracking-wide w-44">Criterion</th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide bg-ghana-green text-white">
                    Techbridge
                    <span className="block text-xs font-normal opacity-80">Ghana</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide">
                    SmartBridge
                    <span className="block text-xs font-normal opacity-70">India</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide">
                    Other International
                    <span className="block text-xs font-normal opacity-70">Vendors</span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold tracking-wide text-techbridge-gold">Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.criterion}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="px-5 py-4 font-semibold text-techbridge-navy">{row.criterion}</td>
                    <td className="px-5 py-4 bg-ghana-green/10 border-x border-ghana-green/20">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                        <span className="text-techbridge-navy font-medium">{row.techbridge}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate">{row.smartbridge}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 justify-center text-center">
                        <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                        <span className="text-academic-slate">{row.others}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-block bg-ghana-green text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                        Techbridge
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
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
            The Ghanaian Advantage
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-14 max-w-xl mx-auto"
          >
            Four pillars that make Techbridge the only rational choice for the One Million Coders Programme.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-ghana-green" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-techbridge-navy mb-3">{pillar.title}</h3>
                  <p className="text-academic-slate leading-relaxed">{pillar.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex h-3">
              <div className="flex-1 bg-ghana-red" />
              <div className="flex-1 bg-ghana-gold" />
              <div className="flex-1 bg-ghana-green" />
            </div>
            <div className="bg-techbridge-navy px-10 py-14 text-center">
              <p className="text-techbridge-gold font-semibold tracking-widest uppercase text-sm mb-6">
                Economic Sovereignty
              </p>
              <blockquote className="font-serif text-3xl md:text-4xl font-bold text-white leading-snug max-w-3xl mx-auto mb-8">
                "With international vendors, resources exit Ghana. With Techbridge, every cedi is reinvested into Ghana's digital future."
              </blockquote>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-ghana-red font-bold text-2xl">Foreign Vendor</div>
                  <div className="text-slate-400 mt-1">Capital exits Ghana permanently</div>
                </div>
                <div className="w-px bg-slate-600" />
                <div className="text-center">
                  <div className="text-ghana-green font-bold text-2xl">Techbridge</div>
                  <div className="text-slate-400 mt-1">Capital reinvested in Ghana</div>
                </div>
              </div>
            </div>
            <div className="flex h-3">
              <div className="flex-1 bg-ghana-green" />
              <div className="flex-1 bg-ghana-gold" />
              <div className="flex-1 bg-ghana-red" />
            </div>
          </motion.div>
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
            Risk Comparison
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-academic-slate mb-12 max-w-xl mx-auto"
          >
            The decision carries consequences for one million Ghanaians. Choose accordingly.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border-2 border-ghana-red/30 bg-white p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ghana-red/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-ghana-red" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ghana-red">Choosing a Foreign Vendor</h3>
              </div>
              <ul className="space-y-4">
                {foreignRisks.map((risk) => (
                  <li key={risk} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
                    <span className="text-academic-slate leading-snug">{risk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="rounded-2xl border-2 border-ghana-green/40 bg-ghana-green/5 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ghana-green/15 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-ghana-green" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ghana-green">Choosing Techbridge</h3>
              </div>
              <ul className="space-y-4">
                {techbridgeBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                    <span className="text-techbridge-navy leading-snug font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-techbridge-navy py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-serif text-4xl font-bold text-white mb-5"
          >
            Ready to Proceed?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-techbridge-light/75 text-lg mb-10 leading-relaxed"
          >
            Techbridge is prepared to begin onboarding immediately. Let's formalise the partnership and get Ghana's one million coders learning.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-techbridge-gold text-techbridge-navy font-bold text-lg px-10 py-4 rounded-full hover:bg-ghana-gold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Begin the Partnership Discussion
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
