import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../../hooks/useTheme";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; borderLeft?: string }> = ({ children, className, onClick, borderLeft }) => {
  const { colors } = useTheme();
  return (
    <div 
      onClick={onClick}
      className={cn("bg-surface border rounded-lg p-6 transition-all duration-[250ms] hover:border-gold hover:shadow-sm", onClick && "cursor-pointer", className)}
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border,
        borderLeft: borderLeft ? `3px solid ${borderLeft}` : undefined
      }}
    >
      {children}
    </div>
  );
};

export const MetricCard: React.FC<{ label: string; value: string; delta?: string; color: string; className?: string }> = ({ label, value, delta, color, className }) => {
  const { colors } = useTheme();
  return (
    <div className={cn("bg-surface-alt border rounded-lg p-5 text-center", className)}
         style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border }}>
      <div className="text-4xl font-semibold leading-tight mb-1.5" style={{ color, fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-xs" style={{ color: colors.textMuted }}>{label}</div>
      {delta && <div className="text-[11px] mt-1 text-success" style={{ color: colors.success }}>{delta}</div>}
    </div>
  );
};
