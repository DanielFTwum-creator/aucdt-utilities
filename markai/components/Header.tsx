import React from 'react';
import { AppView, FeatureFlag } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import {
  LogOut, Home, Sparkles, ImageIcon, Calendar, DollarSign,
  Shield, Mic, Menu, X, TestTube,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onAdminNavigate: () => void;
}

const NAV_ITEMS = [
  { view: AppView.HOME,         icon: Home,      label: 'Home',        flag: null,                                     testId: 'nav-home' },
  { view: AppView.GENERATOR,    icon: Sparkles,  label: 'Generate',    flag: FeatureFlag.AI_CONTENT_GENERATION,        testId: 'nav-generator' },
  { view: AppView.LIVE_CHAT,    icon: Mic,       label: 'Live Chat',   flag: FeatureFlag.LIVE_AUDIO,                   testId: 'nav-live-chat' },
  { view: AppView.IMAGE_EDITOR, icon: ImageIcon, label: 'Edit Images', flag: FeatureFlag.IMAGE_EDITING,                testId: 'nav-image-editor' },
  { view: AppView.CALENDAR,     icon: Calendar,  label: 'Calendar',    flag: FeatureFlag.CAMPAIGN_SCHEDULING,          testId: 'nav-calendar' },
  { view: AppView.PRICING,      icon: DollarSign,label: 'Pricing',     flag: null,                                     testId: 'nav-pricing' },
  { view: AppView.TESTING_HOME, icon: TestTube,  label: 'Testing',     flag: null,                                     testId: 'nav-testing' },
] as const;

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onAdminNavigate }) => {
  const { currentUser, logout } = useAuth();
  const { featureFlags } = useFeatureFlags();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const visibleNav = NAV_ITEMS.filter(
    item => item.flag === null || featureFlags[item.flag]
  );

  const initials = currentUser?.name
    ? currentUser.name.slice(0, 2).toUpperCase()
    : '??';

  const handleNav = (view: AppView) => { setActiveView(view); setMobileOpen(false); };
  const handleAdmin = () => { onAdminNavigate(); setMobileOpen(false); };

  const navLinkClass = (view: AppView) =>
    [
      'whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
      'transition-colors duration-150',
      activeView === view
        ? 'bg-[hsl(var(--brand-500)/0.12)] text-[hsl(var(--brand-300))]'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
    ].join(' ');

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Skip link target */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <button
          onClick={() => handleNav(AppView.HOME)}
          aria-label="MarkAI Home"
          className="flex items-center gap-2.5 shrink-0 mr-2"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-white text-base"
            style={{ background: 'linear-gradient(135deg, hsl(var(--brand-500)), hsl(var(--brand-700)))' }}
          >
            M
          </div>
          <div className="leading-tight text-left">
            <div className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
              MarkAI
            </div>
            <div
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{ color: 'var(--text-muted)' }}
            >
              for non-marketers
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-hidden" aria-label="Main navigation">
          {visibleNav.map(({ view, icon: Icon, label, testId }) => (
            <button
              key={view}
              data-testid={testId}
              onClick={() => handleNav(view)}
              aria-current={activeView === view ? 'page' : undefined}
              className={navLinkClass(view)}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
          <button
            data-testid="nav-admin"
            onClick={handleAdmin}
            aria-current={activeView === AppView.ADMIN ? 'page' : undefined}
            className={navLinkClass(AppView.ADMIN)}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <ThemeSwitcher />

          {/* User block — desktop */}
          <div
            className="hidden md:flex items-center gap-3 pl-3 border-l"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(var(--accent-500)), hsl(var(--brand-500)))' }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="leading-tight hidden lg:block">
              <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Welcome back
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {currentUser?.name}
              </div>
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 space-y-1"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          {visibleNav.map(({ view, icon: Icon, label, testId }) => (
            <button
              key={view}
              data-testid={`${testId}-mobile`}
              onClick={() => handleNav(view)}
              aria-current={activeView === view ? 'page' : undefined}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-[hsl(var(--brand-500)/0.12)] text-[hsl(var(--brand-300))]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
          <button
            data-testid="nav-admin-mobile"
            onClick={handleAdmin}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === AppView.ADMIN
                ? 'bg-[hsl(var(--brand-500)/0.12)] text-[hsl(var(--brand-300))]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            Admin
          </button>
          <div className="border-t my-2" style={{ borderColor: 'var(--border-subtle)' }} />
          <button
            onClick={() => { logout(); setMobileOpen(false); }}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
