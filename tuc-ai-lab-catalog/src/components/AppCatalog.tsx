import React, { useState } from 'react';
import { appCatalog, getCompletenessScore, getCatalogSummary } from '../data/appCatalog';
import type { CatalogApp } from '../data/appCatalog';

const categoryColors: Record<CatalogApp['category'], string> = {
  education: 'bg-blue-100 text-blue-800',
  productivity: 'bg-green-100 text-green-800',
  creative: 'bg-purple-100 text-purple-800',
  analysis: 'bg-orange-100 text-orange-800',
  utility: 'bg-gray-100 text-gray-800',
  other: 'bg-slate-100 text-slate-800',
};

const statusColors: Record<CatalogApp['status'], string> = {
  standardised: 'bg-emerald-50 border-emerald-200',
  'in-progress': 'bg-amber-50 border-amber-200',
  'not-started': 'bg-red-50 border-red-200',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">TUC AI Lab Catalog</h1>
          <p className="text-lg text-slate-600">Complete registry of all 28 deployed applications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
            <div className="text-3xl font-bold text-emerald-600">{summary.standardised}</div>
            <div className="text-sm text-slate-600">Production Ready</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="text-3xl font-bold text-amber-600">{summary.inProgress}</div>
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">{summary.notStarted}</div>
            <div className="text-sm text-slate-600">Not Standardised</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{summary.completeness}%</div>
            <div className="text-sm text-slate-600">Overall Progress</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'standardised', 'in-progress', 'not-started'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : statusBadge[status as CatalogApp['status']]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const completeness = getCompletenessScore(app);
            return (
              <div
                key={app.id}
                className={`rounded-lg shadow-lg border-2 p-6 transition hover:shadow-xl ${
                  statusColors[app.status]
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{app.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[app.category]}`}>
                    {app.category}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className="text-sm font-semibold">{statusBadge[app.status]}</span>
                </div>

                {/* Checklist */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={app.vite ? '✅' : '❌'}></span>
                    <span>Vite: base = './'</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.favicon ? '✅' : '❌'}></span>
                    <span>Favicon SVG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.seo ? '✅' : '❌'}></span>
                    <span>SEO Meta Tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.splash ? '✅' : '❌'}></span>
                    <span>Splash Screen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={app.deploy ? '✅' : '❌'}></span>
                    <span>Deploy Script</span>
                  </div>
                </div>

                {/* Completeness */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700">Standardisation</span>
                    <span className="text-xs font-bold text-blue-600">{completeness}%</span>
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://ai-tools.techbridge.edu.gh${app.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Open App ↗
                  </a>
                  <a
                    href={`https://github.com/DanielFTwum-creator/aucdt-utilities/tree/main/${app.localDir}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
                  >
                    GitHub
                  </a>
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-slate-300 text-xs text-slate-500">
                  <p>Local: <code className="bg-slate-100 px-2 py-1 rounded">{app.localDir}</code></p>
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
