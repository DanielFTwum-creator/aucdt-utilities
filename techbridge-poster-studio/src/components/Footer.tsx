import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

const platformLinks = [
  { label: 'Why Techbridge', path: '/why-techbridge' },
  { label: 'The Programme', path: '/programme' },
  { label: 'Our Platform', path: '/platform' },
  { label: 'Track Record', path: '/track-record' },
  { label: 'Impact Dashboard', path: '/impact' },
  { label: 'Implementation Plan', path: '/implementation' },
]

const govLinks = [
  { label: 'Government Partnership', path: '/contact' },
  { label: 'Ministry Enquiries', path: '/contact' },
  { label: 'Platform Demonstration', path: '/contact' },
  { label: 'Programme Design', path: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-techbridge-navy">
      {/* Ghana flag stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <div className="text-xl font-serif font-bold text-white">Techbridge</div>
              <div className="text-[10px] text-ghana-gold/80 tracking-[0.2em] uppercase font-sans">
                Education Services Ghana
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Ghana's local-first digital skills partner. Five years serving Ghana's education sector.
              Ready to deliver the One Million Coders Programme in 8 weeks.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-ghana-green/20 border border-ghana-green/40 rounded text-ghana-green text-xs font-semibold">
                Ghanaian-Owned
              </span>
              <span className="px-2.5 py-1 bg-techbridge-gold/20 border border-techbridge-gold/40 rounded text-techbridge-gold text-xs font-semibold">
                5+ Years in Ghana
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-white/55 hover:text-techbridge-gold text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">For Government</h4>
            <ul className="space-y-2">
              {govLinks.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-white/55 hover:text-techbridge-gold text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-ghana-green/10 border border-ghana-green/30 rounded-lg">
              <div className="text-ghana-green text-xs font-bold mb-1">One Million Coders Programme</div>
              <div className="text-white/50 text-xs">Operational in 8 weeks from agreement.</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/55 text-sm">
                <MapPin className="w-4 h-4 text-ghana-gold mt-0.5 shrink-0" />
                Techbridge Education Services Ghana, Accra, Ghana
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-ghana-gold shrink-0" />
                <a href="mailto:government@techbridge.edu.gh" className="text-white/55 hover:text-techbridge-gold transition-colors">
                  government@techbridge.edu.gh
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-ghana-gold shrink-0" />
                <span className="text-white/55">+233 (0) 30 278 8895</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-ghana-gold shrink-0" />
                <a href="https://techbridge.edu.gh" target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-techbridge-gold transition-colors">
                  techbridge.edu.gh
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">
            © 2026 Techbridge Education Services Ghana. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">
            Submitted to: Ministry of Communications & Digitalization · Presidential Special Initiatives · Youth & Employment Agency · Ghana Digital Centre
          </p>
        </div>
      </div>
    </footer>
  )
}
