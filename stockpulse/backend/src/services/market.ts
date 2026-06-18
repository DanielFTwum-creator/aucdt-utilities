let _yf: any = null;
async function yf() {
  if (_yf === null) {
    const mod = await import('yahoo-finance2');
    const YF = (mod as any).default ?? mod;
    _yf = new YF({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });
  }
  return _yf;
}

// Simple TTL cache — keeps Yahoo Finance rate-limit pressure low.
// Quote: 60 s  |  History: 5 min  |  Everything else: 2 min
const _cache = new Map<string, { data: unknown; expires: number }>();
function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = _cache.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.data as T);
  return fn().then(data => {
    _cache.set(key, { data, expires: Date.now() + ttlMs });
    return data;
  });
}

export function getQuote(ticker: string) {
  return cached(`quote:${ticker}`, 60_000, async () => {
  const yahooFinance = await yf();
  const quote = await yahooFinance.quote(ticker);
  return {
    ticker: quote.symbol,
    name: quote.longName || quote.shortName || ticker,
    price: quote.regularMarketPrice ?? 0,
    previousClose: quote.regularMarketPreviousClose ?? 0,
    change: quote.regularMarketChange ?? 0,
    changePercent: quote.regularMarketChangePercent ?? 0,
    volume: quote.regularMarketVolume ?? 0,
    marketCap: quote.marketCap ?? 0,
    dayHigh: quote.regularMarketDayHigh ?? 0,
    dayLow: quote.regularMarketDayLow ?? 0,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? 0,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? 0,
    avgVolume: quote.averageDailyVolume3Month ?? 0,
    pe: quote.trailingPE ?? null,
    marketState: quote.marketState ?? 'CLOSED',
  };
  });
}

export function getHistory(ticker: string, period: string = '1mo', interval: string = '1d') {
  return cached(`history:${ticker}:${period}:${interval}`, 5 * 60_000, async () => {
  const yahooFinance = await yf();
  // 5d is a range value, not a chart interval — exclude it
  const validIntervals = ['1m','2m','5m','15m','30m','60m','90m','1h','1d','1wk','1mo','3mo'];
  const normalizedInterval = String(interval || '1d').trim().toLowerCase();
  const resolvedInterval = normalizedInterval === '10m' ? '15m' : normalizedInterval;
  const safeInterval = validIntervals.includes(resolvedInterval) ? resolvedInterval : '1d';

  const periodMap: Record<string, number> = {
    '1d':  1, '2d':  2, '5d':  5,
    '1mo': 30, '3mo': 90, '6mo': 180,
    '1y':  365, '2y': 730,
  };
  const daysBack = periodMap[period] ?? 30;
  // chart() requires period1 as YYYY-MM-DD string, not a Date object
  const period1 = new Date(Date.now() - daysBack * 86400000)
    .toISOString().split('T')[0];

  const result = await yahooFinance.chart(ticker, {
    period1,
    interval: safeInterval as any,
  });

  return ((result as any).quotes ?? []).map((d: any) => ({
    date: new Date(d.date * 1000).toISOString(),
    open: d.open ?? 0,
    high: d.high ?? 0,
    low: d.low ?? 0,
    close: d.close ?? 0,
    volume: d.volume ?? 0,
  }));
  });
}

export async function searchTickers(query: string) {
  const yahooFinance = await yf();
  const result = await yahooFinance.search(query);
  return (result.quotes || [])
    .filter((q: Record<string, unknown>) => q.isYahooFinance && q.quoteType === 'EQUITY')
    .slice(0, 10)
    .map((q: Record<string, unknown>) => ({
      ticker: q.symbol as string,
      name: (q.longname || q.shortname || q.symbol) as string,
      exchange: q.exchange as string,
      type: q.quoteType as string,
    }));
}

export function getIndices() {
  return cached('indices', 60_000, async () => {
    const yahooFinance = await yf();
    const symbols = ['^GSPC', '^IXIC', '^DJI', '^VIX'];
    const results = await Promise.allSettled(symbols.map(s => yahooFinance.quote(s)));
    return results.map((r, i) => {
      if (r.status === 'fulfilled') {
        const q = r.value;
        return {
          symbol: q.symbol,
          name: q.longName || q.shortName || symbols[i],
          price: q.regularMarketPrice ?? 0,
          change: q.regularMarketChange ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
        };
      }
      return { symbol: symbols[i], name: symbols[i], price: 0, change: 0, changePercent: 0 };
    });
  });
}

export function getNews(ticker: string) {
  return cached(`news:${ticker}`, 2 * 60_000, async () => {
    const yahooFinance = await yf();
    const result = await yahooFinance.search(ticker, { newsCount: 8, quotesCount: 0 });
    return (result.news || []).map((n: Record<string, unknown>) => ({
      title: n.title as string,
      publisher: n.publisher as string,
      link: n.link as string,
      publishedAt: n.providerPublishTime
        ? new Date((n.providerPublishTime as number) * 1000).toISOString()
        : new Date().toISOString(),
      thumbnail: (n.thumbnail as { resolutions?: { url: string }[] } | undefined)?.resolutions?.[0]?.url ?? null,
    }));
  });
}

export async function getQuoteSummary(ticker: string) {
  try {
    const yahooFinance = await yf();
    const result = await yahooFinance.quoteSummary(ticker, {
      modules: ['summaryDetail', 'defaultKeyStatistics', 'financialData'],
    });
    return result;
  } catch {
    return null;
  }
}
