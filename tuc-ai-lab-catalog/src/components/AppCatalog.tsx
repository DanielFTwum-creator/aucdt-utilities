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
    <div className="min-h-screen bg-slate-50 p-8" style={{ backgroundColor: '#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');
        .tuc-catalog-header {
          font-family: 'Barlow Condensed', sans-serif !important;
          background: linear-gradient(to right, #1e3a8a, #1e40af, #1e3a8a) !important;
        }
        .tuc-catalog-header h1 {
          font-family: 'Barlow Condensed', sans-serif !important;
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          letter-spacing: -0.01em !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="tuc-catalog-header mb-12 rounded-xl p-8 text-white shadow-2xl">
          <h1 className="mb-2 tracking-tight text-white">TUC AI LAB CATALOG</h1>
          <p className="text-lg text-blue-100">Complete registry of all 28 deployed applications</p>
          <div className="mt-4 flex gap-3">
            <a href="/" className="text-xs px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition font-semibold">← Back to AI Lab</a>
          </div>
        </div>

        {/* Summary Cards */}
        <style>{`
          .summary-card {
            background: white !important;
            border-radius: 0.5rem !important;
            padding: 1.5rem !important;
            transition: all 0.3s ease !important;
          }
          .summary-card:hover { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important; }
          .summary-card-value {
            font-size: 2rem !important;
            font-weight: 700 !important;
          }
          .summary-card-label {
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            margin-top: 0.25rem !important;
          }
        `}</style>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="summary-card" style={{ borderLeft: '4px solid #16a34a' }}>
            <div className="summary-card-value" style={{ color: '#15803d' }}>{summary.standardised}</div>
            <div className="summary-card-label" style={{ color: '#166534' }}>✅ Production Ready</div>
          </div>
          <div className="summary-card" style={{ borderLeft: '4px solid #ca8a04' }}>
            <div className="summary-card-value" style={{ color: '#b45309' }}>{summary.inProgress}</div>
            <div className="summary-card-label" style={{ color: '#92400e' }}>🔄 In Progress</div>
          </div>
          <div className="summary-card" style={{ borderLeft: '4px solid #dc2626' }}>
            <div className="summary-card-value" style={{ color: '#b91c1c' }}>{summary.notStarted}</div>
            <div className="summary-card-label" style={{ color: '#7f1d1d' }}>⏳ Not Standardised</div>
          </div>
          <div className="summary-card" style={{ borderLeft: '4px solid #1e3a8a' }}>
            <div className="summary-card-value" style={{ color: '#1e3a8a' }}>{summary.completeness}%</div>
            <div className="summary-card-label" style={{ color: '#1e3a8a' }}>📊 Overall Progress</div>
          </div>
        </div>

        {/* Filters */}
        <style>{`
          .filter-section {
            background: white !important;
            border-radius: 0.5rem !important;
            padding: 1.5rem !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid #e2e8f0 !important;
          }
          .filter-label {
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            color: #0f172a !important;
            margin-bottom: 0.75rem !important;
            display: block !important;
          }
          .filter-button {
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
            font-weight: 500 !important;
            border: 1px solid !important;
            transition: all 0.2s !important;
          }
          .filter-button.active {
            background: #1e3a8a !important;
            color: white !important;
            border-color: #1e3a8a !important;
          }
          .filter-button:not(.active) {
            background: white !important;
            color: #475569 !important;
            border-color: #cbd5e1 !important;
          }
          .filter-button:not(.active):hover {
            border-color: #94a3b8 !important;
          }
          .filter-select {
            width: 100% !important;
            max-width: 16rem !important;
            padding: 0.5rem 1rem !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 0.5rem !important;
            font-weight: 500 !important;
            background: white !important;
            color: #0f172a !important;
          }
          .filter-select:focus {
            outline: none !important;
            ring: 2px solid #1e3a8a !important;
            border-color: #1e3a8a !important;
          }
        `}</style>
        <div className="filter-section mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="filter-label">🔎 Filter by Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'standardised', 'in-progress', 'not-started'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`filter-button ${filterStatus === status ? 'active' : ''}`}
                  >
                    {status === 'all' ? 'All' : statusBadge[status as CatalogApp['status']]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="filter-label">🏷️ Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="filter-select"
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
        <style>{`
          .app-card {
            background: white !important;
            border-radius: 0.5rem !important;
            padding: 1.5rem !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.3s ease !important;
            border-left: 4px solid #ddd !important;
          }
          .app-card:hover {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
            transform: translateY(-2px) !important;
          }
          .app-card.status-standardised { border-left-color: #16a34a !important; }
          .app-card.status-in-progress { border-left-color: #ca8a04 !important; }
          .app-card.status-not-started { border-left-color: #dc2626 !important; }
          .app-card-title {
            font-size: 1.125rem !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            line-height: 1.4 !important;
          }
          .app-card-desc {
            font-size: 0.875rem !important;
            color: #475569 !important;
            margin-top: 0.5rem !important;
            line-height: 1.5 !important;
          }
          .app-card-badge {
            display: inline-block !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 0.375rem !important;
            font-size: 0.75rem !important;
            font-weight: 600 !important;
            border: 1px solid !important;
          }
          .app-card-checklist { font-size: 0.875rem !important; }
          .app-card-link {
            display: inline-block !important;
            padding: 0.5rem 0.75rem !important;
            border-radius: 0.375rem !important;
            font-size: 0.75rem !important;
            font-weight: 600 !important;
            transition: all 0.2s !important;
            color: white !important;
            text-decoration: none !important;
          }
          .app-card-link-primary { background: #1e3a8a !important; }
          .app-card-link-primary:hover { background: #1e40af !important; }
          .app-card-link-secondary { background: #475569 !important; }
          .app-card-link-secondary:hover { background: #334155 !important; }
        `}</style>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const completeness = getCompletenessScore(app);
            const statusClass = `status-${app.status.replace('-', '-')}`;
            return (
              <div
                key={app.id}
                className={`app-card ${statusClass}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="app-card-title">{app.name}</h3>
                    <p className="app-card-desc">{app.description}</p>
                  </div>
                  <span className={`app-card-badge whitespace-nowrap ml-2 ${categoryColors[app.category]}`} style={{ borderColor: 'currentColor', opacity: 0.8 }}>
                    {app.category}
                  </span>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-slate-700">{statusBadge[app.status]}</span>
                </div>

                {/* Checklist */}
                <div className="app-card-checklist space-y-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span>{app.vite ? '✅' : '❌'}</span>
                    <span style={{ color: '#475569' }}>Vite: base = './'</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{app.favicon ? '✅' : '❌'}</span>
                    <span style={{ color: '#475569' }}>Favicon SVG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{app.seo ? '✅' : '❌'}</span>
                    <span style={{ color: '#475569' }}>SEO Meta Tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{app.splash ? '✅' : '❌'}</span>
                    <span style={{ color: '#475569' }}>Splash Screen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{app.deploy ? '✅' : '❌'}</span>
                    <span style={{ color: '#475569' }}>Deploy Script</span>
                  </div>
                </div>

                {/* Completeness */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Standardisation</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e3a8a' }}>{completeness}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '9999px', height: '0.5rem' }}>
                    <div
                      style={{
                        backgroundColor: '#1e3a8a',
                        height: '0.5rem',
                        borderRadius: '9999px',
                        transition: 'all 0.3s ease',
                        width: `${completeness}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-2 flex-wrap mb-3">
                  <a
                    href={`https://ai-tools.techbridge.edu.gh${app.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-card-link app-card-link-primary"
                  >
                    🚀 Open
                  </a>
                  <a
                    href={`https://github.com/DanielFTwum-creator/aucdt-utilities/tree/main/${app.localDir}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-card-link app-card-link-secondary"
                  >
                    💾 Code
                  </a>
                </div>

                {/* Metadata */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#64748b' }}>
                  <p><code style={{ backgroundColor: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', color: '#475569' }}>{app.localDir}</code></p>
                  <p style={{ marginTop: '0.25rem' }}>Updated: {app.lastUpdated}</p>
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
