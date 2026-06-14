import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#2A5171] text-white text-center py-2 text-sm font-sans relative z-[60]">
        Now Accepting New Patients
        {/* Placeholder close button for visual parity, no functional state needed rn */}
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs cursor-pointer opacity-70 hover:opacity-100">&#10005;</span>
      </div>

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-frost shadow-sm"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link to="/">
            <img 
              src="https://images.squarespace-cdn.com/content/v1/65d385945c1b7165dd6ac28a/4ad6dc7e-8351-4f15-9969-0582e4aadbc0/Compassionate+Patient+Care+-+Powered+by+Science+%28Reddit+Banner%29.png" 
              alt="Bionic Skins™" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-8 font-sans font-medium text-[#2A5171] items-center">

            {/* About Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                About
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                  <Link to="/about" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                    About Bionic Skins™
                  </Link>
                  <Link to="/technology" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                    Our Technology
                  </Link>
                  <Link to="/our-blog" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                    Our Blog
                  </Link>
                </div>
              </div>
            </div>

            {/* Patients Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                Patients
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                    <Link to="/become-a-patient" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                      Become A Patient
                    </Link>
                    <Link to="/amputee-resources" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                      Resource Center
                    </Link>
                  </div>
              </div>
            </div>
            
            {/* Physicians Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center hover:text-prof-blue transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-prof-blue hover:after:w-full after:transition-all">
                Physicians
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                  <div className="bg-white shadow-xl border border-gray-100 rounded-b-md overflow-hidden flex flex-col py-2">
                    <Link to="/refer-a-patient" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors">
                      Refer A Patient
                    </Link>
                    <Link to="/clinical-trials" className="px-5 py-3 hover:bg-gray-50 text-center text-[#2A5171] hover:text-prof-blue transition-colors border-t border-gray-50">
                      Clinical Trials
                    </Link>
                  </div>
              </div>
            </div>
          </nav>
          
          <Link to="/contact-us" className="hidden xl:block bg-navy text-white px-6 py-2.5 rounded-[4px] font-sans font-bold hover:opacity-90 transition-all duration-300">
            Contact Us
          </Link>
          
          <button
            className="md:hidden min-h-[44px] w-11 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="text-navy" /> : <Menu className="text-navy" />}
          </button>
        </div>

        {/* Mobile Nav Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="flex flex-col px-6 py-4 space-y-1 font-sans text-[#2A5171]">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-1">About</p>
                <Link to="/about" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors border-b border-gray-50" onClick={() => setIsOpen(false)}>About Bionic Skins™</Link>
                <Link to="/technology" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors border-b border-gray-50" onClick={() => setIsOpen(false)}>Our Technology</Link>
                <Link to="/our-blog" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors" onClick={() => setIsOpen(false)}>Our Blog</Link>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 pt-3 pb-1">Patients</p>
                <Link to="/become-a-patient" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors border-b border-gray-50" onClick={() => setIsOpen(false)}>Become A Patient</Link>
                <Link to="/amputee-resources" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors" onClick={() => setIsOpen(false)}>Resource Center</Link>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 pt-3 pb-1">Physicians</p>
                <Link to="/refer-a-patient" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors border-b border-gray-50" onClick={() => setIsOpen(false)}>Refer A Patient</Link>
                <Link to="/clinical-trials" className="py-3 min-h-[44px] flex items-center hover:text-prof-blue transition-colors" onClick={() => setIsOpen(false)}>Clinical Trials</Link>
                <div className="pt-4 pb-2">
                  <Link to="/contact-us" className="block w-full bg-navy text-white px-6 py-3 min-h-[44px] rounded-[4px] font-bold text-center hover:opacity-90 transition-all" onClick={() => setIsOpen(false)}>Contact Us</Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
