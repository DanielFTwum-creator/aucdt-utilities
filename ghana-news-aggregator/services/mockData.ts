import { Article, ArticleCategory, ArticleStatus, LogEntry, AgentStatus, AuditLogEntry, NewsSource } from '../types';

export const generateMockArticles = (count: number): Article[] => {
  const sources = [
    'GhanaWeb', 'Graphic Online', 'MyJoyOnline', 'CitiNewsRoom', 
    'Pulse Ghana', 'JoyNews', 'Peace FM Online', 'Modern Ghana'
  ];
  const categories = Object.values(ArticleCategory);
  const sampleTags = ['#breaking', '#economy', '#ghana', '#election', '#local', '#africa', '#accra', '#kumasi', '#tech', '#policy'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `art-mock-${i}`,
    sourceId: `src-${i % sources.length}`,
    sourceName: sources[i % sources.length],
    title: `[Sample] Breaking News: Major Development in Ghana's ${categories[i % categories.length]} Sector - Update #${i + 1}`,
    summary: 'This is a sample article summary. Actual news fetched from the web will appear here once the aggregator starts scanning real sources via Search Grounding.',
    originalUrl: 'https://example.com/news/article-' + i,
    imageUrl: `https://picsum.photos/seed/${i + 100}/800/600`,
    publishedAt: new Date(Date.now() - i * 1800000).toISOString(), // staggered 30 mins
    category: categories[i % categories.length],
    status: i < 5 ? ArticleStatus.PENDING : (i < 10 ? ArticleStatus.SCHEDULED : ArticleStatus.POSTED),
    scheduledAt: i < 10 && i >= 5 ? new Date(Date.now() + (i * 600000)).toISOString() : undefined,
    sentiment: i % 4 === 0 ? 'positive' : (i % 4 === 1 ? 'neutral' : (i % 4 === 2 ? 'negative' : 'critical')),
    engagementScore: Math.floor(Math.random() * 100),
    isAiGenerated: i % 2 === 0,
    isFetched: i % 3 !== 0,
    tags: [sampleTags[i % sampleTags.length], sampleTags[(i + 2) % sampleTags.length]]
  }));
};

export const generateMockSources = (): NewsSource[] => [
  { id: 'src-1', name: 'GhanaWeb', url: 'https://www.ghanaweb.com/feed', type: 'rss', enabled: true, lastFetch: new Date().toISOString() },
  { id: 'src-2', name: 'Graphic Online', url: 'https://www.graphic.com.gh/feed', type: 'rss', enabled: true, lastFetch: new Date(Date.now() - 3600000).toISOString() },
  { id: 'src-3', name: 'MyJoyOnline', url: 'https://www.myjoyonline.com/feed', type: 'rss', enabled: true, lastFetch: new Date(Date.now() - 7200000).toISOString() },
  { id: 'src-4', name: 'CitiNewsRoom', url: 'https://citinewsroom.com/feed', type: 'rss', enabled: true, lastFetch: new Date(Date.now() - 1800000).toISOString() },
  { id: 'src-5', name: 'Pulse Ghana', url: 'https://www.pulse.com.gh/news', type: 'scraper', enabled: true, lastFetch: new Date(Date.now() - 500000).toISOString() },
  { id: 'src-6', name: 'JoyNews', url: 'https://www.joynews.com/api/v1', type: 'api', enabled: true, lastFetch: new Date(Date.now() - 1200000).toISOString() },
  { id: 'src-7', name: 'Peace FM Online', url: 'https://www.peacefmonline.com/rss', type: 'rss', enabled: true, lastFetch: new Date(Date.now() - 900000).toISOString() },
  { id: 'src-8', name: 'Modern Ghana', url: 'https://www.modernghana.com/rss', type: 'rss', enabled: true, lastFetch: new Date(Date.now() - 4500000).toISOString() },
];

export const initialAgentStatus: AgentStatus = {
  state: 'idle',
  lastRun: new Date(Date.now() - 5 * 60000).toISOString(),
  nextRun: new Date(Date.now() + 10 * 60000).toISOString(),
  articlesProcessedToday: 412,
  postsPublishedToday: 34,
  successRate: 99.2
};

export const generateMockLogs = (): LogEntry[] => [
  { 
    id: '1', 
    timestamp: new Date().toISOString(), 
    level: 'info', 
    message: 'System initialized successfully with 8 news vectors.', 
    module: 'SYSTEM',
    details: { version: '3.0.0', node: 'nexus-edge-01', active_sources: 8 }
  },
  { 
    id: '2', 
    timestamp: new Date(Date.now() - 10000).toISOString(), 
    level: 'success', 
    message: 'Batch sync complete for Peace FM & JoyNews', 
    module: 'AGGREGATOR',
    details: {
      sources: ['Peace FM', 'JoyNews'],
      newItems: 14
    }
  },
  { 
    id: '3', 
    timestamp: new Date(Date.now() - 20000).toISOString(), 
    level: 'info', 
    message: 'Vision model synthesized editorial assets for 5 articles', 
    module: 'AI_PROCESSOR',
    details: {
      model: 'gemini-2.5-flash-image',
      resolution: '1024x576'
    }
  }
];

export const generateMockAuditLogs = (): AuditLogEntry[] => [
    { id: 'aud-1', timestamp: new Date().toISOString(), action: 'SYSTEM_EXPANSION', user: 'system', details: 'Added 4 high-authority news vectors to baseline', status: 'success' },
    { id: 'aud-2', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'LOGIN', user: 'admin', details: 'Session established', status: 'success' },
];