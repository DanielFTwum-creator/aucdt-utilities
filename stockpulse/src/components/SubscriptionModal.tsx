import { X, Crown, Check, Zap } from 'lucide-react';
import type { User } from '../types';

interface Props { onClose: () => void; onUpgrade: () => Promise<boolean>; user: User | null; loading: boolean; }

const FREE_FEATURES = [
  '5-stock watchlist',
  '5 price alerts',
  '5 AI analyses per hour',
  'Paper trading ($100K virtual)',
  'Portfolio tracker',
  'Market news',
];

const PREMIUM_FEATURES = [
  '50-stock watchlist',
  '100 price alerts',
  '60 AI analyses per hour',
  'Full AI signal history',
  'Stock screener',
  'Priority support',
  ...FREE_FEATURES.slice(2),
];

export default function SubscriptionModal({ onClose, onUpgrade, user, loading }: Props) {
  const handleUpgrade = async () => {
    const ok = await onUpgrade();
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Upgrade to Premium">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative mx-4">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
            <Crown className="text-amber-500" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Upgrade to Premium</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Unlock the full power of AI-driven stock analysis</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Free plan */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Free</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">$0<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <ul className="space-y-2">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check size={14} className="text-gray-400 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium plan */}
          <div className="border-2 border-indigo-500 dark:border-indigo-400 rounded-xl p-5 relative">
            <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">POPULAR</div>
            <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
              <Crown size={14} /> Premium
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">$29.99<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <ul className="space-y-2">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Check size={14} className="text-indigo-500 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          {user?.tier === 'premium' ? (
            <p className="text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-2">
              <Crown size={16} /> You're already on Premium. Enjoy all features!
            </p>
          ) : (
            <>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl mx-auto transition-colors"
                aria-busy={loading}
              >
                <Zap size={18} />
                {loading ? 'Processing…' : 'Upgrade Now — $29.99/mo'}
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Cancel anytime · Instant access · No hidden fees
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                ⚠ Demo mode: upgrade is simulated. Stripe integration to be wired before production launch.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
