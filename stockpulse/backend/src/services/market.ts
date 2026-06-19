import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function curlFetch(url: string): Promise<any> {
  const args: string[] = [
    '-s', '-L', '--max-time', '15',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    '-H', 'Accept: application/json, */*',
    '-H', 'Accept-Language: en-US,en;q=0.9',
    String(url)
  ];
  const curlCmd = process.platform === 'win32' ? 'curl.exe' : 'curl';
  const { stdout } = await execFileAsync(curlCmd, args, { maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(stdout);
}

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
    const data = await curlFetch(`https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`);
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error(`No quote data for ${ticker}`);
    
    const price = meta.regularMarketPrice ?? 0;
    const prev = meta.chartPreviousClose ?? 0;
    const change = price - prev;
    const changePercent = prev !== 0 ? (change / prev) * 100 : 0;
    
    return {
      ticker: meta.symbol ?? ticker,
      name: meta.longName || meta.shortName || ticker,
      price,
      previousClose: prev,
      change,
      changePercent,
      volume: meta.regularMarketVolume ?? 0,
      marketCap: 0,
      dayHigh: meta.regularMarketDayHigh ?? price,
      dayLow: meta.regularMarketDayLow ?? price,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? price,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? price,
      avgVolume: 0,
      pe: null,
      marketState: 'REGULAR',
    };
  });
}

export function getHistory(ticker: string, period: string = '1mo', interval: string = '1d') {
  return cached(`history:${ticker}:${period}:${interval}`, 5 * 60_000, async () => {
    // 5d is a range value, not a chart interval — exclude it
    const validIntervals = ['1m','2m','5m','15m','30m','60m','90m','1h','1d','1wk','1mo','3mo'];
    const normalizedInterval = String(interval || '1d').trim().toLowerCase();
    const resolvedInterval = normalizedInterval === '10m' ? '15m' : normalizedInterval;
    const safeInterval = validIntervals.includes(resolvedInterval) ? resolvedInterval : '1d';

    const data = await curlFetch(`https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${safeInterval}&range=${period}`);
    const result = data?.chart?.result?.[0];
    if (!result || !result.timestamp) return [];
    
    const quote = result.indicators?.quote?.[0] ?? {};
    return result.timestamp.map((t: number, i: number) => ({
      date: new Date(t * 1000).toISOString(),
      open: quote.open?.[i] ?? 0,
      high: quote.high?.[i] ?? 0,
      low: quote.low?.[i] ?? 0,
      close: quote.close?.[i] ?? 0,
      volume: quote.volume?.[i] ?? 0,
    })).filter((d: any) => d.close > 0);
  });
}

export async function searchTickers(query: string) {
  const data = await curlFetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`);
  return (data?.quotes || [])
    .filter((q: any) => q.isYahooFinance && q.quoteType === 'EQUITY')
    .map((q: any) => ({
      ticker: q.symbol,
      name: q.longname || q.shortname || q.symbol,
      exchange: q.exchange,
      type: q.quoteType,
    }));
}

export function getIndices() {
  return cached('indices', 60_000, async () => {
    const symbols = ['^GSPC', '^IXIC', '^DJI', '^VIX'];
    const results = await Promise.allSettled(symbols.map(s => getQuote(s)));
    return results.map((r, i) => {
      if (r.status === 'fulfilled') {
        const q = r.value;
        return {
          symbol: q.ticker,
          name: q.name,
          price: q.price,
          change: q.change,
          changePercent: q.changePercent,
        };
      }
      return { symbol: symbols[i], name: symbols[i], price: 0, change: 0, changePercent: 0 };
    });
  });
}

export function getNews(ticker: string) {
  return cached(`news:${ticker}`, 2 * 60_000, async () => {
    const data = await curlFetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(ticker)}&quotesCount=0&newsCount=8`);
    return (data?.news || []).map((n: any) => ({
      title: n.title,
      publisher: n.publisher,
      link: n.link,
      publishedAt: n.providerPublishTime
        ? new Date(n.providerPublishTime * 1000).toISOString()
        : new Date().toISOString(),
      thumbnail: n.thumbnail?.resolutions?.[0]?.url ?? null,
    }));
  });
}

export async function getQuoteSummary(ticker: string) {
  return null;
}
