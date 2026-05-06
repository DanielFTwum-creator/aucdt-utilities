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
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="text-navy" /> : <Menu className="text-navy" />}
          </button>
        </div>
      </motion.header>
    </>
  );
}
