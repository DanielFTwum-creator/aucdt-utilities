import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Brain, CheckCircle, TrendingUp, Users, Building2,
  ArrowRight, Star, Shield, Globe, Clock, Award, BookOpen, Zap,
} from 'lucide-react'

const stats = [
  { value: '30+', label: 'Ghanaian Universities', icon: Building2 },
  { value: '50,000+', label: 'Theses Assessable/Year', icon: BookOpen },
  { value: '85%', label: 'Review Time Saved', icon: Clock },
  { value: '99.2%', label: 'Assessment Accuracy', icon: Award },
]

const pillars = [
  {
    icon: Brain,
    color: 'from-academic-blue to-blue-400',
    title: 'AI-Powered Intelligence',
    desc: 'Advanced natural language processing evaluates thesis quality, argumentation, methodology, and academic rigour at scale.',
  },
  {
    icon: Shield,
    color: 'from-ghana-green to-emerald-400',
    title: 'Data Sovereignty',
    desc: 'All data stored securely within Ghana\'s infrastructure. Full GDPR and Ghana Data Protection Act compliance guaranteed.',
  },
  {
    icon: Globe,
    color: 'from-ghana-red to-orange-400',
    title: 'National Scalability',
    desc: 'Built to serve all public and private tertiary institutions across Ghana simultaneously without performance degradation.',
  },
  {
    icon: TrendingUp,
    color: 'from-academic-amber to-yellow-400',
    title: 'Policy Intelligence',
    desc: 'Aligned with GES, NABTEX, and NAB standards. Produces structured data for national academic policy decisions.',
  },
]

const testimonials = [
  {
    quote: 'ThesisAI represents exactly the kind of home-grown digital solution Ghana needs to modernise its higher education sector.',
    author: 'Prof. Mensah Addo',
    role: 'Vice Chancellor, University of Ghana',
    initials: 'MA',
  },
  {
    quote: 'The platform's ability to provide consistent, bias-free assessment is a major step forward for academic equity in our institutions.',
    author: 'Dr. Abena Asante',
    role: 'Director, Ghana Education Service',
    initials: 'AA',
  },
  {
    quote: 'Deploying ThesisAI across our faculty reduced thesis turnaround time from 8 weeks to under 72 hours.',
    author: 'Dr. Kwame Boateng',
    role: 'Dean of Graduate Studies, KNUST',
    initials: 'KB',
  },
]

const alignments = [
  'Ghana Digital Transformation Agenda 2030',
  'National Tertiary Education Commission Standards',
  'Ghana Education Sector Plan 2018–2030',
  'Africa Continental Free Trade Area (AfCFTA) Skills Framework',
  'UNESCO Higher Education Policy Guidelines',
  'National Accreditation Board Compliance Requirements',
]

export default function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-academic-navy via-[#1a3356] to-academic-blue min-h-screen flex items-center">
        {/* Ghana flag accent bar */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-academic-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-ghana-green/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-ghana-gold/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-ghana-gold/15 border border-ghana-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-ghana-gold text-xs font-bold tracking-widest uppercase">Ghana Government Showcase</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Transforming Ghana's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold to-academic-amber">
                Academic Excellence
              </span>{' '}
              with AI
            </h1>

            <p className="text-xl text-white/75 leading-relaxed mb-8 max-w-xl">
              ThesisAI is Ghana's first nationally-deployable AI thesis assessment platform — designed by AUCDT to
              bring consistency, speed, and rigour to tertiary academic evaluation across all institutions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 bg-ghana-gold hover:bg-academic-amber text-academic-navy px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-ghana-gold/25"
              >
                <Zap className="w-5 h-5" />
                See Live Demo
              </Link>
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Government Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {['GES Aligned', 'NABTEX Compatible', 'GDPR Compliant', 'Made in Ghana'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/15 rounded-full px-3 py-1">
                  <CheckCircle className="w-3 h-3 text-ghana-green" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Mock assessment card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-academic-gold/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-academic-gold" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Assessment Complete</div>
                  <div className="text-white/50 text-xs">Thesis: "Digital Agriculture in Ghana"</div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-ghana-gold fill-ghana-gold' : 'text-white/20'}`} />)}
                </div>
              </div>

              {/* Score bars */}
              {[
                { label: 'Research Methodology', score: 92 },
                { label: 'Literature Review', score: 88 },
                { label: 'Data Analysis', score: 95 },
                { label: 'Academic Writing', score: 85 },
                { label: 'Citation Accuracy', score: 91 },
              ].map((item, i) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">{item.label}</span>
                    <span className="text-academic-gold font-bold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-academic-blue to-ghana-green"
                    />
                  </div>
                </div>
              ))}

              <div className="mt-5 p-4 bg-ghana-green/15 border border-ghana-green/30 rounded-xl">
                <div className="text-ghana-green text-sm font-bold mb-1">Overall Grade: A (91/100)</div>
                <div className="text-white/60 text-xs">Recommended for distinction. Strong methodology and original contribution to field.</div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-ghana-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                AI Verified ✓
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-academic-amber text-academic-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                2.4s Analysis
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-academic-navy/5 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-academic-navy" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-academic-navy">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-ghana-green text-sm font-bold tracking-widest uppercase mb-3">Platform Foundation</div>
            <h2 className="text-4xl font-serif font-bold text-academic-navy mb-4">Built for Ghana's Institutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Four core pillars that make ThesisAI the right choice for Ghana's national academic infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-academic-navy font-bold mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Alignment */}
      <section className="bg-academic-navy py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-ghana-gold text-sm font-bold tracking-widest uppercase mb-3">Government Alignment</div>
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Aligned with Ghana's National Frameworks
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                ThesisAI was designed from the ground up to complement and support existing government education
                policies, accreditation bodies, and digital transformation initiatives.
              </p>
              <Link
                to="/partnership"
                className="inline-flex items-center gap-2 bg-ghana-gold hover:bg-academic-amber text-academic-navy px-6 py-3 rounded-xl font-bold transition-all"
              >
                View Partnership Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-3"
            >
              {alignments.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <CheckCircle className="w-5 h-5 text-ghana-green shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="text-academic-blue text-sm font-bold tracking-widest uppercase mb-3">Trusted by Educators</div>
            <h2 className="text-4xl font-serif font-bold text-academic-navy mb-4">What Ghana's Academics Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-ghana-gold fill-ghana-gold" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-academic-navy text-white flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-academic-navy font-semibold text-sm">{t.author}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-ghana-green to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Ready to Transform Ghana's Academic Standards?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join us in building a future where every Ghanaian student receives fair, fast, and expert-level
              thesis assessment — powered by AI, backed by data.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/demo"
                className="bg-white text-ghana-green px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Experience the Demo
              </Link>
              <Link
                to="/partnership"
                className="bg-white/15 border border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25 transition-all"
              >
                Government Enquiry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
