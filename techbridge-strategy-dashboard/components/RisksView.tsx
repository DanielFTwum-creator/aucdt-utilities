import React from 'react';
import { AlertTriangle, Shield, TrendingDown, Clock, CheckCircle } from 'lucide-react';

const RisksView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Risk Management Matrix</h2>
        <div className="space-y-4">
            {[
                {
                    id: 1,
                    risk: "Execution Speed",
                    severity: "High",
                    mitigation: "7-day press conference deadline, daily progress tracking.",
                    contingency: "Pivot to Street Teams & Flyers if media launch stalls.",
                    icon: Clock
                },
                {
                    id: 2,
                    risk: "PhD Recruitment Failure",
                    severity: "High",
                    mitigation: "Multi-source strategy, moonlighting model, 'Acting HoD' interim.",
                    contingency: "Request GTEC extension showing good-faith effort.",
                    icon: AlertTriangle
                },
                {
                    id: 3,
                    risk: "TikTok Algo Shifts",
                    severity: "Medium",
                    mitigation: "Diversify across 5+ influencers, use paid boosts.",
                    contingency: "Activate Student Representative Council (SRC) networks manually.",
                    icon: TrendingDown
                },
                {
                    id: 4,
                    risk: "Global Partner Rejection",
                    severity: "Medium",
                    mitigation: "Apply to multiple programmes (AWS, Huawei backups).",
                    contingency: "Emphasize local 'Industry Captains' as alternative social proof.",
                    icon: Shield
                }
            ].map((item) => {
                const Icon = item.icon;
                return (
                    <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
                        <div className={`p-3 rounded-full mr-4 mb-3 md:mb-0 shrink-0 ${item.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                            <div className="md:col-span-3">
                                <h3 className="font-bold text-slate-800 dark:text-white">{item.risk}</h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                    {item.severity} Severity
                                </span>
                            </div>
                            <div className="md:col-span-4">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase mb-1">Mitigation</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{item.mitigation}</p>
                            </div>
                            <div className="md:col-span-5">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase mb-1">Contingency</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{item.contingency}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Proven Product-Market Fit</h3>
            </div>
            <p className="text-emerald-800 dark:text-emerald-200 text-sm">
                Despite risks, we have validated demand. We accepted 350 students last cycle but lost them to brand perception ("Is this a real uni?"). The rebrand and visible campus vibe directly fixes this.
            </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
                <Shield className="text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-blue-900 dark:text-blue-100">Founder Protection</h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
                The plan is designed to reduce Founder dependency. By 2027, external scholarships and increased revenue reduce the monthly burn significantly, aiming for full independence by 2028.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RisksView;