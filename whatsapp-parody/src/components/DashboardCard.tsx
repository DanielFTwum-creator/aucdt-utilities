import React from "react";

export const DashboardCard: React.FC = () => {
  return (
    <div className="bg-[#0d2137] border border-[#1a3a55] rounded-lg p-3 my-1 text-center shadow-inner">
      <div className="text-[9px] font-bold text-[#8696a0] uppercase tracking-widest mb-2">
        🖥️ My Legendary Dashboard™
      </div>
      <div className="text-2xl font-black text-[#ff6b35] leading-tight mb-1">
        HELLO WORLD
      </div>
      <div className="text-[9px] text-[#8696a0] mb-3">
        Total Records: 1 <span className="mx-1 opacity-30">|</span> Last Updated: Never
      </div>
      <div className="flex gap-2 justify-center mb-3">
        <button className="bg-[#00a884] text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/10 active:scale-95 transition-transform">
          CLICK ME
        </button>
        <button className="bg-[#8696a0]/20 text-[#8696a0] text-[10px] font-bold px-4 py-1.5 rounded-full active:scale-95 transition-transform">
          DON'T CLICK
        </button>
      </div>
      <div className="text-[8px] text-[#53bdeb] font-bold tracking-tight">
        🚀 Powered by 3 Stack Overflows & 1 ChatGPT
      </div>
    </div>
  );
};
