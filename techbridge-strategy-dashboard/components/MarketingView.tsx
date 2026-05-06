import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Radio, MapPin, Smartphone, Megaphone, Users, Calendar, Video, Music, ArrowUpRight, Cpu, CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '../contexts/DataContext';

const MarketingView: React.FC = () => {
  const { data } = useDashboardData();
  const { marketing } = data;

  return (
    <div className="space-y-8">
      
      {/* HEADER (PDF Page 7) */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 uppercase tracking-widest text-sm">Market Validated</h2>
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2">TechBridge Saw This First. KNUST Just Confirmed It.</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Validation Narrative */}
          <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 border-l-4 border-slate-900 dark:border-slate-500">
                  <p className="text-lg font-serif italic text-slate-700 dark:text-slate-300 leading-relaxed">
                      "KNUST's announcement confirms our foresight. We are building the future of education alongside Ghana's premier institutions."
                  </p>
              </div>

              <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm border-b border-slate-200 pb-2">Strategic Alignment</h4>
                  
                  <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full shrink-0">
                          <CheckCircle2 className="text-green-600 dark:text-green-400 w-5 h-5" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-800 dark:text-white">Validation</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">KNUST's strategic pivot validates the market direction TechBridge identified 12 months ago.</p>
                      </div>
                  </div>

                  <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full shrink-0">
                          <Cpu className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-800 dark:text-white">Execution Lead</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Crucial Difference: We are execution-ready. All 4 major programmes have functional AI MVP apps already prototyped.</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Right: In Good Company Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white p-8 rounded-xl shadow-lg relative overflow-hidden border border-indigo-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                <div className="inline-block px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-xs font-bold border border-green-400/30 text-green-300">
                    MARKET VALIDATED
                </div>
                <ArrowUpRight className="text-blue-200" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">In Good Company</h2>
                <p className="text-indigo-100 mb-8 max-w-sm font-medium text-lg">
                TechBridge × KNUST × Industry Leaders
                </p>
                
                <div className="space-y-6 mb-8">
                <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-700">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-indigo-300 font-bold uppercase">Product Advantage</p>
                        <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                    <Cpu size={18} className="text-indigo-300" />
                    <span className="text-base text-white font-semibold">AI 101 Seminar (Live)</span>
                    </div>
                    <div className="border-t border-indigo-800/50 pt-3 grid grid-cols-2 gap-y-2 gap-x-4">
                        {['Fashion', 'Jewellery', 'Product', 'Digital Media'].map(prog => (
                            <div key={prog} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <span className="text-xs text-indigo-100 leading-tight">{prog} App</span>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
      </div>

      {/* Recommended Next Steps (PDF Page 7 Bottom) */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm mb-6">Recommended Next Steps</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-2">Approve Rebrand</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Immediate authorization to proceed with "TechBridge" identity rollout.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-2">Release Funding</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tranche 1 of 1.75M GHS investment to secure Q1-Q2 priorities.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
                  <h5 className="font-bold text-slate-900 dark:text-white mb-2">Launch Campaign</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Initiate "Future Ready" recruitment drive targeting 250 students.</p>
              </div>
          </div>
      </div>

    </div>
  );
};

export default MarketingView;