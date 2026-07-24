// Shared fixture data used across Cypress and Playwright specs

export const FREE_USER = { id: 1, email: 'free@test.com', name: 'Free User', tier: 'free' as const };
export const PREMIUM_USER = { id: 2, email: 'premium@test.com', name: 'Premium User', tier: 'premium' as const };
export const ADMIN_USER = { id: 3, email: 'daniel.twum@techbridge.edu.gh', name: 'Daniel Twum', tier: 'premium' as const };
export const TEST_TOKEN = 'test-jwt-token';

// Symbols match backend getIndices() (services/market.ts), which always requests
// ^GSPC/^IXIC/^DJI/^VIX — Navbar's INDEX_LABELS map keys off these exact symbols
// to render friendly names ("S&P 500", "NASDAQ", "DOW", "VIX").
export const INDICES = [
  { symbol: '^GSPC', name: 'S&P 500', price: 550.12, change: 2.34, changePercent: 0.43 },
  { symbol: '^IXIC', name: 'NASDAQ Composite', price: 17500.88, change: -45.22, changePercent: -0.26 },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', price: 43560.60, change: 78.80, changePercent: 0.18 },
  { symbol: '^VIX', name: 'CBOE Volatility Index', price: 14.35, change: -0.22, changePercent: -1.51 },
];

export const WATCHLIST = [
  { id: 1, ticker: 'AAPL', added_at: '2026-01-01T00:00:00Z', quote: { ticker: 'AAPL', name: 'Apple Inc.', price: 189.30, previousClose: 187.00, change: 2.30, changePercent: 1.23, volume: 52000000, marketCap: 2.9e12, dayHigh: 190.00, dayLow: 187.50, fiftyTwoWeekHigh: 199.00, fiftyTwoWeekLow: 155.00, avgVolume: 60000000, pe: 28.5, marketState: 'REGULAR' } },
  { id: 2, ticker: 'MSFT', added_at: '2026-01-02T00:00:00Z', quote: { ticker: 'MSFT', name: 'Microsoft Corp.', price: 415.20, previousClose: 412.00, change: 3.20, changePercent: 0.78, volume: 22000000, marketCap: 3.1e12, dayHigh: 416.00, dayLow: 411.00, fiftyTwoWeekHigh: 430.00, fiftyTwoWeekLow: 350.00, avgVolume: 25000000, pe: 36.2, marketState: 'REGULAR' } },
];

export const PORTFOLIO_SUMMARY = {
  totalValue: 25000,
  totalCost: 20000,
  unrealizedPL: 5000,
  unrealizedPLPercent: 25.0,
  totalDayGain: 150,
  totalDayGainPercent: 0.6,
  positions: [
    { id: 1, ticker: 'AAPL', shares: 50, avgCost: 170.00, currentPrice: 189.30, previousClose: 187.00, value: 9465, cost: 8500, unrealizedPL: 965, unrealizedPLPercent: 11.35, dayGain: 115, dayGainPercent: 1.23, createdAt: '2026-01-01', purchase_date: '2026-01-01', allocation: 37.86 },
    { id: 2, ticker: 'MSFT', shares: 37, avgCost: 390.00, currentPrice: 415.20, previousClose: 412.00, value: 15362.40, cost: 14430, unrealizedPL: 932.40, unrealizedPLPercent: 6.46, dayGain: 118.40, dayGainPercent: 0.78, createdAt: '2026-01-02', purchase_date: '2026-01-02', allocation: 61.45 },
  ],
};

export const PAPER_ACCOUNT = { cashBalance: 85000, portfolioValue: 15000, totalValue: 100000, unrealizedPL: 0, resetCount: 0, initialCapital: 100000 };
export const PAPER_POSITIONS = [
  { ticker: 'AAPL', shares: 10, avgCost: 185.00, currentPrice: 189.30, value: 1893, cost: 1850, unrealizedPL: 43, unrealizedPLPercent: 2.32 },
];
export const PAPER_ORDERS = [
  { id: 1, ticker: 'AAPL', action: 'buy', order_type: 'market', shares: 10, fill_price: 185.00, status: 'filled', created_at: '2026-01-01T10:00:00Z' },
];

export const ALERTS = [
  { id: 1, ticker: 'AAPL', alert_type: 'price', condition: 'above', target_value: 200, active: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, ticker: 'MSFT', alert_type: 'price', condition: 'below', target_value: 400, active: 0, triggered_at: '2026-01-05T14:00:00Z', created_at: '2026-01-01T00:00:00Z' },
];

export const AI_SIGNALS = [
  { id: 1, ticker: 'AAPL', signal: 'buy', confidence: 82, score: 78, rationale: 'Strong momentum with solid earnings growth.', keyFactors: ['Revenue growth', 'Market share'], riskLevel: 'low', timeHorizon: 'medium', price_at_signal: 189.30, created_at: '2026-01-10T09:00:00Z' },
  { id: 2, ticker: 'MSFT', signal: 'hold', confidence: 65, score: 60, rationale: 'Consolidation phase after recent rally.', keyFactors: ['Cloud growth'], riskLevel: 'medium', timeHorizon: 'short', price_at_signal: 415.20, created_at: '2026-01-09T09:00:00Z' },
];

export const NEWS = [
  { title: 'Fed holds rates steady amid inflation concerns', publisher: 'Reuters', link: 'https://reuters.com/1', publishedAt: '2026-06-18T09:00:00Z', thumbnail: null },
  { title: 'Tech stocks rally on AI spending optimism', publisher: 'Bloomberg', link: 'https://bloomberg.com/1', publishedAt: '2026-06-18T08:00:00Z', thumbnail: 'https://example.com/img.jpg' },
];

export const ADMIN_USERS = [
  { id: 1, email: 'free@test.com', name: 'Free User', tier: 'free', created_at: '2026-01-01', last_login: '2026-06-18' },
  { id: 2, email: 'premium@test.com', name: 'Premium User', tier: 'premium', created_at: '2026-01-02', last_login: '2026-06-17' },
];

export const AUDIT_LOGS = [
  { id: 1, user_id: 1, action: 'LOGIN', details: 'Login from 127.0.0.1', ip: '127.0.0.1', created_at: '2026-06-18T10:00:00Z' },
  { id: 2, user_id: 2, action: 'REGISTER', details: 'New user: premium@test.com', ip: '127.0.0.1', created_at: '2026-01-02T08:00:00Z' },
];

export const HISTORY_BARS = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  open: 185 + Math.random() * 10,
  high: 190 + Math.random() * 5,
  low: 183 + Math.random() * 5,
  close: 186 + Math.random() * 8,
  volume: 50000000 + Math.random() * 10000000,
}));

// Raw position rows as returned by GET /api/portfolio (distinct from the
// enriched GET /api/portfolio/summary shape used for PORTFOLIO_SUMMARY above).
export const RAW_PORTFOLIO_POSITIONS = [
  { id: 1, ticker: 'AAPL', shares: 50, purchase_price: 170.00, purchase_date: '2026-01-01', notes: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, ticker: 'MSFT', shares: 37, purchase_price: 390.00, purchase_date: '2026-01-02', notes: null, created_at: '2026-01-02T00:00:00Z' },
];

export const SEARCH_RESULTS = [
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
];

// >=5 points required for PerformanceChart to treat the series as having data.
export const PERFORMANCE_HISTORY = {
  portfolio: Array.from({ length: 6 }, (_, i) => ({ date: `2026-01-0${i + 1}`, value: 20000 + i * 500, indexedValue: 100 + i * 2.5 })),
  benchmark: Array.from({ length: 6 }, (_, i) => ({ date: `2026-01-0${i + 1}`, value: 5000 + i * 10, indexedValue: 100 + i * 1.5 })),
};

export const PERFORMANCE_METRICS = {
  annualizedReturn: 0.18,
  volatility30d: 0.14,
  sharpeRatio: 1.28,
  beta: 1.05,
  alpha: 0.04,
  maxDrawdown: 0.12,
  riskFreeRate: 0.0525,
  riskFreeRateSource: 'fred' as const,
  period: '1y' as const,
  computedAt: '2026-06-18T00:00:00Z',
};

export const DIVIDENDS = [
  { ticker: 'AAPL', amount: 0.24, sharesHeld: 50, total: 12.00, exDate: '2026-02-10' },
  { ticker: 'MSFT', amount: 0.75, sharesHeld: 37, total: 27.75, exDate: '2026-02-14' },
];
