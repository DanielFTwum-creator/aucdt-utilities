import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CustomTooltip, ChartInsight } from '../components/CustomTooltip';
import { useExport } from '../../../contexts/ExportContext';

export const YearOverYearChart = ({ data, ...rest }) => {
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

  if (!data || data.length === 0) {
    return (
      <div className="premium-chart-card">
        <div className="chart-header">
          <div className="header-icon">
            <ChartBarIcon className="w-7 h-7 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="chart-title">Year-over-Year Growth Analysis</h2>
            <p className="chart-subtitle">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : ''}`}>
      <section
        id="year-over-year-chart"
        className="premium-chart-card"
        role="region"
        aria-labelledby="year-over-year-heading"
        aria-describedby="year-over-year-description"
        {...rest}
      >
        {/* Chart header */}
        <div className="chart-header">
          <div className="flex-grow">
            <div className="header-icon">
              <ChartBarIcon className="w-7 h-7 text-indigo-600" aria-hidden="true" />
            </div>
            <div>
              <h2 id="year-over-year-heading" className="chart-title">
                Year-over-Year Growth Analysis
              </h2>
              <p id="year-over-year-description" className="chart-subtitle">
                Compare total volumes and acceptance rates across years
              </p>
            </div>
          </div>
          <button
            onClick={() => exportToPNG('year-over-year-chart', 'year-over-year-chart.png')}
            disabled={isExporting}
            className="premium-button"
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

        {/* Screen reader description */}
        <div className="sr-only" aria-live="polite">
          This chart displays yearly growth from {data[0]?.year} to {data[data.length - 1]?.year} with bars representing
          signups, applicants, accepted students, and registered students. A line shows the acceptance rate trend over time.
          The most recent year {data[data.length - 1]?.year} shows {data[data.length - 1]?.signups} signups with a {data[data.length - 1]?.acceptanceRate}% acceptance rate.
        </div>

        {/* Chart visualization */}
        <div role="img" aria-label={`Year-over-year bar and line chart from ${data[0]?.year} to ${data[data.length - 1]?.year} showing student enrollment trends`}>
          <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 420}>
            <ComposedChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="applicantsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="acceptedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="registeredGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'Academic Year', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { fill: '#475569', fontWeight: 600, fontSize: 14 }
                }}
              />
              <YAxis 
                yAxisId="left" 
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 13 }}
                tickLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: 'Number of Students', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#475569', fontWeight: 600, fontSize: 14 }
                }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#10b981"
                tick={{ fill: '#059669', fontSize: 13, fontWeight: 500 }}
                tickLine={{ stroke: '#6ee7b7' }}
                label={{ 
                  value: 'Acceptance Rate (%)', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { fill: '#059669', fontWeight: 600, fontSize: 14 }
                }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                iconType="circle"
              />
              
              {/* Bar charts for volumes with gradients */}
              <Bar 
                yAxisId="left" 
                dataKey="signups" 
                fill="url(#signupsGradient)" 
                name="Signups" 
                radius={[8, 8, 0, 0]}
                aria-label="Signups by year"
              />
              <Bar 
                yAxisId="left" 
                dataKey="applicants" 
                fill="url(#applicantsGradient)" 
                name="Applicants" 
                radius={[8, 8, 0, 0]}
                aria-label="Applicants by year"
              />
              <Bar 
                yAxisId="left" 
                dataKey="accepted" 
                fill="url(#acceptedGradient)" 
                name="Accepted" 
                radius={[8, 8, 0, 0]}
                aria-label="Accepted students by year"
              />
              <Bar 
                yAxisId="left" 
                dataKey="registered" 
                fill="url(#registeredGradient)"
                name="Registered" 
                radius={[8, 8, 0, 0]}
                aria-label="Registered students by year"
              />
              
              {/* Line chart for acceptance rate */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="acceptanceRate" 
                stroke="#059669" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                name="Acceptance Rate %"
                aria-label="Acceptance rate trend by year"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Insight box */}
        <ChartInsight>
          <strong>Insight:</strong> Track year-over-year growth patterns to identify which years had the highest success rates. 
          The most recent data shows {data[data.length - 1]?.year} with {data[data.length - 1]?.signups} signups 
          and a {data[data.length - 1]?.acceptanceRate}% acceptance rate.
        </ChartInsight>

        <style jsx>{`
          .premium-chart-card {
            background: white;
            border-radius: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            padding: 2.5rem;
            margin-bottom: 2.5rem;
            border: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          }

          .premium-chart-card:hover {
            box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
          }

          .chart-header {
            display: flex;
            align-items: flex-start;
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .header-icon {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 1.25rem;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            border: 2px solid rgba(99, 102, 241, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .chart-title {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 0.5rem 0;
            line-height: 1.2;
            letter-spacing: -0.01em;
          }

          .chart-subtitle {
            font-size: 1rem;
            color: #64748b;
            margin: 0;
            font-weight: 500;
          }

          @media (max-width: 640px) {
            .premium-chart-card {
              padding: 1.5rem;
            }

            .chart-title {
              font-size: 1.5rem;
            }

            .chart-subtitle {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </section>
    </div>
  );
};
;

