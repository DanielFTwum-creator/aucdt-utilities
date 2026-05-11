import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TrendingDown, Users, DollarSign, CheckCircle2, CheckCircle, ArrowUpRight, Zap, Cpu } from 'lucide-react';
import MetricCard from './MetricCard';
import { useDashboardData } from '../contexts/DataContext';

const Overview: React.FC = () => {
  const { data } = useDashboardData();
  const { funnel, metrics } = data;

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: THE SITUATION AT A GLANCE (PDF Page 2) */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 uppercase tracking-widest text-sm">The Situation At A Glance</h2>
            <p className="text-slate-600 dark:text-slate-300 italic font-serif text-lg mt-1">Four numbers that define TechBridge's current position and the intervention opportunity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Enrollment */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-slate-800 dark:border-slate-500 shadow-sm">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Current Enrollment</p>
                <p className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4">{metrics.currentEnrollment}</p>
                <div className="space-y-1">
                    <p className="text-sm text-slate-500 italic">Target: {metrics.capacity} by Dec 2026</p>
                    <p className="text-sm font-bold text-red-600">↓ {metrics.conversionDropoutRate} conversion dropout</p>
                </div>
            </div>

            {/* Card 2: Weekly Loss */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-red-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Weekly Loss (Est.†)</p>
                <p className="text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4">12,019</p>
                <div className="space-y-1">
                    <p className="text-sm text-slate-500 italic">GHS foregone contribution</p>
                    <p className="text-xs text-slate-400">† See methodology, Slide 4</p>
                </div>
            </div>

            {/* Card 3: Immediate Investment */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-amber-600 shadow-sm">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Immediate Investment</p>
                <p className="text-6xl font-serif font-bold text-amber-600 mb-4">1.75M</p>
                <div className="space-y-1">
                    <p className="text-sm text-slate-500 italic">Cedis — 6 Priority Areas</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Payback within 12 months</p>
                </div>
            </div>

            {/* Card 4: Projected Return */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-green-700 shadow-sm">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Projected 5yr Return</p>
                <p className="text-6xl font-serif font-bold text-green-700 dark:text-green-500 mb-4">51.7M</p>
                <div className="space-y-1">
                    <p className="text-sm text-slate-500 italic">Cedis — ROI: {metrics.roi}</p>
                    <p className="text-sm font-bold text-green-700 dark:text-green-500">↑ Break-even by Feb 2027</p>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: THE CORE PROBLEM (PDF Page 3) */}
      <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 uppercase tracking-widest text-sm">The Core Problem</h2>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2">Conversion Crisis: We Lose {metrics.conversionDropoutRate} of Qualified Students at the Final Decision Moment</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={funnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                            />
                            <Bar dataKey="count" barSize={40}>
                                {funnel.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 italic mt-4 text-center">2017–2026 cumulative data: 991 sign-ups → 166 registered. 52% of accepted students never enroll.</p>
            </div>

            {/* Callout Area */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                <p className="text-[80px] font-serif font-bold text-red-700 dark:text-red-500 leading-none mb-4">{metrics.conversionDropoutRate}</p>
                <div className="border-t-2 border-red-700 w-16 mb-4"></div>
                <p className="font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-6">Conversion<br/>Dropout Rate</p>
                <p className="text-slate-500 italic font-serif">Qualified, accepted students who do not complete registration.</p>
            </div>
        </div>

        <div className="bg-slate-900 text-white p-4 flex items-center justify-center space-x-4">
            <span className="font-bold uppercase tracking-widest text-sm">LEVERAGE:</span>
            <span className="font-serif italic">4 Prototyped AI Apps prove Future-Ready today</span>
        </div>
      </div>

    </div>
  );
};

export default Overview;