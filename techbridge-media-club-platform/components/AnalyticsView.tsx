import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ANALYTICS_DATA } from '../constants';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h2>
          <p className="text-sm text-gray-500">{t('analytics.subtitle')}</p>
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">
          <Download size={16} className="mr-2" />
          {t('analytics.export')}
        </button>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{t('analytics.trend')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1f2937' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#7A0019" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#7A0019', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#D4A017" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#D4A017', strokeWidth: 2, stroke: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#7A0019] mr-2"></span>
              {t('analytics.legend.views')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#D4A017] mr-2"></span>
              {t('analytics.legend.engagement')}
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{t('analytics.shares')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#f9fafb'}}
                   contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="shares" fill="#7A0019" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.topArticle')}</h4>
          <p className="text-2xl font-bold mt-2">The Future of AI</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">1.2k Views</span>
             <span className="ml-3">Sarah Mensah</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.topRegion')}</h4>
          <p className="text-2xl font-bold mt-2">Accra, Ghana</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">68% {t('analytics.card.traffic')}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <h4 className="text-white/80 text-sm font-medium uppercase tracking-wider">{t('analytics.card.avgSession')}</h4>
          <p className="text-2xl font-bold mt-2">4m 12s</p>
          <div className="mt-4 flex items-center text-sm text-white/90">
             <span className="bg-white/20 px-2 py-1 rounded">+12% {t('analytics.card.vsPrev')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;