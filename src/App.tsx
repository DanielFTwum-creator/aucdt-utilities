import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, FileText, Brain, CheckCircle, Shield } from 'lucide-react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AdminProvider, useAdmin } from './contexts/AdminContext'
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { AdminLogin } from './components/AdminLogin'
import { AdminDashboard } from './components/AdminDashboard'

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminRoute />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  )
}

function AdminRoute() {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue dark:from-gray-900 dark:to-gray-800 high-contrast:from-black high-contrast:to-black">
      {/* Header */}
      <header
        className="bg-white/10 dark:bg-black/20 high-contrast:bg-black high-contrast:border-b-2 high-contrast:border-yellow-400 backdrop-blur-sm border-b border-white/20"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap
              className="w-8 h-8 text-academic-gold high-contrast:text-yellow-400"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-serif font-bold text-white high-contrast:text-yellow-400">
              ThesisAI
            </h1>
          </div>
          <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <a
              href="#features"
              className="text-white/80 hover:text-white high-contrast:text-yellow-300 high-contrast:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-academic-gold high-contrast:focus:ring-yellow-400 rounded px-2 py-1"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-white/80 hover:text-white high-contrast:text-yellow-300 high-contrast:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-academic-gold high-contrast:focus:ring-yellow-400 rounded px-2 py-1"
            >
              About
            </a>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-white/80 hover:text-white high-contrast:text-yellow-300 high-contrast:hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-academic-gold high-contrast:focus:ring-yellow-400 rounded px-2 py-1"
              aria-label="Admin panel"
            >
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span>Admin</span>
            </Link>
            <ThemeSwitcher />
            <button
              className="bg-academic-amber hover:bg-academic-gold high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-academic-navy high-contrast:text-black px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-academic-gold high-contrast:focus:ring-yellow-400"
              aria-label="Get started with ThesisAI"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20" role="main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl font-serif font-bold text-white high-contrast:text-yellow-400 mb-6">
            AI-Powered Thesis Assessment
          </h2>
          <p className="text-xl text-white/80 high-contrast:text-white max-w-2xl mx-auto mb-10">
            Streamline your academic evaluation process with intelligent analysis,
            detailed feedback, and comprehensive assessment tools.
          </p>
          <button
            className="bg-academic-gold hover:bg-academic-amber high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 text-academic-navy high-contrast:text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-academic-gold focus:ring-offset-2 high-contrast:focus:ring-yellow-400 dark:focus:ring-offset-gray-900"
            aria-label="Start thesis assessment"
          >
            Start Assessment
          </button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
          id="features"
          role="region"
          aria-label="Features"
        >
          <FeatureCard
            icon={<FileText className="w-10 h-10" aria-hidden="true" />}
            title="Document Analysis"
            description="Upload thesis documents and receive comprehensive structural analysis and formatting checks."
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10" aria-hidden="true" />}
            title="AI Evaluation"
            description="Leverage advanced AI to evaluate content quality, argumentation, and academic rigor."
          />
          <FeatureCard
            icon={<CheckCircle className="w-10 h-10" aria-hidden="true" />}
            title="Detailed Feedback"
            description="Get actionable feedback with specific suggestions for improvement and grading criteria."
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="bg-black/20 high-contrast:bg-black high-contrast:border-t-2 high-contrast:border-yellow-400 border-t border-white/10 mt-20"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white/60 high-contrast:text-white">
          <p>&copy; 2025 ThesisAI - African University College of Digital Technologies</p>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="bg-white/10 dark:bg-gray-800/50 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700 focus-within:ring-2 focus-within:ring-academic-gold high-contrast:focus-within:ring-yellow-400"
      tabIndex={0}
      role="article"
      aria-label={title}
    >
      <div className="text-academic-gold high-contrast:text-yellow-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white high-contrast:text-yellow-400 mb-3">
        {title}
      </h3>
      <p className="text-white/70 high-contrast:text-white">{description}</p>
    </motion.article>
  )
}

export default App
