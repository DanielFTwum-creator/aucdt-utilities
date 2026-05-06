import React from 'react';

const ArchitectureGraph: React.FC = () => {
  return (
    <svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
        </linearGradient>
        <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <rect width="800" height="400" rx="24" fill="#0F172A"/>
      
      <rect x="50" y="140" width="180" height="120" rx="16" fill="url(#blueGrad)" stroke="#3B82F6" strokeWidth="2"/>
      <text x="140" y="195" textAnchor="middle" fill="#60A5FA" fontFamily="Inter" fontWeight="700" fontSize="14">UI LAYER</text>
      <text x="140" y="215" textAnchor="middle" fill="#94A3B8" fontSize="11">React + Tailwind v4</text>

      <path d="M230 200 H330" stroke="#334155" strokeWidth="2" strokeDasharray="8 4"/>
      <circle cx="330" cy="200" r="5" fill="#3B82F6"/>

      <rect x="340" y="80" width="220" height="240" rx="16" fill="url(#emeraldGrad)" stroke="#10B981" strokeWidth="2"/>
      <text x="450" y="120" textAnchor="middle" fill="#34D399" fontFamily="Inter" fontWeight="700" fontSize="14">ORCHESTRATION</text>
      <line x1="360" y1="135" x2="540" y2="135" stroke="#10B981" strokeOpacity="0.2"/>
      <text x="450" y="165" textAnchor="middle" fill="#94A3B8" fontSize="11">Auth Guard / Audit</text>
      <text x="450" y="190" textAnchor="middle" fill="#94A3B8" fontSize="11">Tool Index Engine</text>
      <text x="450" y="215" textAnchor="middle" fill="#94A3B8" fontSize="11">Self-Testing Pipeline</text>
      <text x="450" y="240" textAnchor="middle" fill="#94A3B8" fontSize="11">Doc Generation</text>

      <path d="M560 200 H660" stroke="#334155" strokeWidth="2" strokeDasharray="8 4"/>
      <circle cx="660" cy="200" r="5" fill="#F59E0B"/>

      <rect x="670" y="140" width="100" height="120" rx="16" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="2"/>
      <text x="720" y="195" textAnchor="middle" fill="#FBBF24" fontFamily="Inter" fontWeight="700" fontSize="14">GEMINI 3</text>
      <text x="720" y="215" textAnchor="middle" fill="#94A3B8" fontSize="10">LLM Endpoint</text>
    </svg>
  );
};

export default ArchitectureGraph;
