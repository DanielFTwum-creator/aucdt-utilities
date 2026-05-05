import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Live Demo', path: '/demo' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'About', path: '/about' },
  { label: 'Partnership', path: '/partnership' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-academic-navy/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <GraduationCap className="w-8 h-8 text-academic-gold group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ghana-green border border-white/40" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-serif font-bold text-white">ThesisAI</span>
            <span className="text-[10px] text-academic-gold/80 tracking-widest uppercase">AUCDT Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.path
                  ? 'bg-academic-gold text-academic-navy'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/demo"
            className="ml-3 bg-ghana-green hover:bg-ghana-green/80 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-ghana-green/30 hover:shadow-lg"
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-academic-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.path
                      ? 'bg-academic-gold text-academic-navy'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
