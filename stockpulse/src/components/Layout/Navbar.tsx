import { Sun, Moon, Bell, LogOut, Crown, User as UserIcon } from 'lucide-react';
import type { User, IndexData, Theme } from '../../types';

interface NavbarProps {
  user: User | null;
  indices: IndexData[];
  theme: Theme;
  onToggleTheme: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onUpgradeClick: () => void;
  alertCount: number;
}

function fmt(n: number, decimals = 2) {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(decimals)}%`;
}

function fmtPrice(n: number) {
  return n >= 1000
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toFixed(2);
}

function getMarketStatus() {
  try {
    const etNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const h = etNow.getHours();
    const m = etNow.getMinutes();
    const dow = etNow.getDay();
    const isWeekday = dow >= 1 && dow <= 5;
    const afterOpen = h > 9 || (h === 9 && m >= 30);
    const beforeClose = h < 16;
    const isOpen = isWeekday && afterOpen && beforeClose;
    const timeStr = etNow.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
    });
    return { isOpen, timeStr };
  } catch {
    const h = new Date().getHours();
    return { isOpen: h >= 9 && h < 16, timeStr: '' };
  }
}

const INDEX_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500', '^IXIC': 'NASDAQ', '^DJI': 'DOW', '^VIX': 'VIX',
};

export default function Navbar({ user, indices, theme, onToggleTheme, onLoginClick, onLogout, onUpgradeClick, alertCount }: NavbarProps) {
  const { isOpen, timeStr } = getMarketStatus();

  return (
    <header
      className="h-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-5 gap-5 sticky top-0 z-30 shrink-0"
      role="banner"
    >
      {/* Market status pill */}
      <span
        className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
          isOpen
            ? 'bg-[#2E8B5A]/10 text-[#2E8B5A]'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
        }`}
        aria-label={isOpen ? 'Market open' : 'Market closed'}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-[#2E8B5A]' : 'bg-gray-400'}`} aria-hidden="true" />
        {isOpen ? 'Market Open' : 'Market Closed'}
        {timeStr && <span className="opacity-70">· {timeStr} ET</span>}
      </span>

      {/* Index ticker bar */}
      <div className="flex items-center gap-5 flex-1 overflow-hidden">
        {indices.map(idx => (
          <span key={idx.symbol} className="hidden md:flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{INDEX_LABELS[idx.symbol] ?? idx.symbol}</span>
            <span className="text-[11px] font-semibold tabular-nums text-gray-700 dark:text-gray-300">
              {fmtPrice(idx.price)}
            </span>
            <span
              className={`text-[11px] tabular-nums font-medium ${
                idx.changePercent >= 0 ? 'text-[#2E8B5A]' : 'text-[#D94F4F]'
              }`}
            >
              {fmt(idx.changePercent)}
            </span>
          </span>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 shrink-0">
        {user?.tier === 'free' && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="hidden sm:flex items-center gap-1.5 border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
            aria-label="Upgrade to Premium"
          >
            <Crown size={11} aria-hidden="true" /> Upgrade
          </button>
        )}
        {user?.tier === 'premium' && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <Crown size={11} aria-hidden="true" /> Premium
          </span>
        )}

        {alertCount > 0 && (
          <button
            type="button"
            className="relative text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={`${alertCount} active alert${alertCount !== 1 ? 's' : ''}`}
          >
            <Bell size={17} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D94F4F] text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user ? (
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <LogOut size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-xs transition-colors"
          >
            <UserIcon size={15} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
