import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, Activity, MapPin, Phone, Mail, Globe, Home } from 'lucide-react';
import { LOGO_URL, SOCIAL_LINKS } from '../constants';

// Custom X (Twitter) icon matching reference
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

// Custom TikTok icon
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.47-.17-.12-.32-.26-.47-.39v6.52c.03 2.11-.64 4.31-2.26 5.74-1.63 1.48-3.95 2.05-6.09 1.45-2.02-.51-3.79-2.07-4.57-4-1.02-2.56-.23-5.78 1.95-7.51 1.42-1.16 3.32-1.61 5.12-1.2v4.19c-.89-.25-1.89-.13-2.67.38-.85.54-1.34 1.55-1.24 2.55.1 1.34 1.25 2.45 2.58 2.44 1.35-.02 2.46-1.12 2.48-2.47V0z" />
  </svg>
);

interface FooterProps {
  onAdminClick: () => void;
  onTestClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onTestClick }) => {
  return (
    <footer className="bg-white border-t-[8px] border-tuc-maroon font-sans">
      {/* Visual Line Accent from Letterhead */}
      <div className="h-2 w-full flex">
        <div className="w-1/4 h-full bg-tuc-maroon"></div>
        <div className="w-1/2 h-full bg-tuc-gold"></div>
        <div className="w-1/4 h-full bg-tuc-maroon"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Branding Area */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <img src={LOGO_URL} alt="TUC Logo" className="h-16 w-auto" />
            <div className="h-12 w-px bg-gray-200 mx-4 hidden md:block"></div>
            <h2 className="text-2xl font-black text-tuc-maroon uppercase tracking-tighter">
              Design and Build a Nation!
            </h2>
          </div>
          <div className="flex space-x-3">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="Facebook"><Facebook size={18} /></a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="X (Twitter)"><XIcon size={18} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="Instagram"><Instagram size={18} /></a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="TikTok"><TikTokIcon size={18} /></a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="bg-tuc-maroon text-white p-2 rounded hover:bg-tuc-gold hover:text-tuc-maroon transition-all" aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>

        {/* Contact Info Grid - Mirroring Letterhead Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-tuc-gold p-2 h-fit rounded text-tuc-maroon" aria-hidden="true"><Home size={20} /></div>
            <div>
              <h4 className="font-black text-tuc-maroon uppercase mb-2">P.O. Box</h4>
              <p className="text-gray-600 font-medium">P.O. Box VV 179<br />Accra - Ghana</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-tuc-gold p-2 h-fit rounded text-tuc-maroon" aria-hidden="true"><MapPin size={20} /></div>
            <div>
              <h4 className="font-black text-tuc-maroon uppercase mb-2">Location</h4>
              <p className="text-gray-600 font-medium">Oyibi<br />Off the Adenta Dodowa Road<br />GM-274-6332</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-tuc-gold p-2 h-fit rounded text-tuc-maroon" aria-hidden="true"><Phone size={20} /></div>
            <div>
              <h4 className="font-black text-tuc-maroon uppercase mb-2">Phone</h4>
              <p className="text-gray-600 font-medium">054 012 4400<br />054 012 4488</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-tuc-gold p-2 h-fit rounded text-tuc-maroon" aria-hidden="true"><Mail size={20} /></div>
            <div>
              <h4 className="font-black text-tuc-maroon uppercase mb-2">Email</h4>
              <p className="text-gray-600 font-medium">info@aucdt.edu.gh<br />administration@aucdt.edu.gh</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 bg-tuc-gold p-2 h-fit rounded text-tuc-maroon" aria-hidden="true"><Globe size={20} /></div>
            <div>
              <h4 className="font-black text-tuc-maroon uppercase mb-2">Website</h4>
              <p className="text-gray-600 font-medium">https://aucdt.edu.gh</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500">
            <p className="uppercase tracking-widest">
                Techbridge University College | Copyright © 2026 | All Rights Reserved
            </p>
            <div className="flex items-center space-x-6">
              <button 
                  onClick={onTestClick}
                  className="hover:text-tuc-maroon transition-colors flex items-center uppercase tracking-widest"
              >
                  <Activity size={14} className="mr-1.5" /> Test Suite
              </button>
              <button 
                  onClick={onAdminClick}
                  className="hover:text-tuc-maroon transition-colors flex items-center uppercase tracking-widest"
              >
                  <ShieldCheck size={14} className="mr-1.5" /> Admin Portal
              </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
