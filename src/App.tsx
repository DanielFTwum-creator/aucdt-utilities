import { useState, useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import {
  GraduationCap,
  FileText,
  Brain,
  CheckCircle,
  Sparkles,
  BarChart2,
  BookOpen,
  Users,
  ArrowRight,
  Download,
  Shield,
  ChevronRight,
} from 'lucide-react'

// ─── Ticker ────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'ADMISSIONS OPEN FOR JULY 2026 COHORT',
  'SUBMIT YOUR THESIS BY JUNE 15',
  'LIMITED ASSESSMENT SLOTS AVAILABLE',
  'AI-POWERED FEEDBACK IN 24 HOURS',
  'AUCDT THESIS PORTAL NOW LIVE',
]

function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return
    xRef.current -= delta * 0.06
    const width = trackRef.current.scrollWidth / 2
    if (Math.abs(xRef.current) >= width) xRef.current = 0
    trackRef.current.style.transform = `translateX(${xRef.current}px)`
  })

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="bg-crimson overflow-hidden py-2 select-none">
      <div ref={trackRef} className="flex gap-0 whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item text-cream text-xs font-mono font-medium tracking-widest uppercase px-6">
            {item}
            <span className="mx-4 opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Nav Tab ───────────────────────────────────────────────────────────────────
function NavTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-xs font-mono font-bold tracking-widest uppercase border-b-2 transition-colors ${
        active
          ? 'border-crimson text-crimson'
          : 'border-transparent text-ink/40 hover:text-ink/70'
      }`}
    >
      {label}
    </button>
  )
}

// ─── Stat Row ──────────────────────────────────────────────────────────────────
function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-l border-cream/20 pl-6 first:border-l-0 first:pl-0">
      <span className="text-2xl font-serif font-bold text-gold italic">{value}</span>
      <span className="text-xs font-mono font-bold tracking-widest uppercase text-cream/60">{label}</span>
    </div>
  )
}

// ─── Feature Card ──────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  directive: string
}

function FeatureCard({ icon, title, description, directive }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-cream border border-ink/10 rounded-none p-8 relative overflow-hidden cursor-default"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-crimson scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
      <div className="text-xs font-mono text-crimson/60 tracking-widest uppercase mb-5">{directive}</div>
      <div className="text-crimson mb-4">{icon}</div>
      <h3 className="text-lg font-serif font-bold text-ink mb-3">{title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center gap-1 text-xs font-mono font-bold tracking-widest uppercase text-crimson opacity-0 group-hover:opacity-100 transition-opacity">
        LEARN MORE <ChevronRight className="w-3 h-3" />
      </div>
    </motion.div>
  )
}

// ─── Assessment Panel ──────────────────────────────────────────────────────────
function AssessmentPanel() {
  const [title, setTitle] = useState('Thesis on Distributed Systems')
  const [dept, setDept] = useState('Computer Science')
  const [score] = useState(87)

  return (
    <div className="grid lg:grid-cols-[320px_1fr] h-full border border-ink/10">
      {/* Controls */}
      <div className="bg-cream border-r border-ink/10 p-6 space-y-6 overflow-y-auto">
        <div>
          <label className="block text-xs font-mono font-bold tracking-widest uppercase text-ink/40 mb-2">
            Thesis Title
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border border-ink/15 px-3 py-2 text-sm font-sans text-ink placeholder-ink/30 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-bold tracking-widest uppercase text-ink/40 mb-2">
            Department
          </label>
          <input
            value={dept}
            onChange={e => setDept(e.target.value)}
            className="w-full bg-white border border-ink/15 px-3 py-2 text-sm font-sans text-ink placeholder-ink/30 focus:outline-none focus:border-crimson transition-colors"
          />
        </div>

        <div>
          <div className="text-xs font-mono font-bold tracking-widest uppercase text-ink/40 mb-3">
            6R Assessment Criteria
          </div>
          {[
            ['Rigor', 92],
            ['Relevance', 88],
            ['Reasoning', 85],
            ['Research', 90],
            ['Rhetoric', 78],
            ['Results', 89],
          ].map(([label, val]) => (
            <div key={label as string} className="mb-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-ink/60 font-bold tracking-wider uppercase">{label}</span>
                <span className="text-crimson font-bold">{val}</span>
              </div>
              <div className="h-1 bg-ink/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-crimson rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 space-y-2">
          <button className="w-full bg-crimson hover:bg-crimson/90 text-cream text-xs font-mono font-bold tracking-widest uppercase px-4 py-3 flex items-center justify-center gap-2 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> OPTIMIZE ASSESSMENT
          </button>
          <button className="w-full border border-ink/20 hover:border-crimson text-ink/60 hover:text-crimson text-xs font-mono font-bold tracking-widest uppercase px-4 py-3 flex items-center justify-center gap-2 transition-colors">
            <Download className="w-3.5 h-3.5" /> EXPORT REPORT
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-parchment flex flex-col">
        <div className="border-b border-ink/10 px-6 py-3 flex items-center justify-between bg-cream/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-ink/50 tracking-widest uppercase">Live Assessment Preview</span>
          </div>
          <span className="text-xs font-mono text-ink/40 tracking-widest uppercase">6R Directive v1.0</span>
        </div>

        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-lg bg-cream border border-ink/10 shadow-lg">
            {/* Card header */}
            <div className="bg-ink p-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-cream/40 tracking-widest uppercase mb-1">Assessment Report</p>
                <h3 className="text-xl font-serif font-bold text-cream leading-snug">{title || 'Untitled Thesis'}</h3>
                <p className="text-xs font-mono text-cream/50 mt-1 tracking-wide">{dept || 'Department'} · AUCDT</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-gold mb-1" />
                <span className="text-xs font-mono text-cream/40 tracking-widest">AUCDT</span>
              </div>
            </div>

            {/* Score */}
            <div className="px-6 pt-6 pb-4 border-b border-ink/10">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-6xl font-serif font-bold text-crimson leading-none">{score}</span>
                <div className="pb-2">
                  <span className="text-lg font-serif text-ink/30">/100</span>
                  <p className="text-xs font-mono text-ink/50 tracking-widest uppercase">Overall Score</p>
                </div>
              </div>
              <div className="h-1.5 bg-ink/8 mt-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-crimson to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 py-5 flex items-center justify-between">
              <button className="border border-crimson text-crimson text-xs font-mono font-bold tracking-widest uppercase px-5 py-2.5 flex items-center gap-2 hover:bg-crimson hover:text-cream transition-colors">
                VIEW FULL REPORT <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-ink/30 tracking-wider">thesis.aucdt.edu.gh</span>
            </div>
          </div>
        </div>

        {/* Stats footer */}
        <div className="bg-ink px-8 py-5 flex gap-0 divide-x divide-cream/10">
          <StatRow value="July 26" label="Deadline" />
          <StatRow value="AI-24h" label="Turnaround" />
          <StatRow value="6R" label="Methodology" />
        </div>
      </div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
const TABS = ['THESIS ASSESSOR', 'ANALYTICS', 'REPORTS'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('THESIS ASSESSOR')

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans">
      {/* Ticker */}
      <Ticker />

      {/* Header */}
      <header className="bg-cream border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-crimson rounded flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-crimson" />
            </div>
            <div>
              <h1 className="text-base font-serif font-bold text-ink leading-none">ThesisAI</h1>
              <p className="text-xs font-mono text-ink/40 tracking-widest uppercase">AUCDT Utilities</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(tab => (
              <NavTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="border border-ink/20 hover:border-crimson text-ink/60 hover:text-crimson text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 transition-colors flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> EXPORT AS
            </button>
            <button className="bg-crimson hover:bg-crimson/90 text-cream text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 flex items-center gap-2 transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> OPTIMIZE COPY
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {activeTab === 'THESIS ASSESSOR' && (
          <motion.div
            key="assessor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Page header */}
            <div className="mb-8 flex items-end justify-between border-b border-ink/10 pb-6">
              <div>
                <p className="text-xs font-mono text-crimson tracking-widest uppercase mb-1">
                  6R Aesthetic Enhancement Directive v1.0
                </p>
                <h2 className="text-4xl font-serif font-bold text-ink leading-tight">
                  Thesis Assessment<br />
                  <span className="italic text-crimson">Intelligence Platform</span>
                </h2>
              </div>
              <p className="text-sm text-ink/40 max-w-xs text-right leading-relaxed hidden lg:block">
                Evaluate academic work with precision using the 6R methodology — Rigor, Relevance,
                Reasoning, Research, Rhetoric, and Results.
              </p>
            </div>

            {/* Assessment panel */}
            <div className="h-[580px]">
              <AssessmentPanel />
            </div>

            {/* Feature grid */}
            <div id="features" className="grid md:grid-cols-3 gap-px bg-ink/10 mt-px border-t border-ink/10">
              <FeatureCard
                icon={<FileText className="w-8 h-8" />}
                title="Document Analysis"
                description="Upload thesis documents and receive comprehensive structural analysis, citation checks, and formatting validation."
                directive="Directive R1 · Rigor"
              />
              <FeatureCard
                icon={<Brain className="w-8 h-8" />}
                title="AI Evaluation"
                description="Leverage advanced language models to evaluate content quality, argumentation depth, and academic integrity."
                directive="Directive R2 · Reasoning"
              />
              <FeatureCard
                icon={<CheckCircle className="w-8 h-8" />}
                title="Detailed Feedback"
                description="Receive actionable feedback with specific suggestions aligned to each of the 6R assessment dimensions."
                directive="Directive R3 · Results"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'ANALYTICS' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-12 text-center"
          >
            <BarChart2 className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="text-xs font-mono text-ink/40 tracking-widest uppercase">Analytics Dashboard — Coming in Phase 2</p>
          </motion.div>
        )}

        {activeTab === 'REPORTS' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-12 text-center"
          >
            <BookOpen className="w-12 h-12 text-ink/20 mx-auto mb-4" />
            <p className="text-xs font-mono text-ink/40 tracking-widest uppercase">Report Archive — Coming in Phase 2</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ink border-t border-cream/10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold" />
            <span className="text-xs font-mono text-cream/40 tracking-widest uppercase">
              AUCDT · African University College of Digital Technologies
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-cream/30 tracking-widest uppercase">
            <span>© 2025 ThesisAI</span>
            <span className="text-cream/10">|</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> Portal Access
            </span>
          </div>
        </div>
        <div className="border-t border-cream/5 px-6 py-3 max-w-7xl mx-auto">
          <p className="text-center text-xs font-mono text-cream/20 tracking-wider">
            This interface automatically enforces the 6R Aesthetic Enhancement Directive v1.0. All assessments are AI-assisted.
          </p>
        </div>
      </footer>
    </div>
  )
}
