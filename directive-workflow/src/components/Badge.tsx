import React from "react";

interface BadgeProps {
  label: string;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  return (
    <span 
      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
      style={{ 
        color: color, 
        backgroundColor: `${color}15`, 
        borderColor: `${color}33` 
      }}
    >
      {label}
    </span>
  );
};
