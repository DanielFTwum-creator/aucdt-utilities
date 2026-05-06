import { Facebook, Instagram, Linkedin, Send, Shield, Twitter, Youtube } from 'lucide-react';
import React from 'react';

interface FooterProps {
  onNavigate: (view: 'home' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-tuc-maroon text-gray-300 pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-tuc-gold text-lg font-bold mb-6 relative inline-block pb-2">
              About Us
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-white"></span>
            </h3>
            <p className="mb-6 text-sm leading-relaxed">
              The vision of the College is to become an internationally reputable centre for Design education and research.
            </p>
            <div className="text-sm space-y-4">
              <p>
                <strong className="text-white block mb-1">Location:</strong>
                Oyibi (opposite Valley View University) off the Adenta - Dodowa Road (Accra-Ghana)
              </p>
              <p>
                <strong className="text-white block mb-1">Digital Address:</strong>
                GM-274-6332
              </p>
            </div>
            <div className="mt-6">
              <a href="#top" className="inline-block bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded uppercase hover:bg-gray-700 transition-colors">
                Accreditation & Affiliation
              </a>
            </div>
          </div>

          {/* Column 2: Connect */}
          <div>
            <h3 className="text-tuc-gold text-lg font-bold mb-6 relative inline-block pb-2">
              Connect with us
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-white"></span>
            </h3>
            <div className="text-sm space-y-4 mb-6">
              <p>
                <strong className="text-white block mb-1">Postal Address:</strong>
                P. O. Box VV 179,<br />Oyibi - Accra.
              </p>
              <p>
                <strong className="text-white block mb-1">Mobile/Whatsapp:</strong>
                +233 (0)54 012 4400<br />
                +233 (0)54 012 4488
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-tuc-gold text-lg font-bold mb-6 relative inline-block pb-2">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-white"></span>
            </h3>
            <ul className="text-sm space-y-2">
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">About us</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Students</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Faculty</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Departments</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Admissions</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Ofosua Library</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">TUC LMS</a></li>
            </ul>
            
            <h3 className="text-tuc-gold text-lg font-bold mt-8 mb-4 relative inline-block pb-2">
              Resources
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-white"></span>
            </h3>
            <ul className="text-sm space-y-2">
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">TUC Email</a></li>
              <li><a href="#top" className="hover:text-tuc-gold transition-colors">Privacy Statement</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-tuc-gold text-lg font-bold mb-6 relative inline-block pb-2">
              Subscribe to our Newsletter
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-white"></span>
            </h3>
            <p className="text-sm mb-4">
              Join our mailing list to receive the latest news and updates from our institution.
            </p>
            <form className="space-y-3">
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-full bg-white/10 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-tuc-gold text-sm"
                aria-label="Last Name"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-white/10 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:border-tuc-gold text-sm"
                aria-label="Email Address"
              />
              <button 
                type="button" 
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                Subscribe <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#440a0c] py-6 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs md:text-sm text-center md:text-left text-gray-400">
            Techbridge University College | Copyright © 2025 | All Rights Reserved
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#top" className="text-gray-400 hover:text-tuc-gold transition-colors" aria-label="Social Link">
                    <Icon size={18} />
                </a>
                ))}
            </div>
            <div className="h-4 w-px bg-gray-600 mx-2"></div>
            <button 
                onClick={() => onNavigate('admin')}
                className="text-xs text-gray-500 hover:text-tuc-gold transition-colors flex items-center gap-1"
            >
                <Shield size={12} /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;