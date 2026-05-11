import { useState, useEffect, useCallback } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw, Crown } from 'lucide-react';
import type { AISignal, User } from '../types';

interface Props { user: User | null; authFetch: (url: string, options?: RequestInit) => Promise<Response>; onLoginClick: () => void; onUpgrade: () => void; }

const SIGNAL_COLORS = {
  buy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  sell: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  hold: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export default function AISignals({ user, authFetch, onLoginClick, onUpgrade }: Props) {
  const [ticker, setTicker] = useState('');
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [currentSignal, setCurrentSignal] = useState<AISignal | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const r = await authFetch('/api/ai/signals');
      if (r.ok) setSignals(await r.json());
    } finally { setLoading(false); }
  }, [user, authFetch]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { onLoginClick(); return; }
    setError(null);
    setAnalyzing(true);
    setCurrentSignal(null);
    try {
      const r = await authFetch(`/api/ai/analyze/${ticker.toUpperCase()}`, { method: 'POST' });
      const data = await r.json();
      if (!r.ok) {
        if (data.upgrade) { onUpgrade(); return; }
        setError(data.error || 'Analysis failed. Please try again.');
        return;
      }
      setCurrentSignal(data);
      fetchHistory();
    } finally { setAnalyzing(false); }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Brain size={48} className="text-indigo-200 dark:text-indigo-800 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Stock Analysis</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">Sign in to get AI-powered buy/sell/hold signals with confidence scores and key factor breakdowns.</p>
        <button onClick={onLoginClick} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Sign in free</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Signals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gemini AI analysis · {user.tier === 'free' ? '5/hr free' : '60/hr premium'}
            {user.tier === 'free' && (
              <button onClick={onUpgrade} className="ml-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1 text-xs">
                <Crown size={11} />Upgrade for 12× more
              </button>
            )}
          </p>
        </div>
        <button onClick={fetchHistory} aria-label="Refresh signal history" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Analysis form */}
      <form onSubmit={analyze} className="flex gap-3 mb-6">
        <input
          type="text"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          required
          placeholder="Enter ticker (e.g. AAPL, NVDA, MSFT)…"
          aria-label="Stock ticker for analysis"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={analyzing || !ticker} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Brain size={16} />
          {analyzing ? 'Analysing…' : 'Analyse'}
        </button>
      </form>

      {error && <p role="alert" className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-lg">{error}</p>}

      {/* Current signal result */}
      {analyzing && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 text-center">
          <RefreshCw size={32} className="text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Analysing {ticker} with Gemini AI…</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Evaluating price action, fundamentals, and momentum signals</p>
        </div>
      )}

      {currentSignal && !analyzing && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentSignal.ticker}</span>
              {currentSignal.priceAtAnalysis && (
                <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">@ ${currentSignal.priceAtAnalysis.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase ${SIGNAL_COLORS[currentSignal.signal]}`}>
                {currentSignal.signal === 'buy' ? <span className="flex items-center gap-1"><TrendingUp size={14} />{currentSignal.signal}</span>
                  : currentSignal.signal === 'sell' ? <span className="flex items-center gap-1"><TrendingDown size={14} />{currentSignal.signal}</span>
                  : <span className="flex items-center gap-1"><Minus size={14} />{currentSignal.signal}</span>}
              </span>
              <div className="text-right">
                <div className="text-xs text-gray-400 dark:text-gray-500">Score</div>
                <div className={`text-2xl font-bold ${currentSignal.score >= 70 ? 'text-green-600 dark:text-green-400' : currentSignal.score <= 30 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>{currentSignal.score}</div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>Confidence</span><span>{currentSignal.confidence}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${currentSignal.confidence}%` }} />
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{currentSignal.rationale}</p>

          {currentSignal.keyFactors && currentSignal.keyFactors.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Key Factors</p>
              <div className="flex flex-wrap gap-1.5">
                {currentSignal.keyFactors.map((f, i) => (
                  <span key={i} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {currentSignal.riskLevel && <span>Risk: <span className="font-medium capitalize text-gray-600 dark:text-gray-300">{currentSignal.riskLevel}</span></span>}
            {currentSignal.timeHorizon && <span>Horizon: <span className="font-medium capitalize text-gray-600 dark:text-gray-300">{currentSignal.timeHorizon}-term</span></span>}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">⚠ AI-generated analysis for educational purposes only. Not financial advice. Always conduct your own research before investing.</p>
        </div>
      )}

      {/* Signal history */}
      {signals.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Recent Signals</h2>
          <div className="space-y-2">
            {signals.map(s => (
              <div key={s.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{s.ticker}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${SIGNAL_COLORS[s.signal]}`}>{s.signal}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Score: {s.score}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.rationale}</p>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4 text-right">
                  {s.price_at_signal ? `$${s.price_at_signal.toFixed(2)}` : ''}
                  <br />{s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
