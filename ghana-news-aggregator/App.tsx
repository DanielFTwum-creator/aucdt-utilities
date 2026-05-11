import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AgentMonitor } from './components/AgentMonitor';
import { NewsFeed } from './components/NewsFeed';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { TestRunner } from './components/TestRunner';
import { DocumentationViewer } from './components/DocumentationViewer';
import { RefreshStatus } from './components/RefreshStatus';
import { AgentStatus, Article, LogEntry, Theme, User, AuditLogEntry, NewsSource, SocialConfig, ArticleStatus, ArticleCategory } from './types';
import { generateMockArticles, generateMockLogs, generateMockAuditLogs, initialAgentStatus, generateMockSources } from './services/mockData';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Notification Context ---
interface NotificationContextType {
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType>({ notify: () => {} });

export const useNotify = () => useContext(NotificationContext);

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is-auth') === 'true';
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('app-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginError, setLoginError] = useState('');

  // Configurable Admin Password
  const getAdminPassword = useCallback(() => {
    return localStorage.getItem('admin-password') || 'admin123';
  }, []);

  // Application State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme') as Theme;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Social Configuration state
  const [socialConfig, setSocialConfig] = useState<SocialConfig>(() => {
    const saved = localStorage.getItem('app-social-config');
    return saved ? JSON.parse(saved) : { facebookPageId: '', facebookAccessToken: '', autoPostEnabled: false };
  });

  // Agent Status Persistence
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(() => {
    const saved = localStorage.getItem('aggregator-agent-status');
    return saved ? JSON.parse(saved) : initialAgentStatus;
  });

  // Persistent Data Loading - INCREASED TO 24 FOR INITIAL POPULATION
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('aggregator-articles');
    if (saved) {
      try {
        const parsed: Article[] = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error("Error parsing articles from local storage", e);
      }
    }
    return generateMockArticles(24);
  });

  const [newsSources, setNewsSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('aggregator-sources');
    return saved ? JSON.parse(saved) : generateMockSources();
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('aggregator-logs');
    return saved ? JSON.parse(saved) : generateMockLogs();
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('aggregator-audit');
    return saved ? JSON.parse(saved) : generateMockAuditLogs();
  });

  const [docBundle, setDocBundle] = useState<Record<string, string>>({});

  const [isFetchingManually, setIsFetchingManually] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('aggregator-articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('aggregator-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('aggregator-sources', JSON.stringify(newsSources));
  }, [newsSources]);

  useEffect(() => {
    localStorage.setItem('aggregator-audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aggregator-agent-status', JSON.stringify(agentStatus));
  }, [agentStatus]);

  // Toast Helper
  const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Initialize Documentation Bundle
  useEffect(() => {
    const docsToFetch = [
      { id: 'srs', path: '/docs/SRS_GhanaNewsAggregator_Final.md' },
      { id: 'admin', path: '/docs/guides/administrator-guide.md' },
      { id: 'deploy', path: '/docs/guides/deployment-guide.md' },
      { id: 'test', path: '/docs/guides/testing-guide.md' }
    ];

    const loadDocs = async () => {
      const bundle: Record<string, string> = {};
      for (const doc of docsToFetch) {
        try {
          const res = await fetch(doc.path);
          if (res.ok) {
            bundle[doc.id] = await res.text();
          }
        } catch (e) {
          console.error(`Failed to load doc: ${doc.id}`);
        }
      }
      setDocBundle(bundle);
    };

    loadDocs();
  }, []);

  // Theme Handling
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    localStorage.setItem('app-theme', theme);
    root.classList.remove('dark');
    body.classList.remove('high-contrast');
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'high-contrast') {
      root.classList.add('dark');
      body.classList.add('high-contrast');
    }
  }, [theme]);

  // Social Config Persistence
  useEffect(() => {
    localStorage.setItem('app-social-config', JSON.stringify(socialConfig));
  }, [socialConfig]);

  // --- Audit Log Function ---
  const createAuditLog = useCallback((action: string, details: string, status: 'success' | 'failure' = 'success') => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      user: user?.username || 'system',
      details,
      status
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, [user]);

  // --- AI News Generation & Visual Synthesis Logic ---
  const processNewArticlesFromSource = async (source: NewsSource) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setNewsSources(prev => prev.map(s => s.id === source.id ? { ...s, lastFetch: new Date().toISOString() } : s));

      const searchPrompt = `Search specifically for exactly 12 unique, latest news stories from ${source.name} (at ${source.url}). 
      Ensure you discover exactly 12 items.
      For each story, identify:
      1. The official headline
      2. A 2-sentence summary
      3. The specific URL for that article
      4. The category (Politics, Business, Sports, Entertainment, Technology, or General)
      5. The sentiment (positive, neutral, negative, or critical)
      6. Up to 3 relevant short hashtags or tags (without # symbol)
      7. A direct URL to the primary image if found in the search context.`;

      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const structPrompt = `CRITICAL: Do not omit any items. Convert all found news stories into a valid JSON array of objects. 
      Input text:
      ${searchResponse.text}
      
      Each object must have these keys: title, summary, originalUrl, category, sentiment, tags (as string array), sourceImageUrl (string or null).
      Return ONLY the JSON array.`;

      const structResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: structPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                originalUrl: { type: Type.STRING },
                category: { type: Type.STRING },
                sentiment: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                sourceImageUrl: { type: Type.STRING, nullable: true }
              },
              required: ['title', 'summary', 'originalUrl', 'category', 'sentiment', 'tags']
            }
          }
        }
      });

      let results: any[] = [];
      try {
        results = JSON.parse(structResponse.text || '[]');
      } catch (e) {
        console.error("JSON Parse Error on structured articles:", e);
        return 0;
      }

      let count = 0;
      let duplicateCount = 0;
      for (const item of results) {
        const isDuplicate = articles.some(a => a.title.toLowerCase() === (item.title || "").toLowerCase() || a.originalUrl === item.originalUrl);
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        let finalImageUrl = item.sourceImageUrl;
        let imageStrategy = 'source_original';

        // Only generate if no source image exists or the source image is not a valid URL format
        if (!finalImageUrl || !finalImageUrl.startsWith('http')) {
          imageStrategy = 'ai_generated';
          finalImageUrl = `https://picsum.photos/seed/${item.title.length + Math.random()}/1200/800`; // Ultimate fallback
          
          try {
            const imagePrompt = `High-quality editorial photo journalism for a Ghanaian news article.
            TOPIC: ${item.title}
            CONTEXT: ${item.summary}
            CATEGORY: ${item.category}
            VISUAL STYLE: Professional news photography from Accra, Ghana. Highly realistic, sharp focus, relevant subjects. 
            RESTRICTIONS: NO text, NO watermarks, NO overlays, NO graphics.`;

            const imageResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [{ text: imagePrompt }] },
              config: { 
                imageConfig: { aspectRatio: "16:9" } 
              }
            });

            for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData) {
                finalImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
              }
            }
          } catch (imgErr) {
            console.warn("Visual synthesis failed, using library fallback.", imgErr);
            imageStrategy = 'library_fallback';
          }
        }

        const newArticle: Article = {
          id: `art-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          sourceId: source.id,
          sourceName: source.name,
          title: item.title,
          summary: item.summary,
          originalUrl: item.originalUrl || source.url,
          imageUrl: finalImageUrl,
          publishedAt: new Date().toISOString(),
          category: (item.category as ArticleCategory) || ArticleCategory.GENERAL,
          status: ArticleStatus.PENDING,
          sentiment: item.sentiment || 'neutral',
          engagementScore: Math.floor(Math.random() * 60) + 20,
          isAiGenerated: imageStrategy === 'ai_generated',
          isFetched: true,
          tags: item.tags?.map((t: string) => t.startsWith('#') ? t : `#${t}`) || []
        };

        setArticles(prev => [newArticle, ...prev]);
        count++;
      }

      const successLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: count > 0 ? 'success' : 'info',
        message: `Aggregator: Discovered ${results.length} stories. Ingested ${count} new items. Skipped ${duplicateCount} duplicates.`,
        module: 'AI_PROCESSOR',
        details: {
          source: source.name,
          totalFound: results.length,
          newItems: count,
          duplicates: duplicateCount,
          items: results.map(r => r.title)
        }
      };
      setLogs(curr => [...curr.slice(-99), successLog]);

      return count;
    } catch (error) {
      console.error("Aggregation Error:", error);
      const errLog: LogEntry = {
        id: `log-${Date.now()}-err`,
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `Aggregator: Intelligence engine failed to fetch news from ${source.name}.`,
        module: 'AI_PROCESSOR'
      };
      setLogs(curr => [...curr.slice(-99), errLog]);
      return 0;
    }
  };

  const handleManualFetch = async () => {
    const enabledSources = newsSources.filter(s => s.enabled);
    if (enabledSources.length === 0) {
      notify("No enabled news sources found. Check settings.", "error");
      return;
    }

    setIsFetchingManually(true);
    setAgentStatus(prev => ({ ...prev, state: 'fetching', activeTask: 'Deep-scanning sources via Search Grounding...' }));
    notify(`Aggregator: Initializing batch fetch for ${enabledSources.length} sources...`, "info");

    let newlyFetchedCount = 0;
    for (const source of enabledSources) {
      setAgentStatus(prev => ({ ...prev, activeTask: `Searching ${source.name}...` }));
      const foundCount = await processNewArticlesFromSource(source);
      newlyFetchedCount += foundCount;
    }

    if (newlyFetchedCount > 0) {
      notify(`Aggregation Complete: Discovered ${newlyFetchedCount} new unique articles.`, "success");
      setAgentStatus(prev => ({ 
        ...prev, 
        state: 'idle', 
        activeTask: undefined,
        articlesProcessedToday: prev.articlesProcessedToday + newlyFetchedCount,
        lastRun: new Date().toISOString()
      }));
    } else {
      notify("Aggregation Complete: No new unique content found.", "info");
      setAgentStatus(prev => ({ ...prev, state: 'idle', activeTask: undefined }));
    }
    
    setIsFetchingManually(false);
  };

  // Agent Autonomous Cycle
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(async () => {
      if (isFetchingManually) return;

      setAgentStatus(prev => {
        const enabledSources = newsSources.filter(s => s.enabled);
        const scheduledQueue = articles.filter(a => a.status === ArticleStatus.SCHEDULED);
        const now = new Date();
        const articleToPublish = scheduledQueue.find(a => a.scheduledAt && new Date(a.scheduledAt) <= now);

        let nextState = prev.state;
        let nextTask = prev.activeTask;

        if (prev.state === 'idle') {
          if (articleToPublish) {
            nextState = 'publishing';
            nextTask = `Deploying scheduled post: ${articleToPublish.title}`;
          } else if (Math.random() > 0.95 && enabledSources.length > 0) {
            nextState = 'fetching';
            nextTask = 'Autonomous scan initiated...';
          }
        } else if (prev.state === 'fetching') {
          nextState = 'processing';
          nextTask = 'Grounding search results...';
        } else if (prev.state === 'processing') {
          nextState = 'idle';
          nextTask = undefined;
        } else if (prev.state === 'publishing') {
          nextState = 'idle';
          nextTask = undefined;
        }

        if (nextState === 'processing' && prev.state === 'fetching') {
           const sourceToUse = enabledSources[Math.floor(Math.random() * enabledSources.length)];
           if (sourceToUse) {
             processNewArticlesFromSource(sourceToUse).then(count => {
               if (count > 0) {
                 setAgentStatus(curr => ({
                   ...curr,
                   articlesProcessedToday: curr.articlesProcessedToday + count,
                   lastRun: new Date().toISOString()
                 }));
               }
             });
           }
        }

        if (nextState === 'publishing' && articleToPublish) {
            const publishLog: LogEntry = {
                id: `pub-${Date.now()}`,
                timestamp: new Date().toISOString(),
                level: 'success',
                message: `Publisher: Autonomous deployment of scheduled article successful.`,
                module: 'PUBLISHER'
            };
            setLogs(curr => [...curr.slice(-99), publishLog]);
            setArticles(curr => curr.map(a => a.id === articleToPublish.id ? { ...a, status: ArticleStatus.POSTED } : a));
            createAuditLog('AUTO_POST_PUBLISHED', `Agent deployed scheduled content: ${articleToPublish.title}`);
            notify(`Autonomous Deployment: ${articleToPublish.title}`, 'success');
            
            return { 
                ...prev, 
                state: nextState, 
                activeTask: nextTask,
                postsPublishedToday: prev.postsPublishedToday + 1 
            };
        }

        return { ...prev, state: nextState, activeTask: nextTask };
      });
    }, 15000); 

    return () => clearInterval(interval);
  }, [isAuthenticated, newsSources, isFetchingManually, articles]);

  const handleLogin = (password: string) => {
    const correctPassword = getAdminPassword();
    if (password === correctPassword) {
      const newUser: User = { username: 'admin', role: 'admin', lastLogin: new Date().toISOString() };
      setUser(newUser);
      setIsAuthenticated(true);
      setLoginError('');
      localStorage.setItem('is-auth', 'true');
      localStorage.setItem('app-user', JSON.stringify(newUser));
      createAuditLog('AUTH_LOGIN', 'User admin authenticated successfully');
      notify('Welcome back, Administrator', 'success');
    } else {
      setLoginError('Invalid credentials. Access denied.');
      createAuditLog('AUTH_LOGIN_FAILED', 'Failed login attempt', 'failure');
      notify('Authentication failure', 'error');
    }
  };

  const handleLogout = () => {
    createAuditLog('AUTH_LOGOUT', `User ${user?.username} logged out`);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('is-auth');
    localStorage.removeItem('app-user');
    notify('Signed out successfully');
  };

  const handlePasswordChange = (oldPass: string, name: string, newPass: string) => {
    const current = getAdminPassword();
    if (oldPass !== current) {
      notify("Incorrect current password", "error");
      createAuditLog("SEC_PASS_CHANGE", "Failed password change attempt: wrong current password", "failure");
      return;
    }
    localStorage.setItem('admin-password', newPass);
    notify("Password updated successfully", "success");
    createAuditLog("SEC_PASS_CHANGE", "Admin password successfully updated");
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    createAuditLog('UI_THEME_CHANGE', `System theme transitioned to ${newTheme.toUpperCase()}`);
    notify(`Applied ${newTheme} mode`);
  };

  const handleAddSource = (sourceData: Omit<NewsSource, 'id'>) => {
    const newSource: NewsSource = { ...sourceData, id: `src-${Date.now()}` };
    setNewsSources(prev => [...prev, newSource]);
    createAuditLog('SOURCE_CREATE', `Added: ${newSource.name}`);
    notify(`New source added: ${newSource.name}`, 'success');
  };

  const handleUpdateSource = (updatedSource: NewsSource) => {
    setNewsSources(prev => prev.map(s => s.id === updatedSource.id ? updatedSource : s));
    createAuditLog('SOURCE_UPDATE', `Updated: ${updatedSource.name} configuration`);
    notify(`Configuration updated: ${updatedSource.name}`, 'success');
  };

  const handleDeleteSource = (id: string) => {
    const source = newsSources.find(s => s.id === id);
    setNewsSources(prev => prev.filter(s => s.id !== id));
    createAuditLog('SOURCE_DELETE', `Removed: ${source?.name || id}`);
    notify(`Source deleted`, 'info');
  };

  const handleSocialConfigChange = (newConfig: SocialConfig) => {
    setSocialConfig(newConfig);
    createAuditLog('SOCIAL_CONFIG_UPDATE', 'Updated Facebook Graph API integration settings');
    notify('Social integration updated', 'success');
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    
    if (updatedArticle.status === ArticleStatus.APPROVED) {
      createAuditLog('ARTICLE_APPROVED', `Editorial: Approved "${updatedArticle.title}" for distribution.`);
    }
    if (updatedArticle.status === ArticleStatus.REJECTED) {
      createAuditLog('ARTICLE_REJECTED', `Editorial: Rejected "${updatedArticle.title}" - moved to archive.`);
    }
    if (updatedArticle.status === ArticleStatus.SCHEDULED) {
      createAuditLog('POST_SCHEDULED', `Scheduled: ${updatedArticle.title} for ${updatedArticle.scheduledAt}`);
    }
    if (updatedArticle.status === ArticleStatus.POSTED) {
      setAgentStatus(prev => ({ ...prev, postsPublishedToday: prev.postsPublishedToday + 1 }));
      createAuditLog('POST_PUBLISHED', `Manually triggered: ${updatedArticle.title}`);
    }
    if (updatedArticle.status === ArticleStatus.PENDING_EDIT) {
      createAuditLog('ARTICLE_EDITED', `Editorial: Refined headline/summary for "${updatedArticle.title}"`);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard status={agentStatus} articles={articles} />;
      case 'agent': return <AgentMonitor status={agentStatus} logs={logs} articles={articles} />;
      case 'feed': 
        return <NewsFeed 
          articles={articles} 
          socialConfig={socialConfig} 
          onUpdateArticle={handleUpdateArticle} 
          onManualFetch={handleManualFetch}
          isFetching={isFetchingManually}
        />;
      case 'settings':
        return <Settings 
            currentTheme={theme} 
            onThemeChange={handleThemeChange} 
            auditLogs={auditLogs}
            newsSources={newsSources}
            onAddSource={handleAddSource}
            onUpdateSource={handleUpdateSource}
            onDeleteSource={handleDeleteSource}
            socialConfig={socialConfig}
            onSocialConfigChange={handleSocialConfigChange}
            onPasswordChange={handlePasswordChange}
            onForceSyncSource={processNewArticlesFromSource}
        />;
      case 'test': return <TestRunner />;
      case 'docs': return <DocumentationViewer bundle={docBundle} />;
      case 'refresh': return <RefreshStatus onBack={() => setActiveTab('dashboard')} />;
      default: return <div className="p-10 text-center text-slate-500">Initializing...</div>;
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Layout 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          createAuditLog('UI_NAV', `Navigated to ${tab}`);
        }} 
        onLogout={handleLogout} 
        username={user?.username || 'Admin'}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      >
        <div id="main-content" tabIndex={-1} className="outline-none" role="region" aria-label="Main Application Content">
          {renderContent()}
        </div>

        <div 
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
          aria-live="polite"
          aria-relevant="additions"
        >
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`
                pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right-10 duration-300
                ${toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' : ''}
                ${toast.type === 'error' ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200' : ''}
                ${toast.type === 'info' ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white' : ''}
              `}
              role="alert"
            >
              {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-500" aria-hidden="true" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-rose-500" aria-hidden="true" />}
              {toast.type === 'info' && <Info size={18} className="text-brand-500" aria-hidden="true" />}
              <span className="text-sm font-medium">{toast.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                aria-label="Close notification"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </Layout>
    </NotificationContext.Provider>
  );
};

export default App;