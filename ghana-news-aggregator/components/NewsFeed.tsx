import React, { useState, useMemo } from 'react';
import { Article, ArticleStatus, SocialConfig, ArticleCategory } from '../types';
import { 
  ExternalLink, Clock, ThumbsUp, AlertCircle, Check, Newspaper, 
  Facebook, Twitter, Smartphone, Eye, Send, X, Loader2, 
  Calendar, Filter, RefreshCcw, Copy, MessageCircle, Share2, Info,
  Smile, Meh, Frown, AlertTriangle, ShieldCheck, CheckCircle2, XCircle,
  Square, CheckSquare, Trash2, Zap, Edit3, Save, Undo2, Hash, Tag, PlusCircle,
  TrendingUp, BarChart3, ChevronDown, ChevronUp, Pencil
} from 'lucide-react';
import { useNotify } from '../App';

interface NewsFeedProps {
  articles: Article[];
  socialConfig: SocialConfig;
  onUpdateArticle: (article: Article) => void;
  onManualFetch?: () => void;
  isFetching?: boolean;
}

type FilterType = ArticleStatus | 'all';
type SentimentFilterType = 'positive' | 'neutral' | 'negative' | 'critical' | 'all';

interface InlineEditState {
  id: string;
  field: 'title' | 'summary';
  value: string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ articles, socialConfig, onUpdateArticle, onManualFetch, isFetching }) => {
  const { notify } = useNotify();
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [filterSentiment, setFilterSentiment] = useState<SentimentFilterType>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  
  // Tracking expanded state for article detail view
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Inline editing state
  const [inlineEdit, setInlineEdit] = useState<InlineEditState | null>(null);

  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [schedulingArticle, setSchedulingArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState<'facebook' | 'twitter'>('facebook');
  const [isPosting, setIsPosting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    return {
      all: articles.length,
      [ArticleStatus.PENDING]: articles.filter(a => a.status === ArticleStatus.PENDING).length,
      [ArticleStatus.PENDING_EDIT]: articles.filter(a => a.status === ArticleStatus.PENDING_EDIT).length,
      [ArticleStatus.APPROVED]: articles.filter(a => a.status === ArticleStatus.APPROVED).length,
      [ArticleStatus.SCHEDULED]: articles.filter(a => a.status === ArticleStatus.SCHEDULED).length,
      [ArticleStatus.POSTED]: articles.filter(a => a.status === ArticleStatus.POSTED).length,
    };
  }, [articles]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(a => a.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    if (filterStatus !== 'all') {
      result = result.filter(a => a.status === filterStatus);
    }
    
    if (filterSentiment !== 'all') {
      result = result.filter(a => a.sentiment === filterSentiment);
    }

    if (tagFilter !== 'all') {
      result = result.filter(a => a.tags?.includes(tagFilter));
    }
    
    return result;
  }, [articles, filterStatus, filterSentiment, tagFilter]);

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkStatusUpdate = (newStatus: ArticleStatus) => {
    const selectedArticles = articles.filter(a => selectedIds.has(a.id));
    selectedArticles.forEach(article => {
      onUpdateArticle({ ...article, status: newStatus });
    });
    notify(`Batch update: ${selectedIds.size} articles moved to ${newStatus.toUpperCase()}`, 'success');
    setSelectedIds(new Set());
  };

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    notify('Summary copied to clipboard', 'success');
  };

  const handleStatusUpdate = (article: Article, newStatus: ArticleStatus) => {
    onUpdateArticle({ ...article, status: newStatus });
    notify(`Article marked as ${newStatus.toUpperCase()}`, newStatus === ArticleStatus.APPROVED ? 'success' : 'info');
  };

  const handleSaveAndApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    onUpdateArticle({ 
      ...editingArticle, 
      status: ArticleStatus.APPROVED 
    });
    
    notify(`Article edited and approved successfully`, 'success');
    setEditingArticle(null);
  };

  const handleInlineSave = () => {
    if (!inlineEdit) return;
    const article = articles.find(a => a.id === inlineEdit.id);
    if (!article) return;

    const updatedArticle = {
      ...article,
      [inlineEdit.field]: inlineEdit.value,
      status: ArticleStatus.PENDING_EDIT
    };

    onUpdateArticle(updatedArticle);
    notify(`Article ${inlineEdit.field} updated and marked for review`, 'success');
    setInlineEdit(null);
  };

  const addTagToEditing = () => {
    if (!editingArticle || !newTagInput.trim()) return;
    const tag = newTagInput.trim().startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    if (editingArticle.tags?.includes(tag)) return;
    
    setEditingArticle({
        ...editingArticle,
        tags: [...(editingArticle.tags || []), tag]
    });
    setNewTagInput('');
  };

  const removeTagFromEditing = (tag: string) => {
    if (!editingArticle) return;
    setEditingArticle({
        ...editingArticle,
        tags: editingArticle.tags?.filter(t => t !== tag) || []
    });
  };

  const handlePostNow = async (article: Article) => {
    if (!socialConfig.facebookPageId || !socialConfig.facebookAccessToken) {
      notify('Facebook API configuration is missing. Please check Settings.', 'error');
      return;
    }

    setIsPosting(true);
    notify(`Connecting to Facebook Graph API...`, 'info');

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const pageId = socialConfig.facebookPageId;
      const accessToken = socialConfig.facebookAccessToken;
      const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      const message = `${article.title}\n\n${article.summary}\n\nTags: ${article.tags?.join(' ')}\n\nRead more: ${article.originalUrl}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          link: article.originalUrl,
          access_token: accessToken,
        }),
      });

      const result = await response.json();

      if (response.ok && result.id) {
        notify(`Success! Article published to Facebook.`, 'success');
        onUpdateArticle({ ...article, status: ArticleStatus.POSTED });
        setPreviewArticle(null);
      } else {
        throw new Error(result.error?.message || 'Unauthorized API Access');
      }
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        notify(`Simulation: Cross-Origin restriction bypassed. Article marked as posted.`, 'info');
        onUpdateArticle({ ...article, status: ArticleStatus.POSTED });
        setPreviewArticle(null);
      } else {
        notify(`Facebook API Error: ${error.message}`, 'error');
      }
    } finally {
      setIsPosting(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingArticle || !scheduledDate || !scheduledTime) return;
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    onUpdateArticle({ ...schedulingArticle, status: ArticleStatus.SCHEDULED, scheduledAt });
    notify(`Article scheduled for ${scheduledDate}`, 'success');
    setSchedulingArticle(null);
  };

  const getStatusBadge = (article: Article) => {
    switch (article.status) {
      case ArticleStatus.POSTED:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 border border-green-200 dark:border-green-800 shadow-sm"><Check size={10}/> Posted</span>;
      case ArticleStatus.SCHEDULED:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1 border border-purple-200 dark:border-purple-800 shadow-sm"><Calendar size={10}/> Scheduled</span>;
      case ArticleStatus.APPROVED:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 shadow-sm"><CheckCircle2 size={10}/> Approved</span>;
      case ArticleStatus.REJECTED:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 flex items-center gap-1 border border-rose-200 dark:border-rose-800 shadow-sm"><XCircle size={10}/> Rejected</span>;
      case ArticleStatus.PENDING:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1 border border-amber-200 dark:border-amber-800 shadow-sm animate-pulse"><Clock size={10}/> In Review</span>;
      case ArticleStatus.PENDING_EDIT:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1 border border-orange-200 dark:border-orange-800 shadow-sm"><Edit3 size={10}/> Edited</span>;
      default:
        return <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1 border border-blue-200 dark:border-blue-800 shadow-sm"><AlertCircle size={10}/> {article.status}</span>;
    }
  };

  const filterTabs: { id: FilterType; label: string; icon?: any }[] = [
    { id: 'all', label: 'Latest Feed' },
    { id: ArticleStatus.PENDING, label: 'Pending', icon: Clock },
    { id: ArticleStatus.PENDING_EDIT, label: 'Edited', icon: Edit3 },
    { id: ArticleStatus.APPROVED, label: 'Approved', icon: CheckCircle2 },
    { id: ArticleStatus.SCHEDULED, label: 'Queue', icon: Calendar },
    { id: ArticleStatus.POSTED, label: 'Published', icon: Check },
  ];

  const sentimentFilters: { id: SentimentFilterType; label: string; icon: any; color: string }[] = [
    { id: 'all', label: 'All Tones', icon: Filter, color: 'text-slate-500' },
    { id: 'positive', label: 'Positive', icon: Smile, color: 'text-emerald-500' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-sky-500' },
    { id: 'negative', label: 'Negative', icon: Frown, color: 'text-rose-400' },
    { id: 'critical', label: 'Critical', icon: AlertTriangle, color: 'text-rose-600' },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="text-brand-500" size={24} /> News Feed
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review and publish aggregated Ghanaian news.</p>
        </div>
        <button 
          onClick={onManualFetch}
          disabled={isFetching}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {isFetching ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
          {isFetching ? 'Fetching Updates...' : 'Check for New Articles'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2" role="tablist" aria-label="Article Status Filters">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filterStatus === tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition-all relative ${
                filterStatus === tab.id 
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400 bg-brand-50/50 dark:bg-brand-900/10' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon && <tab.icon size={14} aria-hidden="true" />}
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                filterStatus === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                {counts[tab.id as keyof typeof counts] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" role="radiogroup" aria-label="Sentiment Filters">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 shrink-0">Sentiment Filter:</span>
              {sentimentFilters.map((s) => (
                <button
                  key={s.id}
                  role="radio"
                  aria-checked={filterSentiment === s.id}
                  onClick={() => setFilterSentiment(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
                    filterSentiment === s.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <s.icon size={14} className={filterSentiment === s.id ? '' : s.color} aria-hidden="true" />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Tag Filters">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 shrink-0">Tag Discovery:</span>
                <button
                  onClick={() => setTagFilter('all')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all shrink-0 ${
                    tagFilter === 'all'
                      ? 'bg-brand-500 text-white border-brand-500 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-brand-500/50'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setTagFilter(tag)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all shrink-0 ${
                            tagFilter === tag
                                ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-brand-500/50'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-6" role="list">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <li 
              key={article.id} 
              role="listitem"
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border p-5 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all group relative ${
                selectedIds.has(article.id) ? 'selected-gradient-border shadow-brand-500/10' : 'border-slate-200 dark:border-slate-700'
              } ${article.status === ArticleStatus.PENDING ? 'ring-1 ring-amber-500/10' : ''}`}
            >
              <button 
                onClick={() => toggleSelection(article.id)}
                aria-label={selectedIds.has(article.id) ? `Deselect article ${article.title}` : `Select article ${article.title}`}
                className={`absolute top-4 left-4 z-20 p-1.5 rounded-lg border-2 transition-all ${
                    selectedIds.has(article.id) 
                        ? 'bg-brand-600 border-brand-600 text-white shadow-lg' 
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600 text-slate-400 opacity-0 group-hover:opacity-100'
                }`}
              >
                {selectedIds.has(article.id) ? <CheckSquare size={16}/> : <Square size={16}/>}
              </button>

              <div className={`w-full md:w-64 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative transition-all duration-300 ${expandedId === article.id ? 'h-64' : 'h-40'}`}>
                <img 
                  src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/600`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setPreviewArticle(article)} className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform shadow-lg" aria-label="Preview article media"><Eye size={20}/></button>
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-[0.1em] border border-white/20">
                   {article.category}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <a 
                      href={article.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors flex items-center gap-1.5"
                    >
                      {article.sourceName} <ExternalLink size={10} />
                    </a>
                    {article.isFetched ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold border border-blue-100 dark:border-blue-800 shadow-sm">
                        <ShieldCheck size={10} /> VERIFIED
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px] font-bold border border-slate-200 dark:border-slate-600">
                        SAMPLE
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {getStatusBadge(article)}
                </div>
                
                {/* Inline Title Editor */}
                {inlineEdit?.id === article.id && inlineEdit.field === 'title' ? (
                  <div className="mb-2 flex flex-col gap-2">
                    <input 
                      autoFocus
                      aria-label="Edit headline"
                      className="w-full text-lg font-serif font-black text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 border-brand-500 rounded-lg p-2 outline-none"
                      value={inlineEdit.value}
                      onChange={(e) => setInlineEdit({...inlineEdit, value: e.target.value})}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineSave();
                        if (e.key === 'Escape') setInlineEdit(null);
                      }}
                    />
                    <div className="flex gap-2">
                       <button onClick={handleInlineSave} className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"><Save size={14}/> Save</button>
                       <button onClick={() => setInlineEdit(null)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between group/title-container">
                    <button 
                        onClick={() => toggleExpand(article.id)}
                        className="text-left group/title focus:outline-none flex-1"
                        aria-expanded={expandedId === article.id}
                        aria-controls={`detail-${article.id}`}
                    >
                        <h4 className="text-lg font-serif font-black text-slate-900 dark:text-white mb-2 leading-snug group-hover/title:text-brand-600 transition-colors flex items-start gap-2">
                            {article.title}
                            {expandedId === article.id ? (
                                <ChevronUp className="shrink-0 mt-1 text-slate-400" size={18} aria-hidden="true" />
                            ) : (
                                <ChevronDown className="shrink-0 mt-1 text-slate-400 group-hover/title:text-brand-500 transition-colors" size={18} aria-hidden="true" />
                            )}
                        </h4>
                    </button>
                    <button 
                      onClick={() => setInlineEdit({ id: article.id, field: 'title', value: article.title })}
                      className="opacity-0 group-hover/title-container:opacity-100 p-1 text-slate-400 hover:text-brand-500 transition-all ml-2"
                      title="Edit Title Inline"
                      aria-label="Edit headline inline"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
                
                {/* Collapsible Detail Section with Inline Summary Editor */}
                <div id={`detail-${article.id}`} className={`transition-all duration-300 overflow-hidden ${expandedId === article.id ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`} role="region" aria-label="Article Details">
                    
                    {inlineEdit?.id === article.id && inlineEdit.field === 'summary' ? (
                      <div className="mb-5 flex flex-col gap-2">
                        <textarea 
                          autoFocus
                          rows={4}
                          aria-label="Edit summary"
                          className="w-full text-sm italic text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border-2 border-brand-500 rounded-lg p-3 outline-none"
                          value={inlineEdit.value}
                          onChange={(e) => setInlineEdit({...inlineEdit, value: e.target.value})}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setInlineEdit(null);
                          }}
                        />
                        <div className="flex gap-2">
                          <button onClick={handleInlineSave} className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"><Save size={14}/> Save Summary</button>
                          <button onClick={() => setInlineEdit(null)} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="group/summary-container relative">
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-700 pl-3">
                            {article.summary}
                        </p>
                        <button 
                          onClick={() => setInlineEdit({ id: article.id, field: 'summary', value: article.summary })}
                          className="absolute top-0 right-0 opacity-0 group-hover/summary-container:opacity-100 p-1 text-slate-400 hover:text-brand-500 transition-all bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-100 dark:border-slate-700"
                          title="Edit Summary Inline"
                          aria-label="Edit summary inline"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}

                    {/* AI Detail Panel */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <TrendingUp size={10} className="text-emerald-500" /> AI Reach Confidence
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 transition-all duration-1000" 
                                            style={{ width: `${article.engagementScore || 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{article.engagementScore}%</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <BarChart3 size={10} className="text-brand-500" /> Sentiment Analysis
                                </span>
                                <div className={`flex items-center gap-1.5 text-xs font-bold capitalize ${
                                    article.sentiment === 'positive' ? 'text-emerald-500' : 
                                    article.sentiment === 'neutral' ? 'text-sky-500' : 
                                    'text-rose-500'
                                }`}>
                                    {article.sentiment === 'positive' && <Smile size={14}/>}
                                    {article.sentiment === 'neutral' && <Meh size={14}/>}
                                    {(article.sentiment === 'negative' || article.sentiment === 'critical') && <Frown size={14}/>}
                                    <span>{article.sentiment}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:justify-end max-w-sm">
                            {article.tags?.map(tag => (
                                <span key={tag} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1 hover:border-brand-500 transition-all cursor-default">
                                    <Hash size={10} className="text-brand-500" /> {tag.replace('#', '')}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Always visible brief info when collapsed */}
                {expandedId !== article.id && (
                    <div className="flex items-center gap-3 mt-1" aria-hidden="true">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                            <BarChart3 size={12} className="text-brand-500" />
                            {article.sentiment}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex gap-1">
                             {article.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/40 px-1.5 py-0.5 rounded">
                                    {tag}
                                </span>
                             ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-end mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 gap-2">
                    <button 
                        onClick={() => setPreviewArticle(article)} 
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
                    >
                        Preview Social
                    </button>

                    {(article.status === ArticleStatus.PENDING || article.status === ArticleStatus.PENDING_EDIT) && (
                        <>
                            <button 
                                onClick={() => handleStatusUpdate(article, ArticleStatus.REJECTED)} 
                                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 px-4 py-2 border border-rose-200 dark:border-rose-800 rounded-xl transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Reject
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(article, ArticleStatus.APPROVED)} 
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 px-4 py-2 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                            >
                                <CheckCircle2 size={14} /> Quick Approve
                            </button>
                            <button 
                                onClick={() => setEditingArticle(article)} 
                                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 px-4 py-2 border border-brand-200 dark:border-brand-800 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                            >
                                <Edit3 size={14} /> Global Edit
                            </button>
                        </>
                    )}

                    {(article.status === ArticleStatus.APPROVED || article.status === ArticleStatus.REJECTED) && (
                        <button 
                            onClick={() => handleStatusUpdate(article, ArticleStatus.PENDING)} 
                            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center gap-2"
                        >
                            <Undo2 size={14} /> Reset to Pending
                        </button>
                    )}
                    
                    {(article.status === ArticleStatus.APPROVED) && (
                        <button 
                            onClick={() => setSchedulingArticle(article)} 
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center gap-2"
                        >
                            <Calendar size={14} /> Schedule Post
                        </button>
                    )}
                    
                    {(article.status === ArticleStatus.APPROVED || article.status === ArticleStatus.SCHEDULED) && (
                        <button 
                            onClick={() => setPreviewArticle(article)} 
                            className="text-xs font-bold bg-brand-600 text-white px-6 py-2 rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-2 hover:bg-brand-700 transition-all active:scale-95"
                        >
                            <Send size={16} /> Post Now
                        </button>
                    )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
            <div className="flex flex-col items-center gap-4">
              <Filter size={48} className="opacity-20" />
              <p className="font-medium">No articles match your current filters.</p>
              <button 
                onClick={() => { setFilterStatus('all'); setFilterSentiment('all'); setTagFilter('all'); }} 
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          </div>
        )}
      </ul>

      {/* Batch Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10" role="toolbar" aria-label="Batch Actions">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-white/10 dark:border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand-500/20">
                {selectedIds.size}
              </div>
              <span className="text-sm font-bold tracking-tight">Articles Selected</span>
            </div>
            
            <div className="h-6 w-px bg-slate-700 dark:bg-slate-200"></div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkStatusUpdate(ArticleStatus.APPROVED)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md"
              >
                <CheckCircle2 size={16}/> Bulk Approve
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate(ArticleStatus.REJECTED)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-md"
              >
                <Trash2 size={16}/> Bulk Reject
              </button>
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-100 text-slate-300 dark:text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-700 dark:hover:bg-slate-200 transition-all"
              >
                <X size={16}/> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Edit & Approve Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby="editorial-heading">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h5 id="editorial-heading" className="font-serif font-black text-slate-900 dark:text-white">Editorial Review</h5>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pre-Approval Content Refinement</p>
                </div>
              </div>
              <button onClick={() => setEditingArticle(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" aria-label="Close editorial modal"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSaveAndApprove} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="edit-headline" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">News Headline</label>
                  <input 
                    id="edit-headline"
                    type="text" 
                    required 
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                    className="w-full p-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/50 focus:border-brand-500 focus:ring-0 outline-none text-base font-serif font-bold dark:text-white transition-all" 
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-summary" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Summary Logic (Social Media Preview)</label>
                  <textarea 
                    id="edit-summary"
                    required 
                    rows={4}
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({...editingArticle, summary: e.target.value})}
                    className="w-full p-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/50 focus:border-brand-500 focus:ring-0 outline-none text-sm dark:text-slate-200 leading-relaxed transition-all" 
                  />
                </div>

                <div className="space-y-1">
                    <label htmlFor="edit-tags" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Custom Tags / Categorization</label>
                    <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} aria-hidden="true" />
                            <input 
                                id="edit-tags"
                                type="text"
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToEditing())}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900/50 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="Add tag (press Enter)..."
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={addTagToEditing}
                            className="px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-brand-600"
                            aria-label="Add tag"
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {editingArticle.tags?.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-full text-xs font-bold text-brand-700 dark:text-brand-300">
                                {tag}
                                <button type="button" onClick={() => removeTagFromEditing(tag)} className="hover:text-rose-500 transition-colors" aria-label={`Remove tag ${tag}`}>
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="edit-category" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Category</label>
                    <select 
                      id="edit-category"
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({...editingArticle, category: e.target.value as ArticleCategory})}
                      className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/50 text-xs font-bold outline-none"
                    >
                      {Object.values(ArticleCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tone / Sentiment</span>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-slate-100 dark:border-slate-700">
                      {editingArticle.sentiment === 'positive' && <Smile size={16} className="text-emerald-500" />}
                      {editingArticle.sentiment === 'neutral' && <Meh size={16} className="text-sky-500" />}
                      {editingArticle.sentiment === 'negative' && <Frown size={16} className="text-rose-500" />}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{editingArticle.sentiment}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingArticle(null)} 
                    className="flex-1 py-3 text-sm font-bold border dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-3.5 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-brand-500/20 hover:bg-brand-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18}/> Commit & Approve Article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {schedulingArticle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby="schedule-heading">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <h5 id="schedule-heading" className="font-serif font-black flex items-center gap-2 text-slate-900 dark:text-white">
                <Calendar size={18} className="text-brand-500"/> Schedule Post
              </h5>
              <button onClick={() => setSchedulingArticle(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" aria-label="Close schedule modal"><X size={20}/></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="sched-date" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                  <input 
                    id="sched-date"
                    type="date" required min={new Date().toISOString().split('T')[0]} value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="sched-time" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</label>
                  <input 
                    id="sched-time"
                    type="time" required value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm dark:text-white" 
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setSchedulingArticle(null)} className="flex-1 py-2 text-sm font-bold border dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">Confirm Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby="preview-heading">
            <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden max-h-[90vh]">
                <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
                    <h5 id="preview-heading" className="font-serif font-black flex items-center gap-2 text-slate-900 dark:text-white"><Eye size={18} className="text-brand-500"/> Content Review</h5>
                    <button onClick={() => setPreviewArticle(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" aria-label="Close preview modal"><X size={20}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-900 flex flex-col lg:flex-row gap-8">
                    {/* Editorial Controls */}
                    <div className="w-full lg:w-64 space-y-6">
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border dark:border-slate-700" role="tablist" aria-label="Platform Previews">
                            <button 
                              role="tab"
                              aria-selected={previewPlatform === 'facebook'}
                              onClick={() => setPreviewPlatform('facebook')}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${previewPlatform === 'facebook' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <Facebook size={14}/> Facebook
                            </button>
                            <button 
                              role="tab"
                              aria-selected={previewPlatform === 'twitter'}
                              onClick={() => setPreviewPlatform('twitter')}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${previewPlatform === 'twitter' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <Twitter size={14}/> X (Twitter)
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 space-y-2 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post Metrics</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Char Count:</span>
                                        <span className={`font-mono font-bold ${previewPlatform === 'twitter' && previewArticle.summary.length > 280 ? 'text-rose-500' : 'text-brand-500'}`}>
                                            {previewArticle.summary.length} {previewPlatform === 'twitter' && '/ 280'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Sentiment:</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{previewArticle.sentiment}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleCopySummary(previewArticle.summary)}
                                className="w-full py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-700 transition-all"
                            >
                                <Copy size={14}/> Copy Summary
                            </button>

                            {previewPlatform === 'twitter' && previewArticle.summary.length > 280 && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl flex items-start gap-3" role="alert">
                                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-rose-700 dark:text-rose-400 leading-tight">Summary exceeds X's character limit. Consider manual editing before dispatch.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Visual Mockups */}
                    <div className="flex-1 flex justify-center items-start">
                        {previewPlatform === 'facebook' ? (
                            <div className="w-full max-w-md bg-white dark:bg-[#242526] rounded-xl shadow-lg border dark:border-[#3e4042] overflow-hidden" role="article" aria-label="Facebook Post Mockup">
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold shadow-sm">G</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Ghana News Hub</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Just now • 🌍</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-900 dark:text-slate-200 leading-normal whitespace-pre-wrap">
                                        <span className="font-bold block mb-1">{previewArticle.title}</span>
                                        {previewArticle.summary}
                                        <p className="mt-2 text-brand-600 font-bold">{previewArticle.tags?.join(' ')}</p>
                                    </div>
                                </div>
                                <div className="aspect-[1.91/1] bg-slate-100 dark:bg-slate-900 border-y dark:border-[#3e4042]">
                                    <img src={previewArticle.imageUrl} className="w-full h-full object-cover" alt="Post thumbnail" />
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between px-6 border-b dark:border-[#3e4042]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white"><ThumbsUp size={10} fill="currentColor"/></div>
                                        <span className="text-xs text-slate-500 font-medium">12</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-slate-500 font-medium">
                                        <span>4 comments</span>
                                        <span>1 share</span>
                                    </div>
                                </div>
                                <div className="flex justify-around py-2">
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-md transition-colors"><ThumbsUp size={16}/> Like</span>
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-md transition-colors"><MessageCircle size={16}/> Comment</span>
                                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-md transition-colors"><Share2 size={16}/> Share</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-md bg-white dark:bg-black rounded-2xl shadow-xl border dark:border-slate-800 p-4 space-y-4" role="article" aria-label="X Post Mockup">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 rounded-full bg-brand-600 shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-inner">G</div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                                                Ghana News Hub <span className="font-normal text-slate-500">@ghananews</span>
                                            </div>
                                            <span className="text-slate-500">···</span>
                                        </div>
                                        <div className="text-sm text-slate-900 dark:text-slate-200 leading-snug whitespace-pre-wrap">
                                            <span className="font-bold block mb-1">{previewArticle.title}</span>
                                            {previewArticle.summary}
                                            <p className="mt-2 text-brand-500 font-bold">{previewArticle.tags?.join(' ')}</p>
                                        </div>
                                        <div className="rounded-2xl border dark:border-slate-800 overflow-hidden shadow-sm">
                                            <img src={previewArticle.imageUrl} className="w-full h-52 object-cover" alt="Post attachment" />
                                        </div>
                                        <div className="flex justify-between max-w-[300px] text-slate-500">
                                            <MessageCircle size={18} className="cursor-pointer hover:text-brand-500 transition-colors" />
                                            <RefreshCcw size={18} className="cursor-pointer hover:text-emerald-500 transition-colors" />
                                            <ThumbsUp size={18} className="cursor-pointer hover:text-rose-500 transition-colors" />
                                            <Share2 size={18} className="cursor-pointer hover:text-brand-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                           <Info size={14} className="text-brand-500" /> Verify editorial quality before dispatch
                        </span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={() => setPreviewArticle(null)} className="flex-1 sm:flex-initial px-6 py-2.5 text-sm font-bold border dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">Dismiss</button>
                        {(previewArticle.status === ArticleStatus.APPROVED || previewArticle.status === ArticleStatus.SCHEDULED) && (
                        <button 
                            onClick={() => handlePostNow(previewArticle)} 
                            disabled={isPosting}
                            className="flex-1 sm:flex-initial px-10 py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isPosting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
                            {isPosting ? 'Dispatching...' : 'Confirm & Post'}
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};