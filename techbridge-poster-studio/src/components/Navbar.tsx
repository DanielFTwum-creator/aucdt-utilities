import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Why Techbridge', path: '/why-techbridge' },
  { label: 'The Programme', path: '/programme' },
  { label: 'Our Platform', path: '/platform' },
  { label: 'Track Record', path: '/track-record' },
  { label: 'Impact', path: '/impact' },
  { label: 'Implementation', path: '/implementation' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-techbridge-navy/97 backdrop-blur-md shadow-lg">
      {/* Ghana flag stripe */}
      <div className="flex h-0.5">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-serif font-bold text-white tracking-tight group-hover:text-techbridge-gold transition-colors">
              Techbridge
            </span>
            <span className="text-[9px] text-ghana-gold/80 tracking-[0.2em] uppercase font-sans">
              Education Services Ghana
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                pathname === link.path
                  ? 'bg-techbridge-gold text-techbridge-navy font-semibold'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-3 bg-ghana-green hover:bg-ghana-green/80 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            Contact Government Team
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
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
            className="lg:hidden bg-techbridge-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.path
                      ? 'bg-techbridge-gold text-techbridge-navy font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 bg-ghana-green text-white px-4 py-3 rounded-lg font-semibold text-sm text-center"
              >
                Contact Government Team
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
