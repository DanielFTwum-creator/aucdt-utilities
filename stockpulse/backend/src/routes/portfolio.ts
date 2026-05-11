import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';
import { getQuote, getHistory } from '../services/market';

type HistoryBar = { date: string; close: number };

const router = Router();

router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const positions = db.prepare(
    'SELECT id, ticker, shares, purchase_price, purchase_date, notes, created_at FROM portfolio_positions WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user!.id);
  res.json(positions);
});

router.get('/summary', requireAuth, async (req: AuthRequest, res: Response) => {
  const positions = db.prepare(
    'SELECT ticker, shares, purchase_price, created_at FROM portfolio_positions WHERE user_id = ?'
  ).all(req.user!.id) as { ticker: string; shares: number; purchase_price: number; created_at: string }[];

  if (positions.length === 0) {
    res.json({ totalValue: 0, totalCost: 0, unrealizedPL: 0, unrealizedPLPercent: 0, totalDayGain: 0, totalDayGainPercent: 0, positions: [] });
    return;
  }

  const uniqueTickers = [...new Set(positions.map(p => p.ticker))];
  const quotes = await Promise.allSettled(uniqueTickers.map(t => getQuote(t)));
  const quoteMap: Record<string, { price: number; previousClose: number }> = {};
  quotes.forEach((r, i) => {
    if (r.status === 'fulfilled') quoteMap[uniqueTickers[i]] = { price: r.value.price, previousClose: r.value.previousClose };
  });

  const grouped: Record<string, { shares: number; cost: number; createdAt: string }> = {};
  positions.forEach(p => {
    if (!grouped[p.ticker]) grouped[p.ticker] = { shares: 0, cost: 0, createdAt: p.created_at };
    grouped[p.ticker].shares += p.shares;
    grouped[p.ticker].cost += p.shares * p.purchase_price;
    if (p.created_at < grouped[p.ticker].createdAt) grouped[p.ticker].createdAt = p.created_at;
  });

  let totalValue = 0;
  let totalCost = 0;
  let totalDayGain = 0;
  let totalPrevCloseValue = 0;

  const enriched = Object.entries(grouped).map(([ticker, data]) => {
    const q = quoteMap[ticker];
    const price = q?.price ?? 0;
    const previousClose: number | null = q ? q.previousClose : null;
    const value = price * data.shares;
    const pl = value - data.cost;

    let dayGain: number | null = null;
    let dayGainPercent: number | null = null;
    if (previousClose !== null && previousClose > 0) {
      dayGain = (price - previousClose) * data.shares;
      dayGainPercent = ((price - previousClose) / previousClose) * 100;
    }

    totalValue += value;
    totalCost += data.cost;
    if (dayGain !== null && previousClose !== null) {
      totalDayGain += dayGain;
      totalPrevCloseValue += previousClose * data.shares;
    }

    return {
      ticker,
      shares: data.shares,
      avgCost: data.cost / data.shares,
      currentPrice: price,
      previousClose,
      value,
      cost: data.cost,
      unrealizedPL: pl,
      unrealizedPLPercent: data.cost > 0 ? (pl / data.cost) * 100 : 0,
      dayGain,
      dayGainPercent,
      createdAt: data.createdAt,
      allocation: 0,
    };
  });

  enriched.forEach(p => { p.allocation = totalValue > 0 ? (p.value / totalValue) * 100 : 0; });

  res.json({
    totalValue,
    totalCost,
    unrealizedPL: totalValue - totalCost,
    unrealizedPLPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    totalDayGain,
    totalDayGainPercent: totalPrevCloseValue > 0 ? (totalDayGain / totalPrevCloseValue) * 100 : 0,
    positions: enriched,
  });
});

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildPriceMatrix(
  tickers: string[],
  histories: PromiseSettledResult<{ date: string; close: number }[]>[]
): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  tickers.forEach((ticker, i) => {
    const r = histories[i];
    if (r.status === 'fulfilled') {
      matrix[ticker] = {};
      r.value.forEach(bar => {
        matrix[ticker][bar.date.slice(0, 10)] = bar.close;
      });
    }
  });
  return matrix;
}

// Forward-fill: return the last known price at or before `date`
function priceAt(matrix: Record<string, Record<string, number>>, ticker: string, date: string): number {
  const map = matrix[ticker];
  if (!map) return 0;
  if (map[date]) return map[date];
  const prior = Object.keys(map).filter(d => d <= date).sort().pop();
  return prior ? map[prior] : 0;
}

async function fetchRiskFreeRate(): Promise<{ rate: number; source: 'fred' | 'fallback' }> {
  try {
    const res = await fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS3MO');
    if (!res.ok) throw new Error('FRED fetch failed');
    const text = await res.text();
    const lines = text.trim().split('\n').filter(l => !l.startsWith('DATE'));
    const last = lines[lines.length - 1]?.split(',')[1]?.trim();
    const rate = parseFloat(last ?? '');
    if (isNaN(rate)) throw new Error('FRED parse failed');
    return { rate: rate / 100, source: 'fred' };
  } catch {
    return { rate: 0.045, source: 'fallback' };
  }
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function covariance(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = xs.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const my = ys.slice(0, n).reduce((a, b) => a + b, 0) / n;
  return xs.slice(0, n).reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / (n - 1);
}

// ─── performance ─────────────────────────────────────────────────────────────

router.get('/performance', requireAuth, async (req: AuthRequest, res: Response) => {
  const period = (req.query.period as string) === '2y' ? '2y' : '1y';
  const userId = req.user!.id;

  const positions = db.prepare(
    'SELECT ticker, shares, purchase_date FROM portfolio_positions WHERE user_id = ?'
  ).all(userId) as { ticker: string; shares: number; purchase_date: string }[];

  if (positions.length === 0) {
    res.json({ portfolio: [], benchmark: [] });
    return;
  }

  // Check cache validity: if latest position change is after last snapshot, recompute
  const latestPos = db.prepare(
    "SELECT MAX(created_at) AS ts FROM portfolio_positions WHERE user_id = ?"
  ).get(userId) as { ts: string | null };
  const latestSnap = db.prepare(
    "SELECT MAX(fetched_at) AS ts FROM portfolio_snapshots WHERE user_id = ?"
  ).get(userId) as { ts: string | null };

  const needsRecompute = !latestSnap.ts || (latestPos.ts ?? '') > latestSnap.ts;

  if (!needsRecompute) {
    const snapshots = db.prepare(
      "SELECT date, total_value FROM portfolio_snapshots WHERE user_id = ? ORDER BY date ASC"
    ).all(userId) as { date: string; total_value: number }[];
    if (snapshots.length >= 5) {
      const base = snapshots[0].total_value;
      const portfolio = snapshots.map(s => ({
        date: s.date,
        value: s.total_value,
        indexedValue: base > 0 ? (s.total_value / base) * 100 : 100,
      }));
      // Still need benchmark for cached case — fetch last stored or re-fetch
      const spxHistory = (await getHistory('^GSPC', period, '1d').catch(() => [])) as HistoryBar[];
      const tradingDates = new Set(portfolio.map((p) => p.date));
      const spxFiltered = spxHistory.filter((b) => tradingDates.has(b.date.slice(0, 10)));
      const spxBase = spxFiltered[0]?.close ?? 1;
      const benchmark = spxFiltered.map((b) => ({
        date: b.date.slice(0, 10),
        value: b.close,
        indexedValue: (b.close / spxBase) * 100,
      }));
      res.json({ portfolio, benchmark });
      return;
    }
  }

  const uniqueTickers = [...new Set(positions.map(p => p.ticker))];
  const [spxResult, ...tickerResults] = await Promise.allSettled([
    getHistory('^GSPC', period, '1d'),
    ...uniqueTickers.map(t => getHistory(t, period, '1d')),
  ]);

  const matrix = buildPriceMatrix(uniqueTickers, tickerResults);
  const spxBars = spxResult.status === 'fulfilled' ? spxResult.value : [];

  // Build set of trading dates from S&P 500 history
  const tradingDates = spxBars.map((b: HistoryBar) => b.date.slice(0, 10)).sort();

  const dailyValues = tradingDates
    .map((date: string) => {
      const active = positions.filter((p) => p.purchase_date <= date);
      const value = active.reduce((sum, p) => sum + p.shares * priceAt(matrix, p.ticker, date), 0);
      return { date, value };
    })
    .filter((d: { date: string; value: number }) => d.value > 0);

  if (dailyValues.length === 0) {
    res.json({ portfolio: [], benchmark: [] });
    return;
  }

  // Upsert snapshots
  const upsert = db.prepare(
    'INSERT OR REPLACE INTO portfolio_snapshots (user_id, date, total_value, fetched_at) VALUES (?, ?, ?, datetime(\'now\'))'
  );
  dailyValues.forEach((r: { date: string; value: number }) => upsert.run(userId, r.date, r.value));

  const portfolioBase = dailyValues[0].value;
  const portfolio = dailyValues.map((d: { date: string; value: number }) => ({
    date: d.date,
    value: d.value,
    indexedValue: portfolioBase > 0 ? (d.value / portfolioBase) * 100 : 100,
  }));

  const activeDates = new Set(dailyValues.map((d: { date: string; value: number }) => d.date));
  const spxFiltered = spxBars.filter((b: HistoryBar) => activeDates.has(b.date.slice(0, 10)));
  const spxBase = spxFiltered[0]?.close ?? 1;
  const benchmark = spxFiltered.map((b: HistoryBar) => ({
    date: b.date.slice(0, 10),
    value: b.close,
    indexedValue: (b.close / spxBase) * 100,
  }));

  res.json({ portfolio, benchmark });
});

// ─── metrics ─────────────────────────────────────────────────────────────────

router.get('/metrics', requireAuth, async (req: AuthRequest, res: Response) => {
  const period = (req.query.period as string) === '2y' ? '2y' : '1y';
  const userId = req.user!.id;

  const positions = db.prepare(
    'SELECT ticker, shares, purchase_date FROM portfolio_positions WHERE user_id = ?'
  ).all(userId) as { ticker: string; shares: number; purchase_date: string }[];

  if (positions.length === 0) {
    res.status(400).json({ error: 'No positions to compute metrics' });
    return;
  }

  const uniqueTickers = [...new Set(positions.map(p => p.ticker))];
  const [spxResult, ...tickerResults] = await Promise.allSettled([
    getHistory('^GSPC', period, '1d'),
    ...uniqueTickers.map(t => getHistory(t, period, '1d')),
  ]);

  const matrix = buildPriceMatrix(uniqueTickers, tickerResults);
  const spxBars = spxResult.status === 'fulfilled' ? spxResult.value : [];
  const tradingDates = spxBars.map((b: HistoryBar) => b.date.slice(0, 10)).sort();

  const dailyValues = tradingDates
    .map((date: string) => {
      const active = positions.filter((p) => p.purchase_date <= date);
      return active.reduce((sum, p) => sum + p.shares * priceAt(matrix, p.ticker, date), 0);
    })
    .filter((v: number) => v > 0);

  if (dailyValues.length < 10) {
    res.status(400).json({ error: 'Not enough history to compute metrics' });
    return;
  }

  const portfolioReturns = dailyValues.slice(1).map((v: number, i: number) => (v - dailyValues[i]) / dailyValues[i]);
  const spxPrices = spxBars.map((b: HistoryBar) => b.close);
  const benchmarkReturns = spxPrices.slice(1).map((v: number, i: number) => (v - spxPrices[i]) / spxPrices[i]);

  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  const pr = portfolioReturns.slice(-n);
  const br = benchmarkReturns.slice(-n);

  const tradingDays = dailyValues.length;
  const startValue = dailyValues[0];
  const endValue = dailyValues[dailyValues.length - 1];
  const annualizedReturn = (endValue / startValue) ** (252 / tradingDays) - 1;

  const last30 = portfolioReturns.slice(-30);
  const volatility30d = stddev(last30) * Math.sqrt(252);

  const { rate: riskFreeRate, source: riskFreeRateSource } = await fetchRiskFreeRate();

  const sharpeRatio = volatility30d > 0 ? (annualizedReturn - riskFreeRate) / volatility30d : 0;

  const betaVar = stddev(br) ** 2;
  const beta = betaVar > 0 ? covariance(pr, br) / betaVar : 1;

  const benchmarkAnnualizedReturn = (spxPrices[spxPrices.length - 1] / spxPrices[0]) ** (252 / tradingDays) - 1;
  const alpha = annualizedReturn - (riskFreeRate + beta * (benchmarkAnnualizedReturn - riskFreeRate));

  let peak = dailyValues[0];
  let maxDrawdown = 0;
  dailyValues.forEach((v: number) => {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  res.json({
    annualizedReturn,
    volatility30d,
    sharpeRatio,
    beta,
    alpha,
    maxDrawdown,
    riskFreeRate,
    riskFreeRateSource,
    period,
    computedAt: new Date().toISOString(),
  });
});

// ─── dividends ───────────────────────────────────────────────────────────────

router.get('/dividends', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const positions = db.prepare(
    'SELECT ticker, shares, purchase_date FROM portfolio_positions WHERE user_id = ?'
  ).all(userId) as { ticker: string; shares: number; purchase_date: string }[];

  if (positions.length === 0) {
    res.json([]);
    return;
  }

  let yf: any;
  try {
    const mod = await import('yahoo-finance2');
    yf = (mod as any).default ?? mod;
  } catch {
    res.status(503).json({ error: 'Market data unavailable' });
    return;
  }

  const uniqueTickers = [...new Set(positions.map(p => p.ticker))];
  const today = new Date().toISOString().slice(0, 10);

  const upsert = db.prepare(
    'INSERT OR REPLACE INTO portfolio_dividends (user_id, ticker, amount, shares_held, total, ex_date, fetched_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))'
  );

  await Promise.allSettled(uniqueTickers.map(async ticker => {
    const tickerPositions = positions.filter(p => p.ticker === ticker);
    const earliestDate = tickerPositions.map(p => p.purchase_date).sort()[0];

    try {
      const history = await yf.historical(ticker, {
        period1: new Date(earliestDate),
        events: 'dividends',
      }) as unknown as { date: Date; dividends: number }[];

      if (!Array.isArray(history)) return;

      history.forEach((event) => {
        if (!event.dividends || !event.date) return;
        const exDate = new Date(event.date).toISOString().slice(0, 10);
        if (exDate > today) return;

        // Shares held at ex-date: sum shares from positions opened before ex-date
        const sharesHeld = tickerPositions
          .filter(p => p.purchase_date <= exDate)
          .reduce((sum, p) => sum + p.shares, 0);

        if (sharesHeld <= 0) return;

        upsert.run(userId, ticker, event.dividends, sharesHeld, event.dividends * sharesHeld, exDate);
      });
    } catch {
      // Ticker may not pay dividends — skip silently
    }
  }));

  const dividends = db.prepare(
    'SELECT ticker, amount, shares_held, total, ex_date FROM portfolio_dividends WHERE user_id = ? ORDER BY ex_date DESC'
  ).all(userId) as { ticker: string; amount: number; shares_held: number; total: number; ex_date: string }[];

  res.json(dividends.map(d => ({
    ticker: d.ticker,
    amount: d.amount,
    sharesHeld: d.shares_held,
    total: d.total,
    exDate: d.ex_date,
  })));
});

// ─── positions ───────────────────────────────────────────────────────────────

router.post('/position', requireAuth, (req: AuthRequest, res: Response) => {
  const { ticker, shares, purchase_price, purchase_date, notes } = req.body as {
    ticker: string; shares: number; purchase_price: number; purchase_date: string; notes?: string;
  };
  if (!ticker || !shares || !purchase_price || !purchase_date) {
    res.status(400).json({ error: 'ticker, shares, purchase_price, and purchase_date are required' });
    return;
  }
  const result = db.prepare(
    'INSERT INTO portfolio_positions (user_id, ticker, shares, purchase_price, purchase_date, notes) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.user!.id, ticker.toUpperCase(), Number(shares), Number(purchase_price), purchase_date, notes || null);
  res.status(201).json({ id: result.lastInsertRowid, ticker: ticker.toUpperCase(), shares, purchase_price, purchase_date });
});

router.delete('/position/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const result = db.prepare(
    'DELETE FROM portfolio_positions WHERE id = ? AND user_id = ?'
  ).run(Number(req.params.id), req.user!.id);
  if (result.changes === 0) { res.status(404).json({ error: 'Position not found' }); return; }
  res.json({ deleted: true });
});

export default router;
