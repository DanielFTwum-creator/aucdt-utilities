export type Tier = 'free' | 'premium';
export type Theme = 'light' | 'dark';
export type View = 'watchlist' | 'portfolio' | 'paper' | 'alerts' | 'ai' | 'news' | 'screener' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  tier: Tier;
  tier_expires_at?: string;
  created_at?: string;
  last_login?: string;
}

export interface Quote {
  ticker: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number;
  pe: number | null;
  marketState: string;
}

export interface HistoryBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface WatchlistItem {
  id: number;
  ticker: string;
  added_at: string;
  quote?: Quote;
}

export interface PortfolioPosition {
  id?: number;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  previousClose: number | null;
  value: number;
  cost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayGain: number | null;
  dayGainPercent: number | null;
  createdAt: string;
  allocation?: number;
  purchase_date?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  totalDayGain: number;
  totalDayGainPercent: number;
  positions: PortfolioPosition[];
}

export interface PaperAccount {
  cashBalance: number;
  portfolioValue: number;
  totalValue: number;
  unrealizedPL: number;
  resetCount: number;
  initialCapital: number;
}

export interface PaperPosition {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  cost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
}

export interface PaperOrder {
  id: number;
  ticker: string;
  action: 'buy' | 'sell';
  order_type: string;
  shares: number;
  fill_price: number;
  status: string;
  created_at: string;
}

export interface Alert {
  id: number;
  ticker: string;
  alert_type: string;
  condition: string;
  target_value: number;
  active: number;
  triggered_at?: string;
  created_at: string;
}

export interface AISignal {
  id?: number;
  ticker: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  score: number;
  rationale: string;
  keyFactors?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  timeHorizon?: 'short' | 'medium' | 'long';
  priceAtAnalysis?: number;
  analyzedAt?: string;
  price_at_signal?: number;
  created_at?: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  thumbnail: string | null;
}

export interface PortfolioSnapshot {
  date: string;
  value: number;
  indexedValue: number;
}

export interface PerformanceHistory {
  portfolio: PortfolioSnapshot[];
  benchmark: PortfolioSnapshot[];
}

export interface PerformanceMetrics {
  annualizedReturn: number;
  volatility30d: number;
  sharpeRatio: number;
  beta: number;
  alpha: number;
  maxDrawdown: number;
  riskFreeRate: number;
  riskFreeRateSource: 'fred' | 'fallback';
  period: '1y' | '2y';
  computedAt: string;
}

export interface DividendEntry {
  ticker: string;
  amount: number;
  sharesHeld: number;
  total: number;
  exDate: string;
}

export interface TierLimits {
  watchlist: number;
  alerts: number;
  aiAnalysesPerHour: number;
  signalHistory: number;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: { watchlist: 5, alerts: 5, aiAnalysesPerHour: 5, signalHistory: 10 },
  premium: { watchlist: 50, alerts: 100, aiAnalysesPerHour: 60, signalHistory: 100 },
};
