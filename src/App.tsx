import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, FileText, Brain, CheckCircle, FlaskConical } from 'lucide-react'
import { SelfTest } from './components/SelfTest'

type TabType = 'home' | 'self-test'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-academic-gold" />
            <h1 className="text-2xl font-serif font-bold text-white">ThesisAI</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors ${
                activeTab === 'home'
                  ? 'text-white font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('self-test')}
              className={`flex items-center gap-2 transition-colors ${
                activeTab === 'self-test'
                  ? 'text-white font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Self-Test
            </button>
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <button className="bg-academic-amber hover:bg-academic-gold text-academic-navy px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      {activeTab === 'self-test' ? (
        <SelfTest />
      ) : (
        <>
          {/* Hero Section */}
          <main className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl font-serif font-bold text-white mb-6">
            AI-Powered Thesis Assessment
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Streamline your academic evaluation process with intelligent analysis,
            detailed feedback, and comprehensive assessment tools.
          </p>
          <button className="bg-academic-gold hover:bg-academic-amber text-academic-navy px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg">
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
        >
          <FeatureCard
            icon={<FileText className="w-10 h-10" />}
            title="Document Analysis"
            description="Upload thesis documents and receive comprehensive structural analysis and formatting checks."
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10" />}
            title="AI Evaluation"
            description="Leverage advanced AI to evaluate content quality, argumentation, and academic rigor."
          />
          <FeatureCard
            icon={<CheckCircle className="w-10 h-10" />}
            title="Detailed Feedback"
            description="Get actionable feedback with specific suggestions for improvement and grading criteria."
          />
        </motion.div>
      </main>

          {/* Footer */}
          <footer className="bg-black/20 border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center text-white/60">
              <p>&copy; 2025 ThesisAI - African University College of Digital Technologies</p>
            </div>
          </footer>
        </>
      )}
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
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
    >
      <div className="text-academic-gold mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  )
}

export default App
