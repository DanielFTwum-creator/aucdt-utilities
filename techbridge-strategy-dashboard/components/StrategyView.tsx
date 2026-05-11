import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, Building2, Gift, Network, Globe, UserCheck, Brain, Cpu, Palette, Box, Video, CheckCircle2, Trophy, Rocket, Target } from 'lucide-react';
import { useDashboardData } from '../contexts/DataContext';

const StrategyView: React.FC = () => {
  const { data } = useDashboardData();
  const { budget } = data;

  const totalBudget = budget.reduce((acc, item) => acc + item.value, 0);

  // Map budget items to the 6 priority areas from PDF Page 6
  // 01 Student Recruitment -> budget[0]
  // 02 Faculty Recruitment -> budget[1]
  // 03 Programme Enhancement -> Not in budget explicitly? Maybe part of something else or new.
  // 04 Accommodation Support -> budget[2]
  // 05 External Scholarships -> budget[3]
  // 06 Industry Partnerships -> budget[4]

  const roadmapItems = [
      {
          id: "01",
          title: "Student Recruitment",
          budget: "900,000 cedis",
          desc: "TikTok + YouTube + 15–25 school roadshows + billboards. Cut radio. Gen Z doesn't listen.",
          color: "border-red-600"
      },
      {
          id: "02",
          title: "Faculty Recruitment",
          budget: "540,000 cedis",
          desc: "Sponsor 6 lecturers for PhDs. Recruit 3 retired professors + 1 diaspora visiting professor.",
          color: "border-slate-800"
      },
      {
          id: "03",
          title: "Programme Enhancement",
          budget: "90,000 cedis",
          desc: "3 specialisation tracks + 5 short courses generating 208K cedis profit in Year 1.",
          color: "border-slate-800"
      },
      {
          id: "04",
          title: "Accommodation Support",
          budget: "90,000 cedis",
          desc: "15–20 private hostel partnerships with negotiated student discounts. Zero capital outlay.",
          color: "border-slate-800"
      },
      {
          id: "05",
          title: "External Scholarships",
          budget: "90,000 cedis",
          desc: "Apply to Mastercard Foundation, GETFund, 5 corporate sponsors. Target: 900K/yr by 2027.",
          color: "border-slate-800"
      },
      {
          id: "06",
          title: "Industry Partnerships",
          budget: "90,000 cedis",
          desc: "Claude for Education (Ghana's first), AWS Educate, Huawei credits, 10-company advisory board.",
          color: "border-slate-800"
      }
  ];

  return (
    <div className="space-y-8">
      
      {/* HEADER (PDF Page 6) */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 uppercase tracking-widest text-sm">Intervention Roadmap</h2>
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-2">Six Priority Areas — 12-Month Transformation Plan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item) => (
              <div key={item.id} className={`bg-white dark:bg-slate-800 p-6 border-t-4 ${item.color} shadow-sm flex flex-col h-full`}>
                  <p className="text-4xl font-serif font-bold text-slate-200 dark:text-slate-700 mb-4">{item.id}</p>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-xl font-serif font-bold text-slate-800 dark:text-slate-200 mb-4">{item.budget}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
          ))}
      </div>

    </div>
  );
};

export default StrategyView;