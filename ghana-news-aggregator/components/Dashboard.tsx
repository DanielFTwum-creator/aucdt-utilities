import React, { useMemo } from 'react';
import { AgentStatus, Article, ArticleStatus } from '../types';
import { ArrowUpRight, Users, Eye, BarChart2, Calendar, Clock, Tag, Globe, CheckCircle, Activity } from 'lucide-react';

interface DashboardProps {
    status: AgentStatus;
    articles: Article[];
}

export const Dashboard: React.FC<DashboardProps> = ({ status, articles }) => {
    const scheduledPosts = useMemo(() => {
        return articles
            .filter(a => a.status === ArticleStatus.SCHEDULED)
            .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
            .slice(0, 8); 
    }, [articles]);

    const sourceHealth = useMemo(() => {
        const counts: Record<string, number> = {};
        articles.forEach(a => {
            counts[a.sourceName] = (counts[a.sourceName] || 0) + 1;
        });
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }, [articles]);

    const tagMetrics = useMemo(() => {
        const counts: Record<string, number> = {};
        articles.forEach(a => {
            a.tags?.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6);
    }, [articles]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="region" aria-label="Key Performance Indicators">
                {[
                    { label: 'Network Reach', value: '42.8k', change: '+18.5%', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Synthesis Accuracy', value: `${status.successRate}%`, change: 'Optimal', icon: Activity, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    { label: 'Articles Found', value: articles.length.toString(), change: 'Total', icon: Eye, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'Dispatch Queue', value: articles.filter(a => a.status === ArticleStatus.SCHEDULED).length.toString(), change: 'Pending', icon: Calendar, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} aria-hidden="true" />
                            </div>
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center" aria-label={`${stat.change} change`}>
                                {stat.change} <ArrowUpRight size={16} aria-hidden="true" />
                            </span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Autonomous Processing Volume (24h)</h3>
                    <div 
                        className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-slate-100 dark:border-slate-700 relative"
                        role="img" 
                        aria-label="Bar chart showing aggregation volume"
                    >
                         {/* Fake Chart Bars */}
                         {[35, 45, 30, 60, 75, 50, 65, 80, 55, 40, 70, 60, 45, 55, 85, 95, 60, 40, 50, 70, 80, 90, 60, 50].map((h, i) => (
                             <div key={i} className="w-full bg-brand-500/10 dark:bg-brand-500/5 hover:bg-brand-500/20 rounded-t-md relative group transition-all">
                                 <div 
                                    className="absolute bottom-0 w-full bg-brand-500 dark:bg-brand-400 rounded-t-md transition-all duration-500 group-hover:bg-brand-600 dark:group-hover:bg-brand-300"
                                    style={{ height: `${h}%` }}
                                 ></div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 dark:text-slate-500 font-mono">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>

                    {/* Source Health Grid */}
                    <div className="mt-8 border-t dark:border-slate-700 pt-6">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Globe size={14} className="text-brand-500" /> Source Reach Health
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {sourceHealth.map(([source, count]) => (
                                <div key={source} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{source}</span>
                                        <CheckCircle size={10} className="text-emerald-500" />
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-mono">{count} cached items</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Categories & Queue Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-brand-500" /> Nexus Deployment Queue
                        </h3>
                        {scheduledPosts.length > 0 ? (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {scheduledPosts.map(post => (
                                    <div key={post.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{post.title}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] text-slate-400 font-mono">{post.sourceName}</span>
                                            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-1.5 py-0.5 rounded">
                                                {new Date(post.scheduledAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                                <p className="text-xs text-slate-400 italic">No posts currently scheduled</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Tag size={18} className="text-brand-500" /> Popular Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {tagMetrics.map(([tag, count]) => (
                                <div key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 rounded-lg group hover:border-brand-500 transition-all cursor-default">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{tag}</span>
                                    <span className="text-[10px] font-black text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded-full">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Vector Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Politics', val: 75, color: 'bg-red-500' },
                                { label: 'Business', val: 45, color: 'bg-blue-500' },
                                { label: 'Sports', val: 60, color: 'bg-green-500' },
                                { label: 'Entertainment', val: 30, color: 'bg-purple-500' },
                            ].map((cat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                                        <span className="text-slate-500 dark:text-slate-400">{cat.val}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={cat.val} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat.label} popularity`}>
                                        <div className={`h-full ${cat.color} rounded-full transition-all duration-1000`} style={{ width: `${cat.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};