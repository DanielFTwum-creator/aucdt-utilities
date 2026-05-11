let _yf: any = null;
async function yf() {
  if (_yf === null) {
    const mod = await import('yahoo-finance2');
    const YF = (mod as any).default ?? mod;
    _yf = new YF({ suppressNotices: ['yahooSurvey'] });
  }
  return _yf;
}

export async function getQuote(ticker: string) {
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
}

export async function getHistory(ticker: string, period: string = '1mo', interval: string = '1d') {
  const yahooFinance = await yf();
  const validIntervals = ['1m','2m','5m','15m','30m','60m','90m','1h','1d','5d','1wk','1mo','3mo'];
  const normalizedInterval = String(interval || '1d').trim().toLowerCase();
  // Yahoo Finance has no 10m interval — map to nearest available
  const resolvedInterval = normalizedInterval === '10m' ? '15m' : normalizedInterval;
  const safeInterval = validIntervals.includes(resolvedInterval) ? resolvedInterval : '1d';

  const periodMap: Record<string, Date> = {
    '1d': new Date(Date.now() - 86400000),
    '2d': new Date(Date.now() - 2 * 86400000),
    '5d': new Date(Date.now() - 5 * 86400000),
    '1mo': new Date(Date.now() - 30 * 86400000),
    '3mo': new Date(Date.now() - 90 * 86400000),
    '6mo': new Date(Date.now() - 180 * 86400000),
    '1y': new Date(Date.now() - 365 * 86400000),
    '2y': new Date(Date.now() - 730 * 86400000),
  };
  const period1 = periodMap[period] ?? periodMap['1mo'];

  const result = await yahooFinance.historical(ticker, {
    period1,
    interval: safeInterval,
  });

  return (result as any[]).map((d: any) => ({
    date: d.date.toISOString(),
    open: d.open ?? 0,
    high: d.high ?? 0,
    low: d.low ?? 0,
    close: d.close ?? 0,
    volume: d.volume ?? 0,
  }));
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

export async function getIndices() {
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
}

export async function getNews(ticker: string) {
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
