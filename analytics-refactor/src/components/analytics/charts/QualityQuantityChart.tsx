import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CustomTooltip } from '../components/CustomTooltip';
import { ChartInsight } from '../components/CustomTooltip';
import { useExport } from '../../../contexts/ExportContext';

/**
 * Quality vs Quantity Analysis Chart (Scatter Plot)
 * 
 * Shows correlation between application volume and acceptance rate
 * Bubble size represents total acceptances
 * 
 * @component
 */
export const QualityQuantityChart = ({ data, ...rest }) => {
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
        id="quality-quantity-chart"
        className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100"
        role="region"
        aria-labelledby="quality-heading"
        aria-describedby="quality-description"
        {...rest}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="quality-heading" className="text-3xl font-bold text-gray-800 mb-2">
              💎 Quality vs Quantity Analysis
            </h2>
            <p id="quality-description" className="text-gray-600">
              Correlation between application volume and acceptance rate
            </p>
          </div>
          <div>
            <button
              onClick={() => exportToPNG('quality-quantity-chart', 'quality-quantity-chart.png')}
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
          This scatter plot displays the correlation between the number of applicants and acceptance rate across all months.
          Each bubble represents a month, with the bubble size proportional to the total number of accepted students.
          The X-axis shows the number of applicants, and the Y-axis shows the acceptance rate percentage.
          This visualization helps identify whether higher application volumes correlate with better or worse acceptance rates.
        </div>

        <div role="img" aria-label={`Scatter plot with ${data.length} data points showing correlation between applicant volume and acceptance rate, with bubble size representing total acceptances`}>
          <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                dataKey="applicants" 
                name="Applicants" 
                stroke="#6b7280" 
                label={{ value: 'Number of Applicants', position: 'bottom' }} 
              />
              <YAxis 
                type="number" 
                dataKey="acceptanceRate" 
                name="Acceptance Rate" 
                stroke="#6b7280" 
                label={{ value: 'Acceptance Rate (%)', angle: -90, position: 'insideLeft' }} 
              />
              <ZAxis type="number" dataKey="accepted" range={[50, 400]} name="Accepted" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Legend />
              <Scatter name="Months" data={data} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <ChartInsight>
          <strong>Insight:</strong> Bubble size represents total acceptances. Analyse whether higher volumes correlate with better or worse acceptance rates.
        </ChartInsight>
      </section>
    </div>
  );
};


