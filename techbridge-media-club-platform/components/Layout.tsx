import React, { ReactNode, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  ShieldAlert,
  Search,
  Globe,
  Clock,
  Type,
  Palette
} from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { auditService } from '../services/AuditService';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme, font, setFont } = useTheme();
  const { showToast } = useToast();
  const { locale, setLocale, t } = useLanguage();

  // Date & Time State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Africa/Accra');

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'content', label: t('nav.content'), icon: FileText },
    { id: 'assets', label: t('nav.assets'), icon: ImageIcon },
    { id: 'events', label: t('nav.events'), icon: Calendar },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart2 },
  ];

  const fonts = [
    { name: 'Inter (Default)', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Lora', value: 'Lora' },
  ];

  const handleSignOut = () => {
    showToast('Sign out simulated successfully', 'success');
    auditService.log('INFO', 'User signed out');
  };

  // Date Formatting Helpers
  const getFormattedDate = () => {
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: timeZone
      }).format(currentDate);
    } catch (e) {
      return currentDate.toLocaleDateString();
    }
  };

  const getFormattedTime = () => {
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone,
        timeZoneName: 'short'
      }).format(currentDate);
    } catch (e) {
      return currentDate.toLocaleTimeString();
    }
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeZone(e.target.value);
    auditService.log('INFO', `Time zone changed to ${e.target.value}`);
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as any);
    auditService.log('INFO', `Language changed to ${e.target.value}`);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
    auditService.log('INFO', `Font changed to ${e.target.value}`);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as any);
    auditService.log('INFO', `Theme changed to ${e.target.value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-techbridge-dark text-gray-900 dark:text-gray-100 flex flex-col md:flex-row font-sans transition-colors duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* Mobile Header */}
      <div className="md:hidden glass text-gray-900 dark:text-white p-4 flex justify-between items-center z-20 sticky top-0 border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center space-x-2">
          <img 
            src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
            alt="Techbridge Logo" 
            className="w-8 h-8 object-contain bg-white rounded-md p-0.5 shadow-lg" 
          />
          <span className="font-serif font-bold text-lg tracking-wide">Techbridge</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Cinematic Dock) */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-10 w-72 transform transition-transform duration-500 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          glass md:bg-white/80 md:dark:bg-techbridge-dark/90 border-r border-gray-200/50 dark:border-white/5 backdrop-blur-xl
        `}
      >
        <div className="h-full flex flex-col">
          {/* Brand Area */}
          <div className="h-24 flex items-center px-8 bg-gradient-to-r from-techbridge-maroon to-techbridge-wine text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="Techbridge Logo" 
              className="w-12 h-12 object-contain mr-4 bg-white rounded-lg p-1 shadow-md z-10" 
            />
            <div className="z-10">
              <h1 className="font-serif font-bold text-xl tracking-wide leading-none">Techbridge</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-techbridge-gold mt-1 opacity-90">Media Club</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2" aria-label="Main Navigation">
            <div className="px-4 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Main Menu</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                    auditService.log('INFO', `Navigation to ${item.label}`);
                  }}
                  className={`
                    group w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${isActive 
                      ? 'bg-techbridge-maroon text-white shadow-lg shadow-techbridge-maroon/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  <Icon size={20} className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-techbridge-gold' : 'text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold'}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-techbridge-gold"></div>}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-white/10 space-y-3 bg-gray-50/50 dark:bg-black/20">
            <button 
              id="nav-admin"
              onClick={() => {
                setActiveTab('admin');
                setIsSidebarOpen(false);
                auditService.log('INFO', 'User accessed Admin Portal login');
              }}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
            >
              <ShieldAlert size={18} className={`mr-2 ${activeTab === 'admin' ? 'text-red-500' : ''}`} />
              {t('nav.admin')}
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm group cursor-pointer hover:border-techbridge-maroon/30 transition-colors">
              <div className="relative">
                <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-md group-hover:border-techbridge-maroon transition-colors" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-serif font-bold text-gray-900 dark:text-white truncate">{CURRENT_USER.name}</p>
                <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 truncate">{CURRENT_USER.role}</p>
              </div>
              <button onClick={handleSignOut} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 glass z-10 flex items-center justify-between px-8 transition-all duration-300 gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              {activeTab === 'admin' ? t('header.admin') : navItems.find(i => i.id === activeTab)?.label}
            </h2>
            {/* Dynamic Date & Time */}
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:flex items-center mt-2 animate-in fade-in">
              <span className="mr-3 tracking-wide">{getFormattedDate()}</span>
              <span className="font-mono font-bold text-techbridge-maroon dark:text-techbridge-gold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded shadow-sm border border-gray-200 dark:border-white/5">
                {getFormattedTime()}
              </span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden xl:flex items-center bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-transparent focus-within:border-techbridge-maroon/50 transition-colors mr-2">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder={t('header.search')} className="bg-transparent border-none focus:ring-0 text-xs ml-2 w-32 text-gray-700 dark:text-gray-200 placeholder-gray-400" />
            </div>

            {/* Selectors Group */}
            <div className="hidden lg:flex items-center space-x-2 mr-2 bg-gray-50/50 dark:bg-black/20 p-1 rounded-xl border border-gray-100 dark:border-white/5">
                {/* Theme Selector */}
                <div className="relative group">
                    <Palette size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={theme}
                        onChange={handleThemeChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="high-contrast">High Contrast</option>
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>

                {/* Font Selector */}
                <div className="relative group">
                    <Type size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={font}
                        onChange={handleFontChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none max-w-[100px]"
                        title="Select Font"
                    >
                        {fonts.map(f => (
                           <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                
                {/* Language Selector */}
                <div className="relative group">
                    <Globe size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={locale}
                        onChange={handleLocaleChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none"
                    >
                        <option value="en-GB">EN (UK)</option>
                        <option value="en-US">EN (US)</option>
                        <option value="fr-FR">Français</option>
                        <option value="ak-GH">Twi (GH)</option>
                    </select>
                </div>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
                {/* Time Zone Selector */}
                <div className="relative group">
                    <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-techbridge-maroon dark:group-hover:text-techbridge-gold transition-colors" />
                    <select 
                        value={timeZone}
                        onChange={handleTimeZoneChange}
                        className="pl-7 pr-2 py-1 bg-transparent border-none rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:ring-0 appearance-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors outline-none max-w-[100px]"
                    >
                        <option value="Africa/Accra">Accra</option>
                        <option value="Europe/London">London</option>
                        <option value="America/New_York">New York</option>
                        <option value="UTC">UTC</option>
                    </select>
                </div>
            </div>

            <button 
              className="relative p-2.5 bg-white dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:text-techbridge-maroon dark:hover:text-white shadow-sm hover:shadow-md transition-all"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-techbridge-gold rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
            </button>
            <button 
              className="p-2.5 bg-white dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:text-techbridge-maroon dark:hover:text-white shadow-sm hover:shadow-md transition-all"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;