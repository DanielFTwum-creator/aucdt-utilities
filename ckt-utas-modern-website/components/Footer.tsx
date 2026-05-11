import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Contact Info */}
            <div>
                <h3 className="text-white text-xl font-bold mb-6 border-l-4 border-secondary pl-3">Contact Us</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-secondary mt-1 shrink-0" />
                        <p>Box 24<br/>Navrongo, Upper East Region<br/>Ghana</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={20} className="text-secondary shrink-0" />
                        <p>+233-(0)372 095 456</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail size={20} className="text-secondary shrink-0" />
                        <p>info@cktutas.edu.gh</p>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <a href="#top" className="bg-gray-800 p-2 rounded-full hover:bg-secondary hover:text-primary-dark transition-colors"><Facebook size={18} /></a>
                    <a href="#top" className="bg-gray-800 p-2 rounded-full hover:bg-secondary hover:text-primary-dark transition-colors"><Twitter size={18} /></a>
                    <a href="#top" className="bg-gray-800 p-2 rounded-full hover:bg-secondary hover:text-primary-dark transition-colors"><Instagram size={18} /></a>
                    <a href="#top" className="bg-gray-800 p-2 rounded-full hover:bg-secondary hover:text-primary-dark transition-colors"><Linkedin size={18} /></a>
                </div>
            </div>

            {/* About Us Links */}
            <div>
                <h3 className="text-white text-xl font-bold mb-6 border-l-4 border-secondary pl-3">About Us</h3>
                <ul className="space-y-2">
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">About CKT-UTAS</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">University Statutes</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Strategic Mandate</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Mission & Vision</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">The Emblem</a></li>
                </ul>
            </div>

            {/* Academics Links */}
            <div>
                <h3 className="text-white text-xl font-bold mb-6 border-l-4 border-secondary pl-3">Academics</h3>
                <ul className="space-y-2">
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">How to Apply</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Undergraduate Programmes</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Postgraduate Programmes</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Entry Requirements</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Academic Calendar</a></li>
                </ul>
            </div>

            {/* Key Links */}
            <div>
                <h3 className="text-white text-xl font-bold mb-6 border-l-4 border-secondary pl-3">Key Links</h3>
                <ul className="space-y-2">
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Admission List</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Student Portal</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Staff Directory</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Library</a></li>
                    <li><a href="#top" className="hover:text-secondary transition-colors hover:pl-2 duration-200 block">Alumni</a></li>
                </ul>
            </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black text-gray-500 py-6 px-4 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} C. K. Tedam University of Technology & Applied Sciences. All Rights Reserved.</p>
            <div className="flex gap-6">
                <a href="#top" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#top" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#top" className="hover:text-white transition-colors">Sitemap</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;