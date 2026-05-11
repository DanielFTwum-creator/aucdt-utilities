import React, { useState, useMemo } from 'react';
import { Theme, AuditLogEntry, NewsSource, SocialConfig } from '../types';
import { 
  Moon, Sun, Monitor, Shield, Eye, Database, Plus, Edit2, Trash2, 
  Save, X, Check, AlertCircle, Link, Rss, Globe, Download, 
  Search, Facebook, Lock, ToggleLeft, ToggleRight, FileJson, 
  Code, Loader2, CheckCircle2, Globe2, Activity, RefreshCw
} from 'lucide-react';
import { useNotify } from '../App';
import { GoogleGenAI } from "@google/genai";

interface SettingsProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  auditLogs: AuditLogEntry[];
  newsSources: NewsSource[];
  onAddSource: (source: Omit<NewsSource, 'id'>) => void;
  onUpdateSource: (source: NewsSource) => void;
  onDeleteSource: (id: string) => void;
  socialConfig: SocialConfig;
  onSocialConfigChange: (config: SocialConfig) => void;
  onPasswordChange: (oldPass: string, newPass: string) => void;
  onForceSyncSource?: (source: NewsSource) => Promise<number>;
}

export const Settings: React.FC<SettingsProps> = ({ 
  currentTheme, 
  onThemeChange, 
  auditLogs,
  newsSources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  socialConfig,
  onSocialConfigChange,
  onPasswordChange,
  onForceSyncSource
}) => {
  const { notify } = useNotify();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<NewsSource, 'id' | 'lastFetch'>>({
    name: '',
    url: '',
    type: 'rss',
    enabled: true
  });

  const [socialFormData, setSocialFormData] = useState<SocialConfig>(socialConfig);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const resetForm = () => {
    setFormData({ name: '', url: '', type: 'rss', enabled: true });
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', url: '', type: 'rss', enabled: true });
    setIsModalOpen(true);
  };

  const handleEditClick = (source: NewsSource) => {
    setFormData({ 
      name: source.name, 
      url: source.url, 
      type: source.type, 
      enabled: source.enabled 
    });
    setEditingId(source.id);
    setIsModalOpen(true);
  };

  const handleSyncSource = async (source: NewsSource) => {
    if (!onForceSyncSource) return;
    setSyncingId(source.id);
    notify(`Targeted Sync: Polling ${source.name}...`, 'info');
    try {
      const count = await onForceSyncSource(source);
      if (count > 0) {
        notify(`Sync Success: Discovered ${count} new articles from ${source.name}.`, 'success');
      } else {
        notify(`Sync Complete: No new content on ${source.name}.`, 'info');
      }
    } catch (err) {
      notify(`Sync Failure: ${source.name} endpoint unreachable.`, 'error');
    } finally {
      setSyncingId(null);
    }
  };

  const handleValidateSource = async () => {
    if (!formData.url) {
      notify("Please enter a URL first", "error");
      return;
    }
    setIsValidating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Validate if this URL is likely a news endpoint or news website: ${formData.url}. 
        Return JSON: { "isValid": boolean, "suggestedType": "rss" | "api" | "scraper", "reason": "string" }`,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text || '{}');
      if (result.isValid) {
        notify(`Verification Success: ${result.reason}`, 'success');
        setFormData(prev => ({ ...prev, type: result.suggestedType }));
      } else {
        notify(`Warning: ${result.reason}`, 'error');
      }
    } catch (error) {
      notify("Validation failed. Please check the URL manually.", "error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateSource({ ...formData, id: editingId });
    } else {
      onAddSource(formData);
    }
    resetForm();
  };

  const handleToggleSource = (source: NewsSource) => {
    onUpdateSource({ ...source, enabled: !source.enabled });
    notify(`${source.name} is now ${!source.enabled ? 'Enabled' : 'Disabled'}`, 'info');
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSocialConfigChange(socialFormData);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      notify("New password must be at least 6 characters", "error");
      return;
    }
    onPasswordChange(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
  };

  const exportLogs = () => {
    const data = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    notify("Audit logs exported to JSON", "success");
  };

  const formatLastFetch = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(auditFilter.toLowerCase()) || 
    log.details.toLowerCase().includes(auditFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Theme Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6" aria-labelledby="theme-section-title">
        <h3 id="theme-section-title" className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="text-brand-500" size={20} aria-hidden="true" /> Appearance & Accessibility
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="System Theme Selection">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'high-contrast', label: 'High Contrast', icon: Eye }
            ].map((t) => (
                <button
                    key={t.id}
                    role="radio"
                    aria-checked={currentTheme === t.id}
                    onClick={() => onThemeChange(t.id as Theme)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        currentTheme === t.id ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-900/20' : 'border-slate-100 dark:border-slate-700'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full shadow-sm ${currentTheme === t.id ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            <t.icon size={20} aria-hidden="true" />
                        </div>
                        <span className="font-bold">{t.label}</span>
                    </div>
                    {currentTheme === t.id && <Check size={16} className="text-brand-500" aria-hidden="true" />}
                </button>
            ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6" aria-labelledby="security-section-title">
        <h3 id="security-section-title" className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="text-amber-500" size={20} aria-hidden="true" /> Security Settings
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage administrative access credentials and password rotation.</p>
        
        <form onSubmit={handleSecuritySubmit} className="space-y-4 max-w-xl" aria-label="Administrative Password Update">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="old-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={16} aria-hidden="true" />
                      <input 
                        id="old-password"
                        type="password"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                </div>
                <div className="space-y-1">
                    <label htmlFor="new-password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={16} aria-hidden="true" />
                      <input 
                        id="new-password"
                        type="password"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                      />
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                    Update Administrative Password
                </button>
            </div>
        </form>
      </section>

      {/* Social Media Integration Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6" aria-labelledby="social-section-title">
        <h3 id="social-section-title" className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Facebook className="text-blue-600" size={20} aria-hidden="true" /> Facebook Graph API Integration
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure credentials to enable automated social media dispatches.</p>
        
        <form onSubmit={handleSocialSubmit} className="space-y-4" aria-label="Social Integration Config">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="fb-page-id" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Facebook Page ID</label>
                    <input 
                      id="fb-page-id"
                      type="text"
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono"
                      placeholder="e.g. 104857621234567"
                      value={socialFormData.facebookPageId}
                      onChange={e => setSocialFormData({...socialFormData, facebookPageId: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="fb-token" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Access Token</label>
                    <input 
                      id="fb-token"
                      type="password"
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-mono"
                      placeholder="EAAb..."
                      value={socialFormData.facebookAccessToken}
                      onChange={e => setSocialFormData({...socialFormData, facebookAccessToken: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="autoPost" 
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                  checked={socialFormData.autoPostEnabled}
                  onChange={e => setSocialFormData({...socialFormData, autoPostEnabled: e.target.checked})}
                />
                <label htmlFor="autoPost" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">Enable Autonomous Auto-Posting</label>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                    <Save size={16} aria-hidden="true" /> Save Integration
                </button>
            </div>
        </form>
      </section>

      {/* Sources Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden" aria-labelledby="sources-section-title">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
            <div>
                <h3 id="sources-section-title" className="text-lg font-bold text-slate-900 dark:text-white">Ingestion Sources</h3>
                <p className="text-xs text-slate-500">Configured RSS and API endpoints for aggregation.</p>
            </div>
            <button 
              onClick={handleOpenAdd} 
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              aria-label="Add new news source"
            >
                <Plus size={16} aria-hidden="true" /> Add Source
            </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" role="table">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4">Source Detail</th>
                  <th scope="col" className="px-6 py-4">Type</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Last Sync</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {newsSources.map(s => (
                      <tr key={s.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{s.url}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {s.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleToggleSource(s)}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:underline"
                              aria-label={`Toggle ${s.name} - currently ${s.enabled ? 'Active' : 'Disabled'}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${s.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} aria-hidden="true"></div>
                              <span className={`text-[10px] font-bold uppercase ${s.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                {s.enabled ? 'Active' : 'Disabled'}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 group/sync">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200" title={s.lastFetch ? new Date(s.lastFetch).toLocaleString() : 'Never Synced'}>
                                  {formatLastFetch(s.lastFetch)}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleSyncSource(s)}
                                disabled={syncingId === s.id}
                                className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-brand-500 hover:border-brand-500/50 transition-all focus:opacity-100 group-hover:opacity-100 ${syncingId === s.id ? 'opacity-100' : 'opacity-0'}`}
                                title={`Force Sync ${s.name}`}
                                aria-label={`Force sync ${s.name}`}
                              >
                                <RefreshCw size={12} className={syncingId === s.id ? 'animate-spin text-brand-500' : ''} aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all">
                                  <button onClick={() => handleEditClick(s)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" title="Edit Source" aria-label={`Edit ${s.name}`}><Edit2 size={14} aria-hidden="true" /></button>
                                  <button onClick={() => onDeleteSource(s.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" title="Delete Source" aria-label={`Delete ${s.name}`}><Trash2 size={14} aria-hidden="true" /></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </section>

      {/* Audit Logs Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden" aria-labelledby="audit-section-title">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
            <div>
                <h3 id="audit-section-title" className="text-lg font-bold">System Compliance Logs</h3>
                <p className="text-xs text-slate-500">Immutable audit trail of administrative modifications.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} aria-hidden="true" />
                    <input 
                      aria-label="Search audit trail logs"
                      className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
                      placeholder="Search audit trail..." 
                      value={auditFilter} 
                      onChange={e => setAuditFilter(e.target.value)}
                    />
                </div>
                <button onClick={exportLogs} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500">
                    <Download size={14} aria-hidden="true" /> Export JSON
                </button>
            </div>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" role="region" aria-label="Audit log table" tabIndex={0}>
            <table className="w-full text-xs text-left" role="table">
                <thead className="bg-slate-100 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-500 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">Timestamp</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono">
                    {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                            <td className="px-6 py-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</td>
                            <td className="px-6 py-3 font-bold text-slate-700 dark:text-slate-300">{log.action}</td>
                            <td className="px-6 py-3 text-slate-500">{log.details}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'}`}>
                                  {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No logs match your search criteria.</td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
      </section>

      {/* MODAL: Add/Edit Source */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500 rounded-xl text-white">
                  {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h5 id="modal-heading" className="font-serif font-black text-xl text-slate-900 dark:text-white">
                    {editingId ? 'Source Configuration' : 'Integrate New Source'}
                  </h5>
                  <p className="text-xs text-slate-500">Configure parameters for automated ingestion.</p>
                </div>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors focus:ring-2 focus:ring-brand-500" aria-label="Close configuration modal">
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="source-name" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Source Identity</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                        <Globe2 size={18} aria-hidden="true" />
                      </div>
                      <input 
                        id="source-name"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/50 focus:border-brand-500 focus:ring-0 outline-none text-sm transition-all" 
                        placeholder="e.g. Graphic Online" 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="source-url" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Endpoint Endpoint (RSS/API)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                          <Link size={18} aria-hidden="true" />
                        </div>
                        <input 
                          id="source-url"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 dark:bg-slate-900/50 focus:border-brand-500 focus:ring-0 outline-none text-sm font-mono transition-all" 
                          placeholder="https://www.graphic.com.gh/rss" 
                          required 
                          type="url" 
                          value={formData.url} 
                          onChange={e => setFormData({...formData, url: e.target.value})}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleValidateSource}
                        disabled={isValidating || !formData.url}
                        className="px-4 py-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl text-slate-700 dark:text-slate-200 transition-all disabled:opacity-50 focus:ring-2 focus:ring-brand-500"
                        title="Analyse endpoint with Gemini"
                        aria-label="Analyse URL with Gemini AI"
                      >
                        {isValidating ? <Loader2 size={20} className="animate-spin" /> : <Activity size={20} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ingestion Methodology</span>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Ingestion Type Selection">
                    {[
                      { id: 'rss', label: 'RSS Feed', icon: Rss, desc: 'XML Hook' },
                      { id: 'api', label: 'REST API', icon: FileJson, desc: 'JSON Output' },
                      { id: 'scraper', label: 'Scraper', icon: Code, desc: 'DOM Logic' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        role="radio"
                        aria-checked={formData.type === type.id}
                        onClick={() => setFormData({...formData, type: type.id as any})}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 group ${
                          formData.type === type.id 
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 shadow-lg' 
                            : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        <type.icon size={24} className={formData.type === type.id ? 'text-brand-500' : 'group-hover:text-slate-600'} aria-hidden="true" />
                        <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-wider">{type.label}</p>
                          <p className="text-[8px] opacity-60 font-medium">{type.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-slate-700">
                  <div 
                    role="switch"
                    aria-checked={formData.enabled}
                    tabIndex={0}
                    onClick={() => setFormData({...formData, enabled: !formData.enabled})}
                    onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' && (e.preventDefault(), setFormData({...formData, enabled: !formData.enabled}))}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 cursor-pointer hover:border-brand-500/20 transition-all outline-none focus:ring-2 focus:ring-brand-500"
                    aria-label="Automated Polling Switch"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${formData.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {formData.enabled ? <CheckCircle2 size={24} aria-hidden="true" /> : <AlertCircle size={24} aria-hidden="true" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Active Deployment Polling</p>
                        <p className="text-[10px] text-slate-500">The autonomous agent will monitor this source</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${formData.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} aria-hidden="true">
                      <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${formData.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-6 border-t dark:border-slate-700 flex gap-4 bg-slate-50 dark:bg-slate-900/40">
              <button 
                type="button" 
                onClick={resetForm} 
                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all focus:ring-2 focus:ring-slate-300"
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-[2] py-3.5 bg-brand-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-brand-500/30 hover:bg-brand-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                {editingId ? <Save size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                {editingId ? 'Update Parameters' : 'Register Source'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};