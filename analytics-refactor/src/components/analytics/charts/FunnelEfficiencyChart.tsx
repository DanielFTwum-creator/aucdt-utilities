import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FunnelIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import { CustomTooltip, ChartInsight } from '../components/CustomTooltip';
import { formatNumber, formatPercentage } from '../../../utils/formatters';
import { useExport } from '../../../contexts/ExportContext';

export const FunnelEfficiencyChart = ({ data, allTimeRegistrationRate, ...rest }) => {
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

  const last12Totals = {
    signups: data.reduce((sum, d) => sum + d.signups, 0),
    applicants: data.reduce((sum, d) => sum + d.applicants, 0),
    accepted: data.reduce((sum, d) => sum + d.accepted, 0),
    registered: data.reduce((sum, d) => sum + d.registered, 0)
  };

  const recentRate = last12Totals.accepted > 0 
    ? ((last12Totals.registered / last12Totals.accepted) * 100).toFixed(1)
    : 0;

  // Calculate conversion rates
  const conversionRate = last12Totals.signups > 0 
    ? ((last12Totals.applicants / last12Totals.signups) * 100).toFixed(1)
    : 0;
  const acceptanceRate = last12Totals.applicants > 0 
    ? ((last12Totals.accepted / last12Totals.applicants) * 100).toFixed(1)
    : 0;

      return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : ''}`}>
          <section
            id="funnel-efficiency-chart"
            className="premium-chart-card"
            role="region"
            aria-labelledby="funnel-heading"
            aria-describedby="funnel-description"
            {...rest}
          >
            <div className="chart-header">
              <div className="flex-grow">
                <div className="header-icon-funnel">
                  <FunnelIcon className="w-7 h-7 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="funnel-heading" className="chart-title">
                    Conversion Funnel Efficiency
                  </h2>
                  <p id="funnel-description" className="chart-subtitle">
                    Track how efficiently signups convert through the application pipeline (Last 12 Months)
                  </p>
                </div>
              </div>
              <button
                onClick={() => exportToPNG('funnel-efficiency-chart', 'funnel-efficiency-chart.png')}
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
              This area chart shows the conversion funnel for the last 12 months with four stages:
              {formatNumber(last12Totals.signups)} signups at 100%,
              {formatNumber(last12Totals.applicants)} applicants at {conversionRate}%,
              {formatNumber(last12Totals.accepted)} accepted at {acceptanceRate}%, and
              {formatNumber(last12Totals.registered)} registered at {recentRate}%.
              The chart uses gradient-filled areas to visualize the decreasing numbers through each stage.
            </div>
    
            <div role="img" aria-label={`Conversion funnel area chart showing ${formatNumber(last12Totals.signups)} signups converting to ${formatNumber(last12Totals.registered)} registrations over 12 months`}>
              <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : 400}>
                <AreaChart 
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="gradApplicants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="gradAccepted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="gradRegistered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    tick={{ fill: '#475569', fontSize: 13 }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#475569', fontSize: 13 }}
                    tickLine={{ stroke: '#cbd5e1' }}
                    label={{
                      value: 'Students', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#475569', fontWeight: 600, fontSize: 14 }
                    }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '15px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="signups" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradSignups)" 
                    name="Signups" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applicants" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradApplicants)" 
                    name="Applicants" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accepted" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradAccepted)" 
                    name="Accepted" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="registered" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#gradRegistered)" 
                    name="Registered" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Stage summary */}
            <div className="stages-grid" role="group" aria-label="Conversion funnel stages summary">
              <div className="stage-card stage-signups" role="article" aria-label={`Stage 1: ${formatNumber(last12Totals.signups)} signups`}>
                <p className="stage-label">Stage 1: Signups</p>
                <p className="stage-value stage-value-signups" aria-label={`${formatNumber(last12Totals.signups)} signups`}>{formatNumber(last12Totals.signups)}</p>
                <p className="stage-rate" aria-label="100% of initial signups">100%</p>
              </div>
              <div className="stage-card stage-applicants" role="article" aria-label={`Stage 2: ${formatNumber(last12Totals.applicants)} applicants`}>
                <p className="stage-label">Stage 2: Applicants</p>
                <p className="stage-value stage-value-applicants" aria-label={`${formatNumber(last12Totals.applicants)} applicants`}>{formatNumber(last12Totals.applicants)}</p>
                <p className="stage-rate" aria-label={`${formatPercentage(conversionRate)} conversion rate`}>{formatPercentage(conversionRate)}</p>
              </div>
              <div className="stage-card stage-accepted" role="article" aria-label={`Stage 3: ${formatNumber(last12Totals.accepted)} accepted`}>
                <p className="stage-label">Stage 3: Accepted</p>
                <p className="stage-value stage-value-accepted" aria-label={`${formatNumber(last12Totals.accepted)} accepted students`}>{formatNumber(last12Totals.accepted)}</p>
                <p className="stage-rate" aria-label={`${formatPercentage(acceptanceRate)} acceptance rate`}>{formatPercentage(acceptanceRate)}</p>
              </div>
              <div className="stage-card stage-registered highlighted" role="article" aria-label={`Stage 4: ${formatNumber(last12Totals.registered)} registered - Final stage`}>
                <p className="stage-label">Stage 4: Registered</p>
                <p className="stage-value stage-value-registered" aria-label={`${formatNumber(last12Totals.registered)} registered students`}>{formatNumber(last12Totals.registered)}</p>
                <p className="stage-rate" aria-label={`${formatPercentage(recentRate)} registration rate`}>{formatPercentage(recentRate)}</p>
              </div>
            </div>
            
            <ChartInsight variant="warning">
              <strong>💡 Key Insight:</strong> In the last 12 months: {formatNumber(last12Totals.registered)} registrations from {formatNumber(last12Totals.accepted)} accepted ({formatPercentage(recentRate)} rate). 
              Compare this to the all-time rate of {formatPercentage(allTimeRegistrationRate)} - recent registration conversion has{' '}
              {parseFloat(recentRate) < parseFloat(allTimeRegistrationRate) ? 'dropped' : 'improved'} slightly.
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
    
              .header-icon-funnel {
                width: 3.5rem;
                height: 3.5rem;
                border-radius: 1.25rem;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
                border: 2px solid rgba(139, 92, 246, 0.2);
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
    
              .stages-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.25rem;
                margin-top: 2rem;
              }
    
              @media (max-width: 1024px) {
                .stages-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
    
              @media (max-width: 640px) {
                .stages-grid {
                  grid-template-columns: 1fr;
                }
              }
    
              .stage-card {
                padding: 1.5rem;
                border-radius: 1.25rem;
                transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
              }
    
              .stage-card:hover {
                transform: translateY(-4px);
              }
    
              .stage-card.highlighted {
                border: 2px solid #f59e0b;
              }
    
              .stage-signups {
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              }
    
              .stage-applicants {
                background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
              }
    
              .stage-accepted {
                background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
              }
    
              .stage-registered {
                background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              }
    
              .stage-label {
                font-size: 0.8125rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 0.75rem;
              }
    
              .stage-signups .stage-label {
                color: #1e40af;
              }
    
              .stage-applicants .stage-label {
                color: #6b21a8;
              }
    
              .stage-accepted .stage-label {
                color: #047857;
              }
    
              .stage-registered .stage-label {
                color: #b45309;
              }
    
              .stage-value {
                font-family: 'JetBrains Mono', monospace;
                font-size: 2rem;
                font-weight: 800;
                line-height: 1;
                margin-bottom: 0.5rem;
              }
    
              .stage-value-signups {
                color: #1e3a8a;
              }
    
              .stage-value-applicants {
                color: #581c87;
              }
    
              .stage-value-accepted {
                color: #065f46;
              }
    
              .stage-value-registered {
                color: #92400e;
              }
    
              .stage-rate {
                font-size: 0.875rem;
                font-weight: 600;
                opacity: 0.8;
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
