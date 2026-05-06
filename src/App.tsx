import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  FileText,
  Brain,
  CheckCircle,
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Upload,
  ChevronRight,
  Award,
  Clock,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

type NavItem = { id: string; label: string; icon: React.ReactNode }
type Submission = {
  id: string
  student: string
  title: string
  status: 'Pending' | 'In Review' | 'Approved' | 'Revision Required'
  score: number | null
  submitted: string
}

// ── Static data ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'submissions', label: 'Submissions', icon: <FileText className="w-5 h-5" /> },
  { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
]

const TREND_DATA = [
  { month: 'Jan', submissions: 28, assessed: 20, approved: 14 },
  { month: 'Feb', submissions: 34, assessed: 30, approved: 22 },
  { month: 'Mar', submissions: 41, assessed: 36, approved: 29 },
  { month: 'Apr', submissions: 38, assessed: 35, approved: 27 },
  { month: 'May', submissions: 52, assessed: 44, approved: 38 },
  { month: 'Jun', submissions: 47, assessed: 43, approved: 35 },
]

const SCORE_DISTRIBUTION = [
  { range: '90-100', count: 12 },
  { range: '80-89', count: 31 },
  { range: '70-79', count: 44 },
  { range: '60-69', count: 27 },
  { range: 'Below 60', count: 8 },
]

const RECENT_SUBMISSIONS: Submission[] = [
  { id: 'TH-2026-091', student: 'Ama Boateng', title: 'Machine Learning in Healthcare Diagnostics', status: 'In Review', score: null, submitted: '2026-05-05' },
  { id: 'TH-2026-090', student: 'Kofi Mensah', title: 'Blockchain Applications in Supply Chain', status: 'Approved', score: 87, submitted: '2026-05-04' },
  { id: 'TH-2026-089', student: 'Akosua Darko', title: 'Renewable Energy Policy in West Africa', status: 'Revision Required', score: 62, submitted: '2026-05-03' },
  { id: 'TH-2026-088', student: 'Kwame Asante', title: 'Natural Language Processing for Twi', status: 'Pending', score: null, submitted: '2026-05-02' },
  { id: 'TH-2026-087', student: 'Abena Osei', title: 'Urban Water Management Systems', status: 'Approved', score: 91, submitted: '2026-05-01' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  accent: string
  delay?: number
}

function MetricCard({ label, value, delta, deltaPositive, icon, accent, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {delta && (
          <p className={`text-sm mt-1 font-medium ${deltaPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
            {deltaPositive ? '▲' : '▼'} {delta}
          </p>
        )}
      </div>
    </motion.div>
  )
}

const STATUS_STYLES: Record<Submission['status'], string> = {
  Pending: 'bg-slate-100 text-slate-600',
  'In Review': 'bg-blue-100 text-blue-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  'Revision Required': 'bg-amber-100 text-amber-700',
}

function SubmissionRow({ sub, index }: { sub: Submission; index: number }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
    >
      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{sub.id}</td>
      <td className="py-3.5 px-4">
        <p className="font-medium text-slate-800 text-sm">{sub.student}</p>
        <p className="text-xs text-slate-400 truncate max-w-xs">{sub.title}</p>
      </td>
      <td className="py-3.5 px-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[sub.status]}`}>
          {sub.status}
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm font-semibold text-slate-700">
        {sub.score !== null ? sub.score : '—'}
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-400">{sub.submitted}</td>
    </motion.tr>
  )
}

// ── Page views ─────────────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div className="flex flex-col gap-8">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard label="Total Submissions" value={240} delta="12% vs last month" deltaPositive icon={<FileText className="w-5 h-5 text-academic-blue" />} accent="bg-blue-50" delay={0} />
        <MetricCard label="Assessed" value={198} delta="8% vs last month" deltaPositive icon={<Brain className="w-5 h-5 text-violet-600" />} accent="bg-violet-50" delay={0.07} />
        <MetricCard label="Approved" value={153} delta="5% vs last month" deltaPositive icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} accent="bg-emerald-50" delay={0.14} />
        <MetricCard label="Avg Score" value="76.4" delta="2.1 pts vs last month" deltaPositive icon={<Award className="w-5 h-5 text-academic-amber" />} accent="bg-amber-50" delay={0.21} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trend line – takes 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">Submission Trend (2026)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="submissions" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Submitted" />
              <Line type="monotone" dataKey="assessed" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Assessed" />
              <Line type="monotone" dataKey="approved" stroke="#059669" strokeWidth={2.5} dot={false} name="Approved" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score distribution – takes 1/3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SCORE_DISTRIBUTION} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent submissions table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Recent Submissions</h3>
          <button className="flex items-center gap-1.5 text-sm font-medium text-academic-blue hover:text-blue-700 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide">
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">Student / Title</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Score</th>
                <th className="text-left py-3 px-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SUBMISSIONS.map((sub, i) => (
                <SubmissionRow key={sub.id} sub={sub} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-80 gap-4 text-slate-400"
    >
      <BarChart3 className="w-12 h-12 opacity-30" />
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">This section is under construction.</p>
    </motion.div>
  )
}

// ── Root layout ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const activeLabel = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : undefined }}
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-academic-navy flex flex-col
            transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-9 h-9 bg-academic-gold rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-academic-navy" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">ThesisAI</p>
              <p className="text-white/40 text-xs">AUCDT Platform</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 text-left
                  ${activeNav === item.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/8'}
                `}
              >
                {item.icon}
                {item.label}
                {activeNav === item.id && (
                  <motion.div layoutId="nav-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-academic-gold" />
                )}
              </button>
            ))}
          </nav>

          {/* Upload CTA */}
          <div className="px-4 pb-6">
            <button className="w-full flex items-center justify-center gap-2 bg-academic-gold hover:bg-academic-amber text-academic-navy font-semibold text-sm py-2.5 rounded-xl transition-colors">
              <Upload className="w-4 h-4" />
              New Submission
            </button>
          </div>
        </motion.aside>
      </>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className={`flex items-center gap-2 flex-1 max-w-sm bg-slate-100 rounded-xl px-3 py-2 transition-all ${searchFocused ? 'ring-2 ring-academic-blue/30' : ''}`}>
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search submissions…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-academic-navy flex items-center justify-center text-white text-xs font-bold select-none">
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-7 overflow-y-auto">
          {/* Page heading */}
          <div className="flex items-center gap-2 mb-7 text-sm text-slate-400">
            <span>ThesisAI</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-700 font-medium">{activeLabel}</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{activeLabel}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Last updated: 6 May 2026, 09:14 WAT
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeNav === 'dashboard' && <DashboardView />}
              {activeNav !== 'dashboard' && <PlaceholderView title={activeLabel} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
