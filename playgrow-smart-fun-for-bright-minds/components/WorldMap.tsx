import React from 'react';
import { Zone, ZoneID } from '../types';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { LockIcon } from './icons';


interface WorldMapProps {
  zones: Zone[];
  onSelectZone: (zoneId: ZoneID) => void;
  onAdminClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const zonePositions: { [key in ZoneID]: { top: string; left: string } } = {
  [ZoneID.Cognitive]: { top: '18%', left: '50%' },
  [ZoneID.Creativity]: { top: '38%', left: '22%' },
  [ZoneID.Language]: { top: '38%', left: '78%' },
  [ZoneID.Movement]: { top: '68%', left: '25%' },
  [ZoneID.Social]: { top: '85%', left: '50%' },
  [ZoneID.Exploration]: { top: '68%', left: '75%' },
  [ZoneID.Rest]: { top: '55%', left: '50%' },
};

const ZoneButton: React.FC<{ zone: Zone; onClick: () => void; }> = ({ zone, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group focus:outline-none"
      style={zonePositions[zone.id]}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${zone.title}`}
    >
      <div
        className={`${zone.bgColor} dark:bg-gray-700 rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 border-4 border-white dark:border-gray-500 transform -translate-x-1/2 -translate-y-1/2 group-focus:ring-4 ring-blue-400 hc-bg-secondary hc-border`}
      >
        <zone.Icon className={`${zone.color} dark:text-gray-300 w-12 h-12 sm:w-16 sm:h-16 hc-accent`} />
      </div>
      <h3 className="absolute -bottom-6 text-gray-800 dark:text-gray-200 font-bold text-lg text-center whitespace-nowrap bg-white/70 dark:bg-gray-800/70 rounded-full px-3 py-1 transform -translate-x-1/2 left-1/2 hc-bg-primary hc-text-primary hc-border">
        {zone.title}
      </h3>
    </div>
  );
};

const WorldMap: React.FC<WorldMapProps> = ({ zones, onSelectZone, onAdminClick, theme, setTheme }) => {
  return (
    <main className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-green-300 dark:from-gray-800 dark:to-gray-900 hc-bg-primary" aria-label="PlayGrow World Map">
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
       <button 
        onClick={onAdminClick}
        className="absolute top-4 left-4 z-20 p-2 bg-white/50 dark:bg-gray-700/50 rounded-full shadow-md hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
        aria-label="Open Admin Panel"
        >
            <LockIcon className="w-6 h-6 text-gray-700 dark:text-gray-200 hc-accent" />
        </button>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full">
            <ellipse cx="50" cy="115" rx="70" ry="35" className="fill-current text-green-400 dark:text-green-900 hc-bg-primary" />
        </svg>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-pink-300 rounded-full opacity-50 animate-pulse delay-500"></div>
      </div>

      <header className="z-10 text-center mb-8 sm:mb-16 -mt-24 sm:-mt-8">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white dark:text-gray-100 hc-text-primary" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.25)'}}>PlayGrow</h1>
        <p className="text-white text-lg sm:text-xl mt-2 font-semibold dark:text-gray-300 hc-text-secondary">Smart Fun for Bright Minds</p>
      </header>
      
      <div className="relative w-full h-2/3 max-w-4xl z-10">
        {zones.map((zone) => (
            <ZoneButton
              key={zone.id}
              zone={zone}
              onClick={() => onSelectZone(zone.id)}
            />
        ))}
      </div>
    </main>
  );
};

export default WorldMap;