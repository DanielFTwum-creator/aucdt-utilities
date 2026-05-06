import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 dark:bg-black border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
              <span className="text-2xl font-bold text-white">Pama Realtor</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              We are dedicated to helping you find affordable and genuine deals for your rent and accommodation concerns.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#top" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#top" className="hover:text-emerald-400 transition-colors">Properties for Rent</a></li>
              <li><a href="#top" className="hover:text-emerald-400 transition-colors">Properties for Sale</a></li>
              <li><a href="#top" className="hover:text-emerald-400 transition-colors">Sell Your Property</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>+233 277 351121</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>info@pamarealtor.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest property alerts directly to your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800 border-none rounded-l-lg py-2 px-4 w-full focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
              <button className="bg-emerald-500 text-white px-4 rounded-r-lg hover:bg-emerald-600 transition-colors" aria-label="Subscribe">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Pama Realtor. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <a href="#top" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#top" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#top" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
            <button 
              onClick={onAdminClick}
              className="text-gray-600 hover:text-gray-400 flex items-center gap-1 text-xs transition-colors"
              aria-label="Admin Access"
            >
              <Lock size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;