
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
    <footer className="bg-tuc-midnight text-white font-sans overflow-hidden">
      {/* Visual Line Accent from Letterhead */}
      <div className="h-2 w-full flex">
        <div className="w-1/4 h-full bg-tuc-forest"></div>
        <div className="w-1/2 h-full bg-tuc-gold"></div>
        <div className="w-1/4 h-full bg-tuc-forest"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Branding Area - Refined motto font size and layout for horizontal single-line display */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b-2 border-tuc-forest pb-16">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 md:mb-0 w-full md:w-auto">
            <img 
              src={LOGO_URL} 
              alt="TUC Logo" 
              className="h-16 xs:h-20 sm:h-24 md:h-26 lg:h-28 w-auto object-contain transition-all duration-300 hover:scale-105 brightness-0 invert" 
            />
            <div className="hidden md:block h-12 w-px bg-tuc-forest mx-2"></div>
            <h2 className="text-sm xs:text-base md:text-lg lg:text-xl xl:text-2xl font-black text-white uppercase tracking-tighter text-center md:text-left leading-none whitespace-nowrap">
              Build What Comes Next
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 shrink-0">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="Facebook" title="Follow on Facebook"><Facebook size={24} /></a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="X (Twitter)" title="Follow on X (Twitter)"><XIcon size={24} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="Instagram" title="Follow on Instagram"><Instagram size={24} /></a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="TikTok" title="Follow on TikTok"><TikTokIcon size={24} /></a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="LinkedIn" title="Follow on LinkedIn"><Linkedin size={24} /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="YouTube" title="Follow on YouTube"><Youtube size={24} /></a>
          </div>
        </div>

        {/* Contact Info Grid - Mirroring Letterhead Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-sm text-left">
          
          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Home size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">P.O. Box</h4>
              <p className="text-gray-300 font-bold leading-relaxed uppercase text-xs whitespace-nowrap">P.O. Box VV 179<br />Accra - Ghana</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><MapPin size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Location</h4>
              <p className="text-gray-300 font-bold leading-relaxed uppercase text-xs whitespace-nowrap">Oyibi<br />Adenta-Dodowa Road<br />GM-274-6332</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Phone size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Phone</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">054 012 4400<br />054 012 4488</p>
            </div>
          </div>

          <div className="flex gap-5 lg:col-span-1">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Mail size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Email</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">info@aucdt.edu.gh<br />admissions@aucdt.edu.gh</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Globe size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Web</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">aucdt.edu.gh<br />techbridge.edu.gh</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-tuc-forest py-8 border-t border-tuc-midnight">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-gray-300">
            <p className="uppercase tracking-[0.25em] text-center md:text-left">
                Techbridge University College | Copyright © 2026 | All Rights Reserved
            </p>
            <div className="flex items-center space-x-8">
              <button 
                  onClick={onTestClick}
                  className="hover:text-white transition-colors flex items-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                  aria-label="Diagnostic Suite"
                  title="Diagnostic Suite"
              >
                  <Activity size={14} className="mr-2 text-tuc-gold" aria-hidden="true" /> Diagnostic Suite
              </button>
              <button 
                  onClick={onAdminClick}
                  className="hover:text-white transition-colors flex items-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                  aria-label="Admin Portal"
                  title="Admin Portal"
              >
                  <ShieldCheck size={14} className="mr-2 text-tuc-gold" aria-hidden="true" /> Admin Portal
              </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
