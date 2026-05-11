
import React, { useState, useEffect } from 'react';
import { DashboardData, CalculatedStats } from '../types';
import { TrendingUp, Clock, Target, AlertTriangle, ArrowRight, CheckCircle2, Calendar, FileText, BarChart3, LineChart as LineChartIcon, Plus, Minus } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, Area, ComposedChart, Legend, ReferenceLine } from 'recharts';

interface HeroStatProps {
  label: string;
  value: string | number;
  colorClass: string;
  subLabel: string;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const HeroStat = ({ label, value, colorClass, subLabel, onIncrement, onDecrement }: HeroStatProps) => (
  <div className="group relative bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] text-center flex flex-col justify-center print:bg-white print:border-slate-300 print:shadow-none hover:bg-[var(--border-color)] transition-all">
    <div className={`text-3xl md:text-4xl font-black mb-1 font-mono ${colorClass} print:text-black print:text-3xl break-words`}>{value}</div>
    <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] print:text-slate-700">{label}</div>
    <div className="text-[8px] text-[var(--text-muted)] font-mono mt-1 uppercase print:text-slate-500">{subLabel}</div>
    
    {/* Quick Edit Controls */}
    {onIncrement && onDecrement && (
      <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
        <button 
          onClick={(e) => { e.stopPropagation(); onDecrement(); }}
          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 backdrop-blur-sm transition-colors focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Decrease Count"
          aria-label="Decrease Completed Count"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onIncrement(); }}
          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 backdrop-blur-sm transition-colors focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          title="Increase Count"
          aria-label="Increase Completed Count"
        >
          <Plus size={14} />
        </button>
      </div>
    )}
  </div>
);

const DetailCard = ({ icon, title, value, children, borderColor, accentColor, sparklineData }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string | number, 
  children?: React.ReactNode,
  borderColor: string,
  accentColor: string,
  sparklineData?: { day: number, gap: number }[]
}) => (
  <div className={`relative p-5 rounded-xl bg-[var(--bg-card)] border-t-2 ${borderColor} overflow-hidden group hover:bg-[var(--border-color)] transition-colors print:bg-white print:border-slate-200 print:shadow-none page-break-inside-avoid`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`flex items-center gap-2 p-1.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-color)] print:bg-slate-100`}>
        {icon}
        <span className={`text-[10px] font-black tracking-widest text-[var(--text-muted)] print:text-slate-900`}>{title}</span>
      </div>
      <div className={`text-3xl font-black text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors font-mono print:text-slate-300`}>{value}</div>
    </div>
    
    <div className="flex items-end justify-between gap-4">
      <div className="relative z-10 text-[var(--text-muted)] print:text-slate-900 flex-1">
        {children}
      </div>
      
      {sparklineData && (
        <div className="h-12 w-20 opacity-80 group-hover:opacity-100 transition-opacity print:hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="gap" 
                stroke={accentColor === 'red' ? '#ef4444' : '#3b82f6'} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
              <YAxis hide domain={['dataMin', 'dataMax']} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[8px] text-center font-mono text-[var(--text-muted)] mt-1 uppercase">GAP TREND</div>
        </div>
      )}
    </div>
  </div>
);

interface Props {
  data: DashboardData;
  stats: CalculatedStats;
  trendPeriod: number;
  onTrendPeriodChange: (period: number) => void;
  onDataChange?: (data: DashboardData, reason: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl shadow-2xl backdrop-blur-xl min-w-[180px] z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-3 border-b border-[var(--border-color)] pb-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Day {label}</span>
          <div className="flex items-center gap-1">
             <Clock size={10} className="text-[var(--text-muted)]" />
             <span className="text-[10px] font-mono text-[var(--text-muted)]">SNAPSHOT</span>
          </div>
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex justify-between items-center gap-6 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
                  style={{ backgroundColor: entry.color, color: entry.color }} 
                />
                <span className="text-[var(--text-muted)] uppercase text-[9px] font-bold tracking-wider">
                  {entry.name === 'Target Scope' ? 'TARGET' : 
                   entry.name === 'Actual Progress' ? 'ACTUAL' : 
                   entry.name === 'Projection' ? 'PROJECTED' : entry.name}
                </span>
              </div>
              <span className="font-bold text-[var(--text-main)] tabular-nums">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const DashboardView: React.FC<Props> = ({ data, stats, trendPeriod, onTrendPeriodChange, onDataChange }) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state when logo url changes
  useEffect(() => {
    setImgError(false);
  }, [data.logoUrl]);

  const handleUpdateCompleted = (delta: number) => {
    if (onDataChange) {
      const newVal = Math.max(0, Math.min(data.totalAssessments, data.completed + delta));
      onDataChange({ ...data, completed: newVal }, `Quick Update: ${delta > 0 ? '+' : ''}${delta}`);
    }
  };

  const velocityMatch = stats.actualRate / (data.targetRate || 1);
  const matchColor = velocityMatch >= 1 ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="space-y-10">
      {/* Print Only Report Header */}
      <div className="print-only mb-12 border-b-2 border-slate-900 pb-6">
        <div className="flex justify-between items-start mb-6">
           {data.logoUrl && !imgError && (
             <img 
               src={data.logoUrl} 
               className="h-16 max-w-[200px] object-contain" 
               alt="Organization Logo"
               onError={() => setImgError(true)} 
             />
           )}
           <div className="text-right flex-1">
              <p className="text-xs font-bold text-slate-900 uppercase">Generated On</p>
              <p className="text-sm font-mono text-slate-700">{stats.todayDate}</p>
           </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{data.title}</h1>
            <p className="text-sm font-mono text-slate-600 uppercase tracking-widest">{data.itemLabel} Analytics • Final Status</p>
          </div>
        </div>
      </div>

      {/* Title Header */}
      <div className="text-center space-y-2 print:text-left print:mb-8">
        <h3 className="text-xs uppercase tracking-[0.5em] text-[var(--text-muted)] font-bold mb-4 font-mono print:hidden">{data.title}</h3>
        <h1 className="text-4xl md:text-6xl font-black text-[var(--accent-primary)] glow-emerald tracking-tight print:text-black print:text-4xl print:glow-none print:mb-2">
          {data.completed} <span className="text-[var(--text-main)] font-normal">of</span> {data.totalAssessments} {data.itemLabel}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm text-[var(--text-muted)] pt-2 print:justify-start print:text-slate-600 print:text-xs">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-500 print:text-slate-900" />
            <span>Started {new Date(data.startDate).toLocaleDateString()}</span>
          </div>
          <span className="text-[var(--border-color)]">•</span>
          <span>{stats.daysElapsed} days elapsed</span>
          <span className="text-[var(--border-color)]">•</span>
          <span>Target: {data.targetRate}/day</span>
          <span className="text-[var(--border-color)]">•</span>
          <span className="text-[var(--accent-primary)] font-bold print:text-slate-900">Est. Finish: {stats.projectedEndDate}</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 print:gap-2">
        <HeroStat 
          label="Completed" 
          value={data.completed} 
          colorClass="text-emerald-400" 
          subLabel="Done" 
          onIncrement={() => handleUpdateCompleted(1)}
          onDecrement={() => handleUpdateCompleted(-1)}
        />
        <HeroStat label="Remaining" value={stats.remaining} colorClass="text-blue-400" subLabel="To Go" />
        <HeroStat label="Progress" value={`${Math.round(stats.progressPercent)}%`} colorClass="text-amber-400" subLabel="Efficiency" />
        <HeroStat label="/Day Target" value={data.targetRate} colorClass="text-fuchsia-400" subLabel="Requirement" />
        <HeroStat label="/Day Actual" value={stats.actualRate.toFixed(2)} colorClass="text-red-400" subLabel="Velocity" />
        
        {/* New Stat */}
        <HeroStat label="Velocity Match" value={velocityMatch.toFixed(2)} colorClass={matchColor} subLabel="Performance" />
        
        <HeroStat label="Est. Finish" value={stats.projectedEndDate} colorClass="text-blue-400 text-base md:text-xl lg:text-2xl" subLabel="Trajectory" />
      </div>

      {/* Main Trend Analysis - Burnup Chart */}
      <div className="bg-[var(--bg-panel)] p-8 rounded-2xl border border-[var(--border-color)] print:hidden space-y-6">
         <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg">
              <TrendingUp size={20} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase text-[var(--text-muted)] font-bold tracking-widest">Projected Burnup Analysis</h4>
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Trajectory estimation based on current velocity</p>
            </div>
          </div>

          <div className="h-80 w-full bg-black/20 rounded-xl p-4 border border-[var(--border-color)]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats.burnupTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'PROJECT DAY', position: 'insideBottomRight', offset: -5, fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }} />
                
                {/* Target Line */}
                <Line 
                  name="Target Scope" 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />

                {/* Actual Progress (Solid) */}
                <Area 
                  name="Actual Progress"
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--accent-primary)" 
                  fill="var(--accent-primary)"
                  fillOpacity={0.15}
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />

                {/* Projection (Dashed) */}
                <Line 
                  name="Projection" 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#f59e0b" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />

                <ReferenceLine x={stats.daysElapsed} stroke="var(--border-color)" label={{ value: 'TODAY', fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono', position: 'insideTopLeft' }} />
                
                <ReferenceLine 
                  y={data.totalAssessments} 
                  stroke="#94a3b8" 
                  strokeDasharray="3 3" 
                  opacity={0.5}
                  label={{ value: 'TOTAL SCOPE', position: 'insideBottomRight', fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono', dy: -5 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Secondary Trend - Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-panel)] p-8 rounded-2xl border border-[var(--border-color)] print:hidden space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg">
                <BarChart3 size={20} className="text-red-400" />
              </div>
              <div>
                <h4 className="font-mono text-xs uppercase text-[var(--text-muted)] font-bold tracking-widest">Shortfall Trend</h4>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Gap Analysis (Last {trendPeriod} Days)</p>
              </div>
            </div>
            
            <div className="flex bg-[var(--bg-app)] p-1 rounded-lg border border-[var(--border-color)]">
              {[7, 14, 30].map((p) => (
                <button
                  key={p}
                  onClick={() => onTrendPeriodChange(p)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all ${
                    trendPeriod === p 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  aria-pressed={trendPeriod === p}
                >
                  {p}D
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 w-full bg-black/20 rounded-xl p-4 border border-[var(--border-color)] relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.gapTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="gap" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 3 }}
                  activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Bars Section */}
        <div className="space-y-8 bg-[var(--bg-panel)] p-8 rounded-2xl border border-[var(--border-color)] print:bg-white print:border-slate-300 print:p-6 page-break-inside-avoid">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse print:hidden"></span>
                <h4 className="font-mono text-xs uppercase text-[var(--text-muted)] font-bold tracking-widest print:text-slate-900">{data.itemLabel} Completion Status</h4>
              </div>
            </div>
            <ProgressBar 
              total={data.totalAssessments} 
              completed={data.completed} 
              colorClass="bg-emerald-500/80" 
              markerLabel={`#${data.completed}`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
               <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse print:hidden"></span>
                <h4 className="font-mono text-xs uppercase text-[var(--text-muted)] font-bold tracking-widest print:text-slate-900">Timeline Projection (Days)</h4>
              </div>
            </div>
            <ProgressBar 
              total={stats.projectedFinishDay} 
              completed={stats.daysElapsed} 
              colorClass="bg-amber-500/80" 
              markerLabel={`Day ${stats.daysElapsed}`}
              secondaryMarker={stats.originalFinishDay}
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] print:text-slate-900 uppercase font-bold">
              <span>Day 0 (Start)</span>
              <span className="text-amber-500 print:text-slate-900">Today (Day {stats.daysElapsed})</span>
              <span>Est. End (Day {stats.projectedFinishDay})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4">
        <DetailCard 
          icon={<CheckCircle2 size={18} className="text-emerald-400" />}
          title="VELOCITY ANALYTICS"
          value={stats.actualRate.toFixed(2)}
          borderColor="border-emerald-500/30"
          accentColor="emerald"
        >
          <div className="space-y-1 font-mono text-xs">
            <p>Volume: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{data.completed} {data.itemLabel}</span></p>
            <p>Time: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{stats.daysElapsed} days</span></p>
            <p>Avg Rate: <span className="text-emerald-400 print:text-slate-900 font-bold">{stats.avgDaysEach.toFixed(1)} days/item</span></p>
          </div>
        </DetailCard>

        <DetailCard 
          icon={<ArrowRight size={18} className="text-blue-400" />}
          title="WORK REMAINING"
          value={stats.remaining}
          borderColor="border-blue-500/30"
          accentColor="blue"
        >
          <div className="space-y-1 font-mono text-xs">
            <p>Backlog: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{stats.remaining} {data.itemLabel}</span></p>
            <p>Est. Time: <span className="text-emerald-400 print:text-slate-900 font-bold">{stats.daysRemainingAtTarget} days</span></p>
            <p>Date: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{stats.projectedEndDate}</span></p>
          </div>
        </DetailCard>

        <DetailCard 
          icon={<Target size={18} className="text-amber-400" />}
          title="TARGET BENCHMARK"
          value={data.targetRate}
          borderColor="border-amber-500/30"
          accentColor="amber"
        >
          <div className="space-y-1 font-mono text-xs">
            <p>Rate: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{data.targetRate}/day</span></p>
            <p>Weekly: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{stats.weeklyTarget}/week</span></p>
            <p>Dead-line: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">Day {stats.originalFinishDay}</span></p>
          </div>
        </DetailCard>

        <DetailCard 
          icon={<AlertTriangle size={18} className="text-red-400" />}
          title="CRITICAL GAP"
          value={stats.shortfall.toFixed(0)}
          borderColor="border-red-500/30"
          accentColor="red"
          sparklineData={stats.gapTrend}
        >
          <div className="space-y-1 font-mono text-xs">
            <p>Status: <span className="text-red-400 print:text-slate-900 font-bold">{stats.shortfall > 0 ? 'Shortfall' : 'Surplus'}</span></p>
            <p>Required Today: <span className="text-[var(--text-main)] print:text-slate-900 font-bold">{stats.expectedAtCurrentDay} {data.itemLabel}</span></p>
            <p>Gap: <span className="text-red-400 print:text-slate-900 font-bold">{stats.gapMultiplier.toFixed(1)}x target</span></p>
          </div>
        </DetailCard>
      </div>

      {/* Footer Info for PDF */}
      <div className="print-only mt-auto pt-12 text-center text-[8pt] text-slate-500 border-t border-slate-100 italic">
        This report was generated automatically based on current project parameters. 
        Data accuracy is subject to the input metrics provided at the time of export.
      </div>
    </div>
  );
};

export default DashboardView;
