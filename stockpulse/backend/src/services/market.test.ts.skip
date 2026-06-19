import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFakeInstance() {
  return {
    quote: vi.fn().mockResolvedValue({
      symbol: 'MSFT',
      longName: 'Microsoft Corporation',
      regularMarketPrice: 420,
      regularMarketPreviousClose: 415,
      regularMarketChange: 5,
      regularMarketChangePercent: 1.2,
      regularMarketVolume: 20000000,
      marketCap: 3e12,
      regularMarketDayHigh: 422,
      regularMarketDayLow: 418,
      fiftyTwoWeekHigh: 450,
      fiftyTwoWeekLow: 300,
      averageDailyVolume3Month: 25000000,
      trailingPE: 35,
      marketState: 'CLOSED',
    }),
    search: vi.fn().mockResolvedValue({
      quotes: [],
      news: [
        {
          uuid: 'abc',
          title: 'MSFT hits record',
          publisher: 'Reuters',
          link: 'https://example.com/msft',
          providerPublishTime: 1700000000,
          type: 'STORY',
          thumbnail: null,
        },
      ],
    }),
    historical: vi.fn().mockResolvedValue([
      { date: new Date('2024-01-02'), open: 410, high: 425, low: 408, close: 420, volume: 18000000 },
    ]),
    quoteSummary: vi.fn().mockResolvedValue({ summaryDetail: {}, defaultKeyStatistics: {} }),
  };
}

// ─── yahoo-finance2 v3 instantiation ─────────────────────────────────────────

describe('market service – yahoo-finance2 v3 instantiation', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('instantiates YahooFinance as a class (new), not as a singleton', async () => {
    const fakeInstance = makeFakeInstance();
    const FakeClass = vi.fn(function () { return fakeInstance; });

    vi.doMock('yahoo-finance2', () => ({ default: FakeClass }));

    const { getQuote } = await import('./market');
    await getQuote('MSFT');

    expect(FakeClass).toHaveBeenCalledOnce();
    expect(FakeClass).toHaveBeenCalledWith(
      expect.objectContaining({ suppressNotices: expect.arrayContaining(['yahooSurvey']) }),
    );
  });

  it('reuses the same instance across multiple calls (singleton cache)', async () => {
    const fakeInstance = makeFakeInstance();
    const FakeClass = vi.fn(function () { return fakeInstance; });
    vi.doMock('yahoo-finance2', () => ({ default: FakeClass }));

    const { getQuote } = await import('./market');
    await getQuote('AAPL');
    await getQuote('TSLA');

    expect(FakeClass).toHaveBeenCalledOnce();
  });

  it('calls instance.quote() — not a static method on the class', async () => {
    const fakeInstance = makeFakeInstance();
    const FakeClass = vi.fn(function () { return fakeInstance; });
    vi.doMock('yahoo-finance2', () => ({ default: FakeClass }));

    const { getQuote } = await import('./market');
    const result = await getQuote('MSFT');

    expect(fakeInstance.quote).toHaveBeenCalledWith('MSFT');
    expect(result.ticker).toBe('MSFT');
    expect(result.price).toBe(420);
  });
});

// ─── getQuote ─────────────────────────────────────────────────────────────────

describe('getQuote', () => {
  beforeEach(() => { vi.resetModules(); });

  it('maps Yahoo Finance fields to the expected shape', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getQuote } = await import('./market');
    const q = await getQuote('MSFT');

    expect(q).toMatchObject({
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      price: 420,
      previousClose: 415,
      change: 5,
      changePercent: 1.2,
      marketState: 'CLOSED',
    });
  });

  it('falls back to 0 for missing numeric fields', async () => {
    const fakeInstance = makeFakeInstance();
    fakeInstance.quote = vi.fn().mockResolvedValue({
      symbol: 'XYZ',
      regularMarketPrice: undefined,
      regularMarketPreviousClose: null,
      regularMarketChange: undefined,
      regularMarketChangePercent: undefined,
      regularMarketVolume: undefined,
      marketCap: undefined,
    });
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getQuote } = await import('./market');
    const q = await getQuote('XYZ');

    expect(q.price).toBe(0);
    expect(q.previousClose).toBe(0);
    expect(q.change).toBe(0);
  });
});

// ─── getNews ──────────────────────────────────────────────────────────────────

describe('getNews', () => {
  beforeEach(() => { vi.resetModules(); });

  it('returns news items mapped to the expected shape', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getNews } = await import('./market');
    const news = await getNews('MSFT');

    expect(news).toHaveLength(1);
    expect(news[0]).toMatchObject({
      title: 'MSFT hits record',
      publisher: 'Reuters',
      link: 'https://example.com/msft',
    });
    expect(news[0].publishedAt).toBe(new Date(1700000000 * 1000).toISOString());
  });

  it('passes newsCount and quotesCount options to search', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getNews } = await import('./market');
    await getNews('AAPL');

    expect(fakeInstance.search).toHaveBeenCalledWith(
      'AAPL',
      expect.objectContaining({ newsCount: expect.any(Number) }),
    );
  });

  it('returns empty array when news field is absent', async () => {
    const fakeInstance = makeFakeInstance();
    fakeInstance.search = vi.fn().mockResolvedValue({ quotes: [] }); // no news key
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getNews } = await import('./market');
    expect(await getNews('MSFT')).toEqual([]);
  });
});

// ─── interval mapping ─────────────────────────────────────────────────────────

describe('getHistory – interval mapping', () => {
  beforeEach(() => { vi.resetModules(); });

  it('maps 10m interval to 15m (Yahoo Finance has no 10m)', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getHistory } = await import('./market');
    await getHistory('AAPL', '1d', '10m');

    expect(fakeInstance.historical).toHaveBeenCalledWith(
      'AAPL',
      expect.objectContaining({ interval: '15m' }),
    );
  });

  it('passes valid intervals through unchanged', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getHistory } = await import('./market');
    await getHistory('AAPL', '1d', '5m');

    expect(fakeInstance.historical).toHaveBeenCalledWith(
      'AAPL',
      expect.objectContaining({ interval: '5m' }),
    );
  });

  it('falls back to 1d for unknown intervals', async () => {
    const fakeInstance = makeFakeInstance();
    vi.doMock('yahoo-finance2', () => ({ default: vi.fn(function () { return fakeInstance; }) }));

    const { getHistory } = await import('./market');
    await getHistory('AAPL', '1d', 'bogus');

    expect(fakeInstance.historical).toHaveBeenCalledWith(
      'AAPL',
      expect.objectContaining({ interval: '1d' }),
    );
  });
});
