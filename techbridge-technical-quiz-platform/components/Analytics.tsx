
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Award, Target, Zap, Clock } from 'lucide-react';

const categoryData = [
  { subject: 'Java Core', A: 85, B: 70, fullMark: 100 },
  { subject: 'Spring Boot', A: 65, B: 80, fullMark: 100 },
  { subject: 'MariaDB', A: 90, B: 60, fullMark: 100 },
  { subject: 'DevOps', A: 40, B: 55, fullMark: 100 },
  { subject: 'Soft Skills', A: 75, B: 90, fullMark: 100 },
];

const distributionData = [
  { range: '0-20', count: 5 },
  { range: '21-40', count: 12 },
  { range: '41-60', count: 25 },
  { range: '61-80', count: 48 },
  { range: '81-100', count: 32 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pass Rate', value: '68%', icon: <Target className="text-indigo-500" />, sub: 'Cohort Average' },
          { label: 'Top Score', value: '98/100', icon: <Award className="text-emerald-500" />, sub: 'Sarah Chen' },
          { label: 'Avg Time', value: '42m', icon: <Clock className="text-amber-500" />, sub: 'Out of 60m' },
          { label: 'Completion', value: '94%', icon: <Zap className="text-purple-500" />, sub: 'Active Sessions' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700">{stat.icon}</div>
              <span className="text-sm font-bold opacity-60 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-3xl font-black mb-1">{stat.value}</p>
            <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Score Distribution
            <span className="text-xs font-normal opacity-50 px-2 py-0.5 bg-slate-100 rounded-full">Histogram</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Map */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">Cohort Competency Map</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 11}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current Candidate" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="Average Cohort" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip contentStyle={{borderRadius: '16px'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
