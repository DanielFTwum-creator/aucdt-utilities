
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  onRefreshClick?: () => void;
}

const Logo: React.FC = () => (
  <svg width="50" height="50" viewBox="0 0 100 100" className="mr-4">
    <circle cx="50" cy="50" r="48" fill="#C8A84B" stroke="#2C1810" strokeWidth="4" />
    <text x="50" y="62" fontFamily="serif" fontSize="45" fontWeight="black" fill="#2C1810" textAnchor="middle">T</text>
  </svg>
);

export const Header: React.FC<Props> = ({ onRefreshClick }) => {
  return (
    <header className="bg-white border-b-4 border-[#C8A84B] shadow-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
                <Logo />
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight uppercase leading-none">Brand Checker</h1>
                    <p className="text-[10px] font-bold text-[#C8A84B] uppercase tracking-widest mt-1">Institutional Compliance</p>
                </div>
            </div>
            
            {onRefreshClick && (
                <button 
                    onClick={onRefreshClick}
                    className="flex items-center gap-2 px-4 py-2 text-[#2C1810] hover:text-[#C8A84B] transition-colors group"
                >
                    <RefreshCw size={18} className="group-hover:animate-spin-slow" />
                    <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Refresh Protocol</span>
                </button>
            )}
        </div>
      </div>
    </header>
  );
};
