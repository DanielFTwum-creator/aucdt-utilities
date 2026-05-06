import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CustomTooltip } from '../components/CustomTooltip';
import { useExport } from '../../../contexts/ExportContext';

export const PerformanceScorecardChart = ({ data, ...rest }) => {
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
        id="performance-scorecard-chart"
        className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100"
        role="region"
        aria-labelledby="scorecard-heading"
        aria-describedby="scorecard-description"
        {...rest}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="scorecard-heading" className="text-3xl font-bold text-gray-800 mb-2">
              ⭐ Performance Scorecard (Last 6 Months)
            </h2>
            <p id="scorecard-description" className="text-gray-600">
              Multi-dimensional performance analysis across key metrics
            </p>
          </div>
          <div>
            <button
              onClick={() => exportToPNG('performance-scorecard-chart', 'performance-scorecard-chart.png')}
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
          This radar chart displays four key performance metrics over the last 6 months on a scale from 0 to 100:
          Conversion Rate in blue shows signups to applicants conversion,
          Acceptance Rate in green shows the percentage of accepted students,
          Success Rate in orange combines accepted and waitlisted students,
          and Efficiency in purple measures accepted students per processed applications.
          Each metric is plotted for each of the last 6 months, creating overlapping filled areas for easy comparison.
        </div>

        <div role="img" aria-label={`Radar chart showing 4 performance metrics across ${data.length} months with conversion, acceptance, success, and efficiency rates`}>
          <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 500}>
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="month" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar name="Conversion Rate" dataKey="Conversion" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Radar name="Acceptance Rate" dataKey="Acceptance" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              <Radar name="Success Rate" dataKey="Success" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
              <Radar name="Efficiency" dataKey="Efficiency" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Metric definitions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" role="group" aria-label="Performance metric definitions">
          <div className="p-4 bg-blue-50 rounded-lg text-center" role="article" aria-label="Conversion Rate: Signups to Applicants">
            <p className="text-xs text-blue-600 font-semibold mb-1">Conversion Rate</p>
            <p className="text-sm text-blue-800">Signups → Applicants</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center" role="article" aria-label="Acceptance Rate: Accepted divided by Total">
            <p className="text-xs text-green-600 font-semibold mb-1">Acceptance Rate</p>
            <p className="text-sm text-green-800">Accepted / Total</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center" role="article" aria-label="Success Rate: Accepted plus Waitlisted students">
            <p className="text-xs text-orange-600 font-semibold mb-1">Success Rate</p>
            <p className="text-sm text-orange-800">Accepted + Waitlisted</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center" role="article" aria-label="Efficiency: Accepted divided by Processed">
            <p className="text-xs text-purple-600 font-semibold mb-1">Efficiency</p>
            <p className="text-sm text-purple-800">Accepted / Processed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

