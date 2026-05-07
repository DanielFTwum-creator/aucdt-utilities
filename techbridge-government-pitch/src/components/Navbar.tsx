import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, ChevronDown } from 'lucide-react'

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
  const [downloadOpen, setDownloadOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setDownloadOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const downloadDocuments = [
    {
      label: 'Alliance Brief PDF',
      fileName: 'Techbridge-SmartBridge-Alliance-Brief.pdf',
      description: 'Formal 3-page proposal document'
    },
    {
      label: 'Introductory Letter',
      fileName: 'Techbridge-Intro-Letter.pdf',
      description: 'Formal government introduction'
    },
    {
      label: 'Introductory Email',
      fileName: 'Techbridge-Intro-Email.pdf',
      description: 'Executive summary version'
    }
  ]

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a')
    // Use relative path that works in both dev and production
    const basePath = window.location.pathname.startsWith('/smart') ? '/smart' : ''
    link.href = `${basePath}/documents/${fileName}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadOpen(false)
  }

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

          {/* Download Dropdown */}
          <div ref={downloadRef} className="relative ml-2">
            <button
              type="button"
              onClick={() => setDownloadOpen(!downloadOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all"
            >
              <Download className="w-4 h-4" />
              Documents
              <ChevronDown className={`w-4 h-4 transition-transform ${downloadOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {downloadOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-56 bg-techbridge-navy border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {downloadDocuments.map(doc => (
                    <button
                      key={doc.fileName}
                      type="button"
                      onClick={() => handleDownload(doc.fileName)}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 border-b border-white/10 last:border-b-0 transition-colors"
                    >
                      <p className="text-white font-medium text-sm">{doc.label}</p>
                      <p className="text-slate-400 text-xs mt-1">{doc.description}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className="ml-3 bg-ghana-green hover:bg-ghana-green/80 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md"
          >
            Contact Government Team
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
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

              {/* Mobile Download Menu */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDownloadOpen(!downloadOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Documents
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${downloadOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {downloadOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {downloadDocuments.map(doc => (
                        <button
                          key={doc.fileName}
                          type="button"
                          onClick={() => handleDownload(doc.fileName)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-t border-white/10 first:border-t-0"
                        >
                          <p className="text-white font-medium text-sm">{doc.label}</p>
                          <p className="text-slate-400 text-xs mt-1">{doc.description}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
