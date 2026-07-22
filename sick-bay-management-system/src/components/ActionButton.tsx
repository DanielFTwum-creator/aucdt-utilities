import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  id: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function ActionButton({
  id,
  onClick,
  variant,
  label,
  icon: Icon,
  iconClassName = 'w-4 h-4 stroke-[3]'
}: ActionButtonProps) {
  // Styles based on primary vs secondary hierarchy
  const baseClass = "font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl border-2 border-slate-900 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-slate-300 focus:ring-offset-2";
  
  const variantClass = variant === 'primary'
    ? "bg-emerald-500 text-slate-950 shadow-[4px_4px_0px_#0f172a] hover:bg-emerald-400 hover:shadow-[6px_6px_0px_#0f172a] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0f172a]"
    : "bg-white text-slate-900 shadow-[4px_4px_0px_#0f172a] hover:bg-slate-50 hover:shadow-[6px_6px_0px_#0f172a] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0f172a]";

  return (
    <button
      id={id}
      onClick={onClick}
      className={`${baseClass} ${variantClass}`}
    >
      <Icon className={iconClassName} />
      <span>{label}</span>
    </button>
  );
}
