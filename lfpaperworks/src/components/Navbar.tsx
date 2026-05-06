import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Shop Books', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-6 md:px-12",
        isScrolled ? "bg-white shadow-sm py-4" : "bg-white border-b border-brand-linen"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo - Artist Identity */}
        <Link to="/" className="flex-1 md:flex-none">
          <span className="font-serif text-xl md:text-2xl tracking-[0.15em] font-medium uppercase">
            Luciana Frigerio
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/' && "text-tuc-gold")}>
            Home
          </Link>
          <div className="relative group cursor-pointer flex items-center space-x-1 text-sm font-medium hover:text-tuc-gold transition-colors">
            <span>Portfolio</span>
            <ChevronDown className="w-3 h-3" />
            {/* Dropdown placeholder */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-linen opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 shadow-xl">
              <Link to="/shop" className="block px-4 py-2 hover:bg-brand-leaf text-xs uppercase tracking-widest">Book Sculptures</Link>
              <Link to="/about" className="block px-4 py-2 hover:bg-brand-leaf text-xs uppercase tracking-widest">Exhibitions</Link>
            </div>
          </div>
          <Link to="/about" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/about' && "text-tuc-gold")}>
            About
          </Link>
          <Link to="/shop" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/shop' && "text-tuc-gold")}>
            Shop Books
          </Link>
          <Link to="/contact" className={cn("text-sm font-medium hover:text-tuc-gold transition-colors", location.pathname === '/contact' && "text-tuc-gold")}>
            Contact
          </Link>
          <ThemeSwitcher />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="p-2 hover:text-tuc-gold transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/cart" className="relative p-2 hover:text-tuc-gold transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-tuc-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-xl tracking-widest uppercase">Luciana Frigerio</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col space-y-8">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="text-3xl font-serif">
                  {link.name}
                </Link>
              ))}
              <Link to="/shop" className="text-3xl font-serif">Portfolio</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
