import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import { Printer, Download, Search, List, ChevronRight, FileText, Share2, BookOpen, Shield, ShieldCheck, Terminal } from 'lucide-react';

interface DocumentationViewerProps {
  bundle: Record<string, string>;
}

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

const DOC_METADATA = [
  { id: 'srs', title: 'Final System SRS', icon: FileText, desc: 'Project architecture and formal requirements.' },
  { id: 'admin', title: 'Administrator Guide', icon: ShieldCheck, desc: 'Operational manual for news moderation.' },
  { id: 'deploy', title: 'Deployment Guide', icon: Terminal, desc: 'Server setup and Docker orchestration.' },
  { id: 'test', title: 'QA & Testing Guide', icon: BookOpen, desc: 'Framework overview and E2E validation.' }
];

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ bundle }) => {
  const [activeDocId, setActiveDocId] = useState<string>('srs');
  const [html, setHtml] = useState('');
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentContent = useMemo(() => bundle[activeDocId] || '', [bundle, activeDocId]);

  useEffect(() => {
    const renderer = new marked.Renderer();
    const items: TocItem[] = [];
    
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      items.push({ id, text, depth });
      return `<h${depth} id="${id}" class="scroll-mt-24 group relative">
        <a href="#${id}" class="absolute -left-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-500 transition-opacity p-1">#</a>
        ${text}
      </h${depth}>`;
    };

    renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
      const isExternal = href.startsWith('http');
      return `<a href="${href}" title="${title || ''}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-brand-600 hover:text-brand-800 underline decoration-brand-200 underline-offset-2">${text}</a>`;
    };

    try {
      const parsed = marked.parse(currentContent, { renderer }) as string;
      setHtml(parsed);
      setTocItems(items);
    } catch (e) {
      console.error("Markdown parsing error", e);
      setHtml("<p>Error rendering documentation.</p>");
    }
  }, [currentContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handlePrint = () => window.print();

  const filteredToc = tocItems.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      {/* Bundle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-lg text-brand-600 dark:text-brand-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white leading-tight">Master Knowledge Base</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Final Refresh v3.0 • Ghana News Aggregator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm focus:ring-2 focus:ring-brand-500 w-64 transition-all"
            />
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-600"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print Guide</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8 h-full overflow-hidden">
        {/* Document Switcher Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 h-full no-print space-y-4">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col h-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">DOCUMENT REPOSITORY</p>
            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 -mr-2 scrollbar-hide">
              {DOC_METADATA.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-4 group ${
                    activeDocId === doc.id
                      ? 'bg-brand-500/10 dark:bg-brand-900/40 border-brand-500 text-brand-900 dark:text-brand-300 shadow-[0_0_15px_-3px_rgba(14,165,233,0.3)]'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 transition-all ${activeDocId === doc.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-500/10'}`}>
                    <doc.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-bold leading-tight truncate ${activeDocId === doc.id ? 'text-brand-600 dark:text-brand-400' : ''}`}>{doc.title}</p>
                    <p className="text-[10px] mt-1 opacity-60 leading-tight line-clamp-2">{doc.desc}</p>
                  </div>
                </button>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t dark:border-slate-700">
               <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-2 px-2">
                <List size={16} className="text-brand-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">CONTENT MAP</span>
              </div>
              <ul className="space-y-1 text-[11px] overflow-y-auto max-h-48 scrollbar-hide px-2">
                {filteredToc.length > 0 ? (
                    filteredToc.map((item) => (
                      <li key={item.id} style={{ paddingLeft: `${(item.depth - 1) * 8}px` }}>
                        <a
                          href={`#${item.id}`}
                          className={`block py-1.5 truncate transition-colors ${
                            activeTocId === item.id ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))
                ) : (
                    <li className="py-4 text-center text-slate-400 italic">No matches</li>
                )}
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <article className="bg-white dark:bg-slate-800 p-8 md:p-16 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-full">
            <div 
              className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-serif prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-h1:text-4xl prose-h1:font-black prose-h1:tracking-tight prose-h1:mb-8
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-700 prose-h2:pb-2
                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
                prose-code:text-brand-600 dark:prose-code:text-brand-400 prose-code:bg-brand-50 dark:prose-code:bg-brand-900/30 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-900 dark:prose-pre:bg-black prose-pre:text-slate-50 prose-pre:shadow-lg prose-pre:rounded-xl
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700"
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          </article>
        </div>
      </div>
    </div>
  );
};