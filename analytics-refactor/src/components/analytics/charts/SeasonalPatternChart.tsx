import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CustomTooltip } from '../components/CustomTooltip';
import { ChartInsight } from '../components/CustomTooltip';
import { useExport } from '../../../contexts/ExportContext';

export const SeasonalPatternChart = ({ data, ...rest }) => {
  const { exportToPNG, isExporting } = useExport();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  if (!data || data.length === 0) return null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : ''}`}>
      <section
        id="seasonal-pattern-chart"
        className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100"
        role="region"
        aria-labelledby="seasonal-heading"
        aria-describedby="seasonal-description"
        {...rest}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="seasonal-heading" className="text-3xl font-bold text-gray-800 mb-2">
              🌊 Seasonal Pattern Recognition
            </h2>
            <p id="seasonal-description" className="text-gray-600">
              Average monthly performance across all years
            </p>
          </div>
          <div>
            <button
              onClick={() => exportToPNG('seasonal-pattern-chart', 'seasonal-pattern-chart.png')}
              disabled={isExporting}
              className="premium-button mr-2"
              aria-label="Export chart to PNG"
              title="Export to PNG"
            >
              {isExporting ? (
                <span className="spinner" aria-hidden="true">⏳</span>
              ) : (
                <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="premium-button"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ArrowsPointingOutIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Screen reader description */}
        <div className="sr-only" aria-live="polite">
          This bar chart shows average monthly performance aggregated across all years in the dataset.
          Four metrics are displayed for each month: average signups in cyan, average applicants in purple,
          average accepted in green, and average rejected in red. This helps identify seasonal patterns and
          optimal timing for marketing and resource allocation. January historically shows the strongest performance.
        </div>

        <div role="img" aria-label={`Grouped bar chart showing seasonal patterns across ${data.length} months with average signups, applicants, accepted, and rejected students`}>
          <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="avgSignups" fill="#06b6d4" name="Avg Signups" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avgApplicants" fill="#8b5cf6" name="Avg Applicants" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avgAccepted" fill="#10b981" name="Avg Accepted" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avgRejected" fill="#ef4444" name="Avg Rejected" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <ChartInsight variant="info">
          <strong>Insight:</strong> January historically shows strong performance. Use these patterns to optimize resource allocation and marketing timing.
        </ChartInsight>
      </section>
    </div>
  );
};

