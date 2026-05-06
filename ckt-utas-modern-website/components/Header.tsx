import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { 
    label: 'About', 
    href: '#about',
    children: [
        { label: 'About CKT-UTAS', href: '#' },
        { label: 'Strategic Mandate', href: '#' },
        { label: 'University Statutes', href: '#' },
        { label: 'University Policies', href: '#' }
    ]
  },
  { 
    label: 'Academics', 
    href: '#academics',
    children: [
        { label: 'Academic Calendar', href: '#' },
        { label: 'Schools & Departments', href: '#' },
        { label: 'Exam Regulations', href: '#' }
    ]
  },
  { 
    label: 'Admissions', 
    href: '#admissions',
    children: [
        { label: 'How to Apply', href: '#' },
        { label: 'Admission List', href: '#' },
        { label: 'Programmes', href: '#' }
    ] 
  },
  { label: 'Students', href: '#students' },
  { label: 'Staff', href: '#staff' },
  { label: 'Library', href: '#library' },
  { label: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  }

  return (
    <header className={`w-full z-50 transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-lg' : 'relative'}`}>
      {/* Top Bar */}
      <div className="bg-primary-dark text-white py-2 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <a href="#top" className="hover:text-secondary transition-colors"><Facebook size={16} /></a>
            <a href="#top" className="hover:text-secondary transition-colors"><Twitter size={16} /></a>
            <a href="#top" className="hover:text-secondary transition-colors"><Instagram size={16} /></a>
            <a href="#top" className="hover:text-secondary transition-colors"><Linkedin size={16} /></a>
            <a href="#top" className="hover:text-secondary transition-colors"><Youtube size={16} /></a>
            <a href="#top" className="hover:text-secondary transition-colors"><Mail size={16} /></a>
          </div>
          <div className="flex items-center space-x-4">
             <a href="#top" className="hidden md:inline-block hover:text-secondary transition-colors">Staff Mail</a>
             <a href="#top" className="hidden md:inline-block hover:text-secondary transition-colors">Student Mail</a>
             <button className="bg-transparent border border-white/30 px-4 py-1 rounded-full text-xs font-bold hover:bg-secondary hover:text-primary-dark transition-all">
                ADMISSIONS 2025/26
             </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
                {/* Placeholder for Logo */}
                <div className="h-12 w-12 md:h-16 md:w-16 bg-primary rounded-full flex items-center justify-center text-secondary font-bold text-xl md:text-2xl shadow-md">
                    CKT
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-primary-dark text-lg md:text-xl leading-tight">CKT-UTAS</span>
                    <span className="text-[10px] md:text-xs text-gray-600 uppercase tracking-wider hidden sm:block">University of Technology & Applied Sciences</span>
                </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
                <ul className="flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.label} className="relative group">
                            <a href={item.href} className="text-primary-dark font-semibold hover:text-secondary transition-colors flex items-center gap-1 py-2">
                                {item.label}
                                {item.children && <ChevronDown size={14} />}
                            </a>
                            {/* Dropdown */}
                            {item.children && (
                                <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border-t-4 border-secondary z-50">
                                    {item.children.map((child) => (
                                        <a key={child.label} href={child.href} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100 last:border-0">
                                            {child.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <button className="p-2 text-primary-dark hover:text-secondary transition-colors">
                    <Search size={20} />
                </button>
            </nav>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-4">
                <button className="p-2 text-primary-dark">
                    <Search size={20} />
                </button>
                <button onClick={toggleMenu} className="text-primary-dark p-2">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu}>
         <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-4">
                <button onClick={toggleMenu} className="p-2 text-gray-500 hover:text-primary">
                    <X size={24} />
                </button>
            </div>
            <div className="px-6 py-2 overflow-y-auto h-full pb-20">
                {navItems.map((item) => (
                    <div key={item.label} className="border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-center py-4">
                             <a href={item.href} className="text-primary-dark font-semibold text-lg">{item.label}</a>
                             {item.children && (
                                 <button onClick={() => toggleDropdown(item.label)} className="p-2 text-gray-500">
                                     <ChevronDown size={20} className={`transform transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                 </button>
                             )}
                        </div>
                        {item.children && (
                            <div className={`bg-gray-50 pl-4 overflow-hidden transition-all duration-300 ${activeDropdown === item.label ? 'max-h-96 py-2' : 'max-h-0'}`}>
                                {item.children.map((child) => (
                                    <a key={child.label} href={child.href} className="block py-2 text-gray-600 hover:text-primary">
                                        {child.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div className="mt-8 space-y-4">
                    <a href="#top" className="block w-full text-center py-3 bg-primary text-white rounded-lg font-bold shadow-lg">
                        ADMISSIONS 2025/26
                    </a>
                    <div className="flex justify-center space-x-6 text-primary-dark">
                        <Facebook size={20} />
                        <Twitter size={20} />
                        <Instagram size={20} />
                    </div>
                </div>
            </div>
         </div>
      </div>
    </header>
  );
};

export default Header;