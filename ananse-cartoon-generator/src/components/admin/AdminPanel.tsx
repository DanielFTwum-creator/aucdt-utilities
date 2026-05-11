import React from 'react';

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0F0C07] text-[#F2EBD9] p-12 font-serif">
      <div className="max-w-4xl mx-auto border border-[#C8A84B]/30 p-12 bg-[#141210]">
        <h1 className="text-4xl font-black text-[#C8A84B] uppercase mb-4 tracking-widest">Administrative Control</h1>
        <p className="italic text-[#C8A84B]/60 mb-12 border-b border-[#C8A84B]/20 pb-4">TUC Secure Diagnostic Node</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">System Status</h3>
                <p className="text-2xl font-bold">OPERATIONAL</p>
            </div>
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">Environment</h3>
                <p className="text-2xl font-bold">REACT 19.2.4</p>
            </div>
        </div>

        <button 
            onClick={onLogout}
            className="px-8 py-3 border border-[#C8A84B] text-[#C8A84B] hover:bg-[#C8A84B] hover:text-[#0F0C07] transition-all uppercase font-bold tracking-widest text-xs"
        >
            Exit Terminal
        </button>
      </div>
    </div>
  );
};
