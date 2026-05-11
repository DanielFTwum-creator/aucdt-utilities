import React from 'react';

const DatabaseGraph: React.FC = () => {
  return (
    <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <rect width="600" height="400" rx="24" fill="#F8FAFC"/>
      
      <rect x="40" y="40" width="240" height="160" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <rect x="40" y="40" width="240" height="40" rx="12 12 0 0" fill="#3B82F6"/>
      <text x="60" y="65" fill="white" fontWeight="800" fontFamily="Inter" fontSize="12">DIRECTORY_REGISTRY</text>
      <text x="60" y="100" fill="#64748B" fontSize="11" fontFamily="Inter">ID (UUID) - PK</text>
      <text x="60" y="120" fill="#64748B" fontSize="11" fontFamily="Inter">TITLE (TEXT)</text>
      <text x="60" y="140" fill="#64748B" fontSize="11" fontFamily="Inter">DESC (TEXT)</text>
      <text x="60" y="160" fill="#64748B" fontSize="11" fontFamily="Inter">URL (VARCHAR)</text>
      <text x="60" y="180" fill="#64748B" fontSize="11" fontFamily="Inter">CAT_ID (FK)</text>

      <rect x="320" y="220" width="240" height="140" rx="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
      <rect x="320" y="220" width="240" height="40" rx="12 12 0 0" fill="#F59E0B"/>
      <text x="340" y="245" fill="white" fontWeight="800" fontFamily="Inter" fontSize="12">AUDIT_LEDGER</text>
      <text x="340" y="280" fill="#64748B" fontSize="11" fontFamily="Inter">ID (BIGINT) - PK</text>
      <text x="340" y="300" fill="#64748B" fontSize="11" fontFamily="Inter">ACTION_TYPE (TEXT)</text>
      <text x="340" y="320" fill="#64748B" fontSize="11" fontFamily="Inter">TIMESTAMP (UTC)</text>
      <text x="340" y="340" fill="#64748B" fontSize="11" fontFamily="Inter">ACTOR_ID (UUID)</text>

      <path d="M280 120 C350 120 350 280 320 280" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4"/>
    </svg>
  );
};

export default DatabaseGraph;
