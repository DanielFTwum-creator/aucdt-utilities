
import { ArrowLeft, Construction, Cpu, ShieldAlert } from 'lucide-react';
import React from 'react';

interface PlaceholderProps {
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ 
  onBack, 
  title = "Module Under Construction", 
  subtitle = "This specialized AI sub-system is currently undergoing security hardening and university protocol alignment." 
}) => {
  return (
    <div className="pt-32 pb-20 px-4 md:px-8 lg:px-16 bg-techbridge-cream dark:bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <div className="relative inline-block mb-12">
          <div className="w-32 h-32 bg-techbridge-burgundy/5 rounded-full flex items-center justify-center animate-pulse">
            <Construction size={64} className="text-techbridge-burgundy" />
          </div>
          <div className="absolute -top-2 -right-2 bg-techbridge-gold p-2 rounded-lg shadow-xl animate-bounce">
            <ShieldAlert size={20} className="text-techbridge-burgundy-dark" />
          </div>
        </div>

        <h2 className="text-6xl md:text-8xl font-black text-techbridge-burgundy dark:text-white mb-6 uppercase tracking-tighter font-serif">
          {title}
        </h2>
        
        <div className="h-2 w-24 bg-techbridge-gold mx-auto mb-10 rounded-full"></div>
        
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          {subtitle}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto">
          {[
            { icon: <Cpu className="text-techbridge-gold" />, label: "Security Audit", status: "Active" },
            { icon: <ShieldAlert className="text-techbridge-gold" />, label: "Privacy Filter", status: "Pending" },
            { icon: <Construction className="text-techbridge-gold" />, label: "API Handshake", status: "Finalizing" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-techbridge-beige dark:border-slate-700 shadow-sm">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-techbridge-burgundy dark:text-gray-300 mb-1">{item.label}</h4>
              <p className="text-xs font-bold text-gray-500">{item.status}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onBack}
          className="inline-flex items-center gap-3 bg-techbridge-burgundy text-white px-10 py-5 rounded-2xl font-black hover:bg-techbridge-burgundy-dark transition-all transform hover:-translate-x-2 shadow-xl shadow-techbridge-burgundy/20 uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={18} />
          Return to Command Centre
        </button>
      </div>
    </div>
  );
};

export default Placeholder;
