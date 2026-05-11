import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Sun, Moon, Eye } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { cartItems, setIsCartOpen } = useCart();
  const { user, login, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Collections', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Eye className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-stone-200 dark:border-stone-800" style={{ background: 'rgba(26,26,26,0.96)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/images/sashmade_logo.png" alt="SashMade" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight" style={{ color: '#E87722' }}>
                SashMade
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "nav-link text-sm font-medium font-sans pb-1 transition-colors",
                    location.pathname === link.path
                      ? "active text-white"
                      : "text-stone-300 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-600 dark:text-stone-400"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors relative"
                aria-label="Open shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              {isAuthenticated && user?.role === 'user' ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{user.username}</span>
                  {user.picture ? (
                    <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full border border-stone-200" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button onClick={logout} className="text-xs text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">Logout</button>
                </div>
              ) : (
                <button onClick={login} className="flex items-center gap-2 px-4 py-2 bg-[#4A5340] text-white rounded-full hover:bg-[#3A4232] transition-colors text-sm font-medium">
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-stone-700 dark:text-stone-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-[#4A5340] dark:hover:text-[#D97706] hover:bg-stone-50 dark:hover:bg-stone-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300"
                >
                  {getThemeIcon()}
                  <span>Theme</span>
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}
                  className="flex items-center gap-2 text-stone-700 dark:text-stone-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                </button>
                {isAuthenticated && user?.role === 'user' ? (
                  <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-full text-sm text-center">
                    Logout ({user.username})
                  </button>
                ) : (
                  <button onClick={login} className="px-4 py-2 bg-[#4A5340] text-white rounded-full text-sm text-center">
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: '#ffffff' }}>
        {/* Kente strip — top border */}
        <div className="kente-strip" />

        {/* Footer grid */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem) 2rem',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5" style={{ display: 'inline-flex' }}>
              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                <img src="/images/sashmade_logo.png" alt="SashMade" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif font-bold text-lg" style={{ color: '#E87722' }}>SashMade</span>
            </Link>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300, maxWidth: '260px' }}>
              Celebrating African heritage through handcrafted kente graduation stoles.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5 mt-5">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/sashmade', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                )},
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sashmade/', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                )},
                { label: 'X / Twitter', href: 'https://x.com/sashwoveit', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: '32px', height: '32px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E87722';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#E87722';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Shop</p>
            <ul className="space-y-3">
              {[{ label: 'Graduation Stoles', to: '/shop' }].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Legal</p>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Refund Policy', to: '/refunds' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/admin/login"
                  className="font-sans text-sm font-medium transition-colors"
                  style={{ color: '#E87722' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#E87722')}
                >
                  Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact col */}
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Contact</p>
            <ul className="space-y-3">
              {[
                { text: '0247 139 986', href: 'tel:+233247139986' },
                { text: 'info@sashmade.com', href: 'mailto:info@sashmade.com' },
                { text: 'support@sashmade.com', href: 'mailto:support@sashmade.com' },
                { text: 'Accra, Ghana', href: undefined },
                { text: 'Instagram: @sashmade', href: 'https://www.instagram.com/sashmade' },
              ].map(({ text, href }) => (
                <li key={text}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-sans text-sm transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '1.25rem clamp(1.5rem, 5vw, 4rem)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
          className="footer-bottom"
        >
          <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2026 SashMade. All Rights Reserved. Pan-African Pride, Worldwide.
          </p>
          {/* Pan-African dots */}
          <div className="flex items-center gap-1">
            {['#C0392B', '#C9941A', '#2E7D32'].map(c => (
              <div key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
