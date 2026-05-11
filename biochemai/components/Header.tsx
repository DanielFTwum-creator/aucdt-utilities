import React, { useState, useRef, useEffect } from 'react';
import { AppMode, Theme } from '../types';
import { THEMES } from '../constants';
import { 
    FlaskConicalIcon, BrainIcon, TrophyIcon, BookIcon, TestIcon, AdminIcon, 
    DownloadIcon, CrownIcon, SparklesIcon, SquareIcon, FilmIcon, CopyIcon, CheckIcon, InfoIcon,
    MicrophoneIcon
} from './Icons';

interface HeaderProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    onExportChat: () => void;
    onExportMarkdown: () => void;
    onCopyChat: () => Promise<void>;
    onOpenAbout: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClasses = "text-[var(--color-text-accent)] bg-[var(--color-bg-tertiary)]";
    const inactiveClasses = "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]";
    
    return (
        <button 
            onClick={onClick} 
            className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${isActive ? activeClasses : inactiveClasses}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {icon}
            <span className="hidden md:inline text-sm font-medium">{label}</span>
        </button>
    );
};

const ExportDropdown: React.FC<{onExportChat: () => void, onExportMarkdown: () => void, onCopyChat: () => Promise<void>}> = ({onExportChat, onExportMarkdown, onCopyChat}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopyClick = () => {
        onCopyChat().then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setIsOpen(false);
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy:", err);
            setIsOpen(false);
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] p-2 rounded-lg transition-all duration-200"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Export options"
            >
                <DownloadIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--color-bg-contrast)] rounded-md shadow-lg border border-[var(--color-border-primary)] z-20 animate-fade-in">
                    <div className="py-1">
                        <button onClick={handleCopyClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                            {isCopied ? <CheckIcon className="w-4 h-4 text-[var(--color-success)]" /> : <CopyIcon className="w-4 h-4" />}
                            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <div className="h-px bg-[var(--color-border-primary)] my-1 mx-2"></div>
                        <button onClick={() => { onExportMarkdown(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                            Export as Markdown (.md)
                        </button>
                        <button onClick={() => { onExportChat(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]">
                            Export as JSON (.json)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ mode, setMode, onExportChat, onExportMarkdown, onCopyChat, onOpenAbout, theme, setTheme }) => {
    const themeColors: Record<Theme, string> = {
        [Theme.Ocean]: '#64FFDA',
        [Theme.Golden]: '#FFB300',
        [Theme.Cyberpunk]: '#FF00FF',
        [Theme.Minimal]: '#27272A',
        [Theme.Cinema]: '#E50914',
    };
    
    const themeIcons: Record<Theme, React.ReactElement> = {
        [Theme.Ocean]: <AdminIcon className="w-5 h-5" />,
        [Theme.Golden]: <CrownIcon className="w-5 h-5" />,
        [Theme.Cyberpunk]: <SparklesIcon className="w-5 h-5" />,
        [Theme.Minimal]: <SquareIcon className="w-5 h-5" />,
        [Theme.Cinema]: <FilmIcon className="w-5 h-5" />,
    };

  return (
    <header className="bg-[var(--color-bg-contrast)]/95 border-b border-[var(--color-border-primary)] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-[var(--color-accent-primary)] p-2 rounded-lg">
              <FlaskConicalIcon className="w-6 h-6 text-[var(--color-text-on-accent)]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                BioChemAI
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <NavButton label="Chat" icon={<BrainIcon className="w-5 h-5" />} isActive={mode === AppMode.Chat} onClick={() => setMode(AppMode.Chat)} />
            <NavButton label="Voice" icon={<MicrophoneIcon className="w-5 h-5" />} isActive={mode === AppMode.Voice} onClick={() => setMode(mode === AppMode.Voice ? AppMode.Chat : AppMode.Voice)} />
            <NavButton label="Quiz" icon={<TrophyIcon className="w-5 h-5" />} isActive={mode === AppMode.Quiz} onClick={() => setMode(AppMode.Quiz)} />
            <NavButton label="Docs" icon={<BookIcon className="w-5 h-5" />} isActive={mode === AppMode.Docs} onClick={() => setMode(AppMode.Docs)} />
            <NavButton label="Test" icon={<TestIcon className="w-5 h-5" />} isActive={mode === AppMode.Test} onClick={() => setMode(AppMode.Test)} />
            <NavButton label="Admin" icon={<AdminIcon className="w-5 h-5" />} isActive={mode === AppMode.Admin} onClick={() => setMode(AppMode.Admin)} />
            
            <div className="w-px h-6 bg-[var(--color-border-primary)] mx-2"></div>
            
            {mode === AppMode.Chat && <ExportDropdown onExportChat={onExportChat} onExportMarkdown={onExportMarkdown} onCopyChat={onCopyChat} />}

            <button
                onClick={onOpenAbout}
                className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] p-2 rounded-lg transition-all duration-200"
                title="About BioChemAI"
                aria-label="About BioChemAI"
            >
                <InfoIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-full p-1 space-x-1" role="radiogroup" aria-label="Select color theme">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-1 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] ${
                    theme === t ? 'ring-2 ring-offset-2 ring-[var(--color-accent-primary)] ring-offset-[var(--color-bg-tertiary)]' : ''
                  }`}
                  title={`Switch to ${t} theme`}
                  aria-label={`Switch to ${t} theme`}
                  role="radio"
                  aria-checked={theme === t}
                >
                    <div
                        style={{ color: themeColors[t] }}
                        className="w-5 h-5 flex items-center justify-center"
                    >
                        {themeIcons[t]}
                    </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};