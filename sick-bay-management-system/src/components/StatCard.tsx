import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  count: number | string;
  label: string;
  subtext: string | React.ReactNode;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function StatCard({
  id,
  status,
  count,
  label,
  subtext,
  icon: Icon,
  onClick
}: StatCardProps) {
  // Determine color theme based strictly on status
  let cardClass = '';
  let iconContainerClass = '';
  
  switch (status) {
    case 'success':
      // Emerald Theme (Safe State)
      cardClass = 'bg-emerald-500 text-slate-950 border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]';
      iconContainerClass = 'bg-[#0f172a]/10 text-slate-950 border border-slate-900/20';
      break;
    case 'danger':
      // Rose/Red Theme (High Urgency)
      cardClass = 'bg-rose-500 text-white border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]';
      iconContainerClass = 'bg-white/20 text-white border border-white/20';
      break;
    case 'warning':
      // Vivid Orange Theme (Medium Urgency / Action Required)
      // We use premium safety orange instead of gold/amber to distinguish from TUC Gold Active Bed Banner
      cardClass = 'bg-orange-500 text-white border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]';
      iconContainerClass = 'bg-white/20 text-white border border-white/20';
      break;
    case 'info':
    default:
      // Indigo/Blue Theme (Status / Informational)
      cardClass = 'bg-indigo-600 text-white border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]';
      iconContainerClass = 'bg-white/20 text-white border border-white/20';
      break;
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-[2rem] p-5 flex flex-col justify-between space-y-3 transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) ${
        onClick ? 'cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0f172a]' : ''
      } ${cardClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider opacity-90">{label}</span>
        <span className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${iconContainerClass}`}>
          <Icon className="w-5 h-5 stroke-[2.5]" />
        </span>
      </div>
      <div>
        <span className="text-4xl font-black tracking-tight leading-none block">{count}</span>
        <div className="text-[11px] font-bold uppercase mt-1.5 opacity-90 tracking-wide leading-tight">
          {subtext}
        </div>
      </div>
    </div>
  );
}
