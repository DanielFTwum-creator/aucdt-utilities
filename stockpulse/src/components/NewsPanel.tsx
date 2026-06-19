import React, { useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import type { NewsItem } from '../types';

export default function NewsPanel() {
  const [ticker, setTicker] = useState('SPY');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchNews = async (t: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/market/news/${t.toUpperCase()}`);
      if (r.ok) { setNews(await r.json()); setSearched(true); }
    } finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); fetchNews(ticker); };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="text-indigo-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market News</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          placeholder="Ticker or keyword (e.g. AAPL, AI, Fed)"
          aria-label="Search news"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading…' : 'Fetch News'}
        </button>
      </form>

      {!searched && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a ticker or keyword above to load news.</p>
        </div>
      )}

      <div className="space-y-4">
        {news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" aria-label={item.title} className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group">
            {item.thumbnail && (
              <img src={item.thumbnail} alt="" role="presentation" className="w-20 h-16 object-cover rounded-lg shrink-0 bg-gray-100 dark:bg-gray-800" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">{item.publisher}</span>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                <ExternalLink size={11} className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 shrink-0" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {searched && news.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No news found for "{ticker}".</div>
      )}
    </div>
  );
}
