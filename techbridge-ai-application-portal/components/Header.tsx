import React, { useState } from 'react';
import { Theme } from '../types';

interface HeaderProps {
    totalApps: number;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    onAdminClick: () => void;
    onIndexClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalApps, theme, onThemeChange, onAdminClick, onIndexClick }) => {
    const [currentDate] = useState(() => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).toUpperCase();
    });

    return (
        <header className="relative bg-brand-ink border-b-4 border-brand-gold pt-8 pb-6 animate-fade-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    {/* Left Column: Date & Edition */}
                    <div className="hidden md:flex flex-col items-start border-l-2 border-brand-gold/30 pl-4">
                        <span className="font-bebas text-brand-gold text-xl tracking-widest">{currentDate}</span>
                        <span className="font-dm-sans text-brand-gold-pale text-xs uppercase tracking-widest mt-1">Vol. III • Issue No. 04</span>
                    </div>

                    {/* Center Column: Masthead */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                            <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="Techbridge Seal" className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <h1 className="font-playfair font-black text-4xl md:text-6xl text-brand-cream uppercase tracking-tight leading-[0.9]">
                            TechBridge
                        </h1>
                        <span className="font-playfair italic text-2xl md:text-3xl text-brand-gold mt-1">University College</span>
                    </div>

                    {/* Right Column: Issue Badge & Controls */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={onIndexClick}
                                className="md:hidden font-bebas text-brand-gold hover:text-brand-cream transition-colors tracking-wider text-lg border border-brand-gold/50 px-3 py-1"
                            >
                                INDEX
                            </button>
                            <button 
                                onClick={onAdminClick}
                                className="font-bebas text-brand-gold hover:text-brand-cream transition-colors tracking-wider text-lg"
                            >
                                ADMIN ACCESS
                            </button>
                            <div className="h-4 w-px bg-brand-gold/30"></div>
                            <div className="flex space-x-2">
                                {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => onThemeChange(t)}
                                        className={`w-3 h-3 rounded-full border border-brand-gold transition-all ${theme === t ? 'bg-brand-gold scale-125' : 'bg-transparent hover:bg-brand-gold/50'}`}
                                        aria-label={`Switch to ${t} theme`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="border border-brand-gold/30 p-2 bg-brand-paper/50 backdrop-blur-sm hidden md:block">
                            <div className="flex flex-col items-center px-4 py-1">
                                <span className="font-bebas text-brand-gold text-2xl leading-none">{totalApps}</span>
                                <span className="font-dm-sans text-[10px] text-brand-gold-pale uppercase tracking-wider">Active Modules</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Date (visible only on small screens) */}
                <div className="md:hidden mt-6 text-center border-t border-brand-gold/20 pt-4 flex justify-between items-center">
                    <span className="font-bebas text-brand-gold text-lg tracking-widest">{currentDate}</span>
                    <div className="border border-brand-gold/30 p-1 bg-brand-paper/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center px-2">
                            <span className="font-bebas text-brand-gold text-lg leading-none">{totalApps}</span>
                            <span className="font-dm-sans text-[8px] text-brand-gold-pale uppercase tracking-wider">Apps</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
