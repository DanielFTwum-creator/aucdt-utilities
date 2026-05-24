import React, { useState } from 'react';
import { appCatalog, getCompletenessScore, getCatalogSummary } from '../data/appCatalog';
import type { CatalogApp } from '../data/appCatalog';

const categoryColors: Record<CatalogApp['category'], string> = {
  education: 'bg-blue-50 text-blue-900 border-blue-200',
  productivity: 'bg-amber-50 text-amber-900 border-amber-200',
  creative: 'bg-pink-50 text-pink-900 border-pink-200',
  analysis: 'bg-purple-50 text-purple-900 border-purple-200',
  utility: 'bg-slate-50 text-slate-900 border-slate-200',
  other: 'bg-gray-50 text-gray-900 border-gray-200',
};

const statusColors: Record<CatalogApp['status'], string> = {
  standardised: 'bg-green-50 border-l-4 border-l-green-600',
  'in-progress': 'bg-yellow-50 border-l-4 border-l-yellow-600',
  'not-started': 'bg-red-50 border-l-4 border-l-red-600',
};

const statusBadge: Record<CatalogApp['status'], string> = {
  standardised: '✅ Production Ready',
  'in-progress': '🔄 In Progress',
  'not-started': '⏳ Not Standardised',
};

export default function AppCatalog() {
  const [filterStatus, setFilterStatus] = useState<CatalogApp['status'] | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CatalogApp['category'] | 'all'>('all');

  const summary = getCatalogSummary();

  const filteredApps = appCatalog.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (filterCategory !== 'all' && app.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');`}</style>
        <div className="mb-12 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-8 text-white shadow-2xl" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          <h1 className="text-5xl font-bold mb-2 tracking-tight">TUC AI LAB CATALOG</h1>
          <p className="text-lg text-blue-100">Complete registry of all 28 deployed applications</p>
          <div className="mt-4 flex gap-3">
            <a href="/" className="text-xs px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition font-semibold">← Back to AI Lab</a>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-green-600 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-green-700">{summary.standardised}</div>
            <div className="text-sm text-green-800 font-semibold mt-1">✅ Production Ready</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-yellow-600 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-yellow-700">{summary.inProgress}</div>
            <div className="text-sm text-yellow-800 font-semibold mt-1">🔄 In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-red-700">{summary.notStarted}</div>
            <div className="text-sm text-red-800 font-semibold mt-1">⏳ Not Standardised</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-900 hover:shadow-lg transition">
            <div className="text-4xl font-bold text-blue-900">{summary.completeness}%</div>
            <div className="text-sm text-blue-900 font-semibold mt-1">📊 Overall Progress</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-8" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">🔎 Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'standardised', 'in-progress', 'not-started'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition border ${
                      filterStatus === status
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {status === 'all' ? 'All' : statusBadge[status as CatalogApp['status']]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">🏷️ Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="productivity">Productivity</option>
                <option value="creative">Creative</option>
                <option value="analysis">Analysis</option>
                <option value="utility">Utility</option>
              </select>
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          {filteredApps.map((app) => {
            const completeness = getCompletenessScore(app);
            return (
              <div
                key={app.id}
                className={`rounded-lg shadow-md p-6 transition hover:shadow-xl hover:-translate-y-1 bg-white border ${
                  statusColors[app.status]
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{app.name}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-snug">{app.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ml-2 border ${categoryColors[app.category]}`}>
                    {app.category}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-700">{statusBadge[app.status]}</span>
                </div>

                {/* Checklist */}
                <div className="space-y-1 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={app.vite ? '✅' : '❌'}></span>
                    <span className="text-slate-700">Vite: base = './'</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.favicon ? '✅' : '❌'}></span>
                    <span className="text-slate-700">Favicon SVG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.seo ? '✅' : '❌'}></span>
                    <span className="text-slate-700">SEO Meta Tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.splash ? '✅' : '❌'}></span>
                    <span className="text-slate-700">Splash Screen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.deploy ? '✅' : '❌'}></span>
                    <span className="text-slate-700">Deploy Script</span>
                  </div>
                </div>

                {/* Completeness */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-700">Standardisation</span>
                    <span className="text-xs font-bold text-blue-900">{completeness}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-wrap mb-3">
                  <a
                    href={`https://ai-tools.techbridge.edu.gh${app.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition font-semibold"
                  >
                    🚀 Open
                  </a>
                  <a
                    href={`https://github.com/DanielFTwum-creator/aucdt-utilities/tree/main/${app.localDir}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
                  >
                    💾 Code
                  </a>
                </div>

                {/* Metadata */}
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                  <p><code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{app.localDir}</code></p>
                  <p className="mt-1">Updated: {app.lastUpdated}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No apps match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
