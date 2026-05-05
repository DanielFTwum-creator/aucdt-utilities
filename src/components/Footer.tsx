import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-academic-navy border-t border-white/10">
      {/* Ghana Flag Bar */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold" />
        <div className="flex-1 bg-ghana-green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-7 h-7 text-academic-gold" />
              <span className="text-lg font-serif font-bold text-white">ThesisAI</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Empowering Ghana's academic institutions with AI-driven thesis assessment technology.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-ghana-red/20 border border-ghana-red/40 rounded text-ghana-red text-xs font-medium">GH</span>
              <span className="px-2 py-1 bg-academic-gold/20 border border-academic-gold/40 rounded text-academic-gold text-xs font-medium">AUCDT 2025</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {['Features', 'Live Demo', 'Dashboard', 'Documentation'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-academic-gold text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Government</h4>
            <ul className="space-y-2">
              {[
                'Partnership Program',
                'Policy Alignment',
                'Institutional Onboarding',
                'National Coverage Plan',
                'Impact Reports',
              ].map(item => (
                <li key={item}>
                  <Link to="/partnership" className="text-white/60 hover:text-academic-gold text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-academic-gold mt-0.5 shrink-0" />
                African University College of Digital Technologies, Accra, Ghana
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-academic-gold shrink-0" />
                <a href="mailto:info@aucdt.edu.gh" className="hover:text-academic-gold transition-colors">info@aucdt.edu.gh</a>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-academic-gold shrink-0" />
                +233 (0) 30 XXX XXXX
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <ExternalLink className="w-4 h-4 text-academic-gold shrink-0" />
                <a href="https://aucdt.edu.gh" target="_blank" rel="noopener noreferrer" className="hover:text-academic-gold transition-colors">
                  aucdt.edu.gh
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2025 ThesisAI — African University College of Digital Technologies. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built for Ghana's Academic Future · Aligned with Ghana Education Service Standards
          </p>
        </div>
      </div>
    </footer>
  )
}
