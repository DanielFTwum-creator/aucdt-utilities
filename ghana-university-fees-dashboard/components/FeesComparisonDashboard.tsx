import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ViewType } from '../types';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import AuditService from '../services/AuditService';

const formatCurrency = (value: number): string => {
  return `GH₵${value.toLocaleString()}`;
};

const formatAxisCurrency = (value: number): string => {
  if (value >= 1000) {
    return `GH₵${(value / 1000).toFixed(0)}k`;
  }
  return `GH₵${value}`;
};

const FeesComparisonDashboard: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>('undergraduate');
  const { undergraduateData, internationalData, postgraduateData } = useData();
  const { theme } = useTheme();

  const handleViewTypeChange = (val: ViewType) => {
    setViewType(val);
    AuditService.log('DATA_FILTER', `Fee category switched to: ${val.toUpperCase()}`, 'INFO');
  };

  const dataToDisplay = useMemo(() => {
    switch (viewType) {
      case 'undergraduate': return undergraduateData;
      case 'international': return internationalData;
      case 'postgraduate': return postgraduateData;
      default: return undergraduateData;
    }
  }, [viewType, undergraduateData, internationalData, postgraduateData]);

  // Enhanced theme-aware colors with gradients
  const colors = useMemo(() => {
    if (theme === 'high-contrast') {
      return {
        text: '#000000',
        bar1: '#000000',
        bar2: '#555555',
        grid: '#000000',
        tooltipBg: '#ffffff',
        tooltipText: '#000000',
        cardBg: '#ffffff',
        borderColor: '#000000',
        accentGradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
        headerGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      };
    } else if (theme === 'dark') {
      return {
        text: '#9ca3af',
        bar1: '#3b82f6',
        bar2: '#10b981',
        grid: '#374151',
        tooltipBg: 'rgba(17, 24, 39, 0.98)',
        tooltipText: '#f3f4f6',
        cardBg: '#1e293b',
        borderColor: '#374151',
        accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        headerGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
      };
    }
    return {
      text: '#64748b',
      bar1: '#2563eb',
      bar2: '#059669',
      grid: '#e2e8f0',
      tooltipBg: 'rgba(255, 255, 255, 0.98)',
      tooltipText: '#1e293b',
      cardBg: '#ffffff',
      borderColor: '#e2e8f0',
      accentGradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      headerGradient: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)'
    };
  }, [theme]);

  // Fixed: Use any for tooltip props to avoid type errors with Recharts definitions
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-5 border-2 shadow-2xl rounded-2xl backdrop-blur-xl transform transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: colors.tooltipBg, 
            borderColor: colors.borderColor,
            color: colors.tooltipText,
            minWidth: '240px',
            boxShadow: theme === 'dark' 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <p className="font-bold border-b-2 pb-3 mb-4 text-base tracking-tight" style={{ borderColor: colors.borderColor }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-3 group">
              <span className="text-sm font-semibold flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div 
                  className="w-3 h-3 rounded-full mr-3 shadow-md ring-2 ring-offset-2 transition-transform group-hover:scale-110" 
                  style={{ 
                    backgroundColor: entry.color,
                    '--tw-ring-color': entry.color,
                    '--tw-ring-offset-color': colors.tooltipBg
                  } as React.CSSProperties}
                ></div>
                {entry.name}
              </span>
              <span className="text-sm font-bold font-mono ml-4 transition-all group-hover:scale-105" style={{ color: entry.color }}>
                {formatCurrency(entry.value as number)}
              </span>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t-2 flex justify-between items-center" style={{ borderColor: colors.borderColor }}>
            <span className="text-xs uppercase tracking-widest font-bold opacity-50">Type</span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border-2 shadow-sm transition-all hover:shadow-md ${
              data.type === 'public' 
                ? (theme === 'dark' ? 'bg-blue-900/50 text-blue-200 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200')
                : (theme === 'dark' ? 'bg-orange-900/50 text-orange-200 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200')
            }`}>
              {data.type}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className={`rounded-[2rem] shadow-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-3xl ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 
        theme === 'high-contrast' ? 'bg-white border-black border-4' : 'bg-white border-gray-200'
      }`}>
        
        {/* Dashboard Header - Enhanced */}
        <div 
          className={`p-10 border-b-2 backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
          style={{ background: colors.headerGradient }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-12 rounded-full animate-pulse"
                  style={{ background: colors.accentGradient }}
                ></div>
                <h1 className={`text-4xl font-black tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Tuition Analysis
                </h1>
              </div>
              <div className="flex items-center gap-3 ml-5">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'bg-gray-700/70 text-gray-300' : 'bg-white/70 text-gray-600 shadow-sm'
                }`}>
                  2024-2025
                </div>
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Comparative Fee Structures
                </span>
              </div>
            </div>

            {/* Enhanced Segmented Control */}
            <div className={`flex p-2 rounded-2xl border-2 backdrop-blur-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              {[
                { id: 'undergraduate', label: 'Undergraduate', icon: '🎓' },
                { id: 'international', label: 'International', icon: '🌍' },
                { id: 'postgraduate', label: 'Postgraduate', icon: '📚' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleViewTypeChange(tab.id as ViewType)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                    viewType === tab.id
                      ? (theme === 'dark' 
                          ? 'bg-gray-700 text-white shadow-xl scale-105' 
                          : 'bg-white text-blue-700 shadow-xl ring-2 ring-blue-500/20')
                      : (theme === 'dark' 
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10">
          {/* Chart Container - Enhanced */}
          <div className={`p-8 rounded-3xl border-2 mb-10 relative transition-all duration-300 hover:shadow-xl ${
            theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-inner'
          }`}>
            <div className="flex justify-between items-end mb-8 px-2">
              <div className="space-y-2">
                <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  Fee Distribution
                </h2>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Annual tuition cost per institution
                </p>
              </div>
              <div 
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-md ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                💰 GH₵
              </div>
            </div>

            <div className="w-full h-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataToDisplay}
                  margin={{ top: 20, right: 20, left: 0, bottom: 120 }}
                  barGap={8}
                >
                  <defs>
                    <linearGradient id="bar1Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.bar1} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors.bar1} stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="bar2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.bar2} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors.bar2} stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="5 5" 
                    vertical={false} 
                    stroke={colors.grid}
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{ fontSize: 11, fill: colors.text, fontWeight: 600 }}
                    tickMargin={15}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatAxisCurrency}
                    tick={{ fontSize: 12, fill: colors.text, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip 
                    content={CustomTooltip} 
                    cursor={{ 
                      fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      radius: 8
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '30px', fontSize: '13px', fontWeight: 600 }} 
                    iconType="circle"
                    iconSize={12}
                  />
                  <Bar
                    dataKey="fees"
                    name="Freshman/Annual"
                    fill="url(#bar1Gradient)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1800}
                    animationBegin={200}
                    maxBarSize={70}
                  />
                  {viewType === 'undergraduate' && (
                    <Bar
                      dataKey="continuing"
                      name="Continuing"
                      fill="url(#bar2Gradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1800}
                      animationBegin={400}
                      maxBarSize={70}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            title: 'Sector Disparity',
            description: 'Private institutions like Academic City and Ashesi exhibit 5x-10x higher tuition fees compared to public counterparts due to funding models.',
            color: 'blue',
            gradient: 'from-blue-500 to-indigo-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            ),
            title: 'Program Premiums',
            description: 'Specialized STEM programmes (Medicine, Engineering) and Law degrees consistently command the highest fees across both public and private sectors.',
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            title: 'Intl. Variance',
            description: 'International student fees are pegged to USD, creating significant cost divergence based on exchange rates, with medical programmes reaching premium tiers.',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-600'
          }
        ].map((card, index) => (
          <div 
            key={index}
            className={`group p-8 rounded-3xl border-2 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 text-white shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
            >
              {card.icon}
            </div>
            <h3 className={`font-black text-xl mb-4 tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {card.title}
            </h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {card.description}
            </p>
            <div className={`mt-6 pt-4 border-t transition-opacity opacity-0 group-hover:opacity-100 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Key Insight
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Footer Note */}
      <div className={`text-center py-6 px-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-50/50 text-gray-400'
      }`}>
        <p className="text-xs font-semibold tracking-wide">
          📊 Data sourced from official 2024-2025 University Fee Schedules
        </p>
        <p className="text-xs font-medium mt-1 opacity-70">
          Last verified October 2023
        </p>
      </div>
    </div>
  );
};

export default FeesComparisonDashboard;
