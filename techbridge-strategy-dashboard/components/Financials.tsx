import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, ComposedChart } from 'recharts';
import { useDashboardData } from '../contexts/DataContext';

const Financials: React.FC = () => {
  const { data } = useDashboardData();
  const { financials, metrics } = data;

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: FINANCIAL IMPACT (PDF Page 4) */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 uppercase tracking-widest text-sm">Financial Impact</h2>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2">The Burn Rate and Its Cause</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Root Cause Analysis */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Root Cause Analysis</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                        TechBridge currently enrolls {metrics.currentEnrollment} students against a minimum viability threshold of {metrics.capacity} — the level required for operational sustainability and regulatory standing. At GHS 5,500 annual tuition per student, current enrollment generates an estimated GHS 687,500 in tuition revenue against {metrics.burnRate} in total operating costs.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                        The institution is structurally supported by founder subsidy. Every additional enrolled student reduces that dependency by GHS 5,500 annually. Closing the {metrics.capacity - metrics.currentEnrollment}-student enrollment gap returns an estimated GHS 625,000 in annual contribution margin — meaningful relief on the subsidy burden.
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                        Root cause analysis identifies brand perception tied to the former name (AsanSka) as the primary conversion barrier. GTEC approval of the TechBridge rebrand opens an immediate, time-critical window ahead of the April–June recruitment cycle for July 2026 intake.
                    </p>
                </div>
            </div>

            {/* Right: Metrics */}
            <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 border-l-4 border-red-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Est. Weekly Contribution Foregone †</p>
                    <p className="text-5xl font-serif font-bold text-red-700 dark:text-red-500 mb-2">GHS 12,019</p>
                    <p className="text-slate-600 dark:text-slate-300 italic font-serif">Per week the enrollment gap persists</p>
                    <p className="text-xs text-slate-400 mt-4">† ({metrics.currentEnrollment} students × GHS 5,000 net contribution) ÷ 52 weeks. Estimated. Full management accounts review recommended.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Enrollment Gap</p>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-4xl font-serif font-bold text-red-700 dark:text-red-500">{metrics.currentEnrollment}</p>
                            <p className="text-xs text-slate-500">Current Enrollment</p>
                        </div>
                        <div className="h-12 w-px bg-slate-300"></div>
                        <div className="text-right">
                            <p className="text-4xl font-serif font-bold text-green-700 dark:text-green-500">{metrics.capacity}</p>
                            <p className="text-xs text-slate-500">Min. Viability Threshold</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: INTERVENTION OPPORTUNITY (PDF Page 5) */}
      <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 uppercase tracking-widest text-sm">The Intervention Opportunity</h2>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2">We've Already Built the Solution. Now We Need to Fund It.</h3>
        </div>

        <div className="bg-slate-900 text-white p-8 mb-6">
            <p className="text-xl font-serif italic leading-relaxed text-center">
                "{metrics.immediateInvestment.replace('M GHS', ',000 cedis')} invested now returns {metrics.projectedReturn.replace('GHS', 'cedis')} over five years — a {metrics.roi} ROI. July 2026 intake closes in weeks. Every week of delay costs an estimated GHS 12,019 in foregone tuition contribution."
            </p>
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">— TechBridge Strategic Financial Model, February 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-slate-900 dark:border-slate-500 shadow-sm">
                <p className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">{metrics.immediateInvestment.replace(' GHS', '')}</p>
                <p className="text-sm italic text-slate-600 dark:text-slate-400">Cedis Immediate<br/>Investment Required</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-green-700 shadow-sm">
                <p className="text-4xl font-serif font-bold text-green-700 dark:text-green-500 mb-2">{metrics.projectedReturn.replace(' GHS', '')}</p>
                <p className="text-sm italic text-slate-600 dark:text-slate-400">Cedis Projected<br/>5-Year Return</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 border-t-4 border-amber-600 shadow-sm">
                <p className="text-4xl font-serif font-bold text-amber-600 mb-2">{metrics.roi}</p>
                <p className="text-sm italic text-slate-600 dark:text-slate-400">Return on<br/>Investment</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Financials;