
import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', candidates: 12, avgScore: 65 },
  { name: 'Tue', candidates: 18, avgScore: 72 },
  { name: 'Wed', candidates: 15, avgScore: 68 },
  { name: 'Thu', candidates: 25, avgScore: 75 },
  { name: 'Fri', candidates: 30, avgScore: 82 },
  { name: 'Sat', candidates: 10, avgScore: 78 },
  { name: 'Sun', candidates: 5, avgScore: 70 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Brand Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Enrolled Candidates', value: '1,248', icon: <Users />, trend: '+12%', color: 'bg-brand-maroon text-white' },
          { label: 'Active Curriculums', value: '24', icon: <BookOpen />, trend: '+2', color: 'bg-brand-gold text-brand-maroon' },
          { label: 'Evaluation Queue', value: '18', icon: <CheckSquare />, trend: 'Urgent', color: 'bg-white border-2 border-brand-maroon text-brand-maroon' },
          { label: 'Course Completion', value: '84%', icon: <Clock />, trend: '+5%', color: 'bg-slate-900 text-brand-gold' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-8 rounded-3xl shadow-lg border border-white/5 group transition-transform hover:scale-105`}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/10">{stat.icon}</div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-black/10 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-70">{stat.label}</h3>
            <p className="text-3xl font-black mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart - Brand Palette */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2rem] border-2 border-brand-maroon/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-brand-maroon tracking-tight uppercase">Institutional Performance Metrics</h2>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-maroon"></span>
              <span className="w-3 h-3 rounded-full bg-brand-gold"></span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B1D1D" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6B1D1D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B1D1D', fontSize: 11, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B1D1D', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="candidates" stroke="#6B1D1D" fillOpacity={1} fill="url(#colorBrand)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Queue with Brand Styling */}
        <div className="bg-brand-maroon text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
              PENDING EVALUATIONS
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Alex Rivera', role: 'Full Stack Dev', time: '2h ago', avatar: 'https://picsum.photos/40/40?random=1' },
                { name: 'Sarah Chen', role: 'Java Specialist', time: '4h ago', avatar: 'https://picsum.photos/40/40?random=2' },
                { name: 'John Doe', role: 'DevOps Lead', time: '1d ago', avatar: 'https://picsum.photos/40/40?random=3' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-2xl transition-all cursor-pointer group">
                  <img src={activity.avatar} className="w-12 h-12 rounded-full border-2 border-brand-gold/30" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-sm tracking-tight">{activity.name}</p>
                    <p className="text-[10px] font-bold text-brand-gold/60 uppercase">{activity.role}</p>
                  </div>
                  <ArrowRight size={16} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-brand-gold text-brand-maroon font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
              Access Review Portal
            </button>
          </div>
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-gold/5 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
