import React from 'react';
import { Zone, MiniGame } from '../types';
import { BackIcon } from './icons';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';

interface ZoneDetailProps {
  zone: Zone;
  onBack: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const MiniGameCard: React.FC<{ miniGame: MiniGame, zone: Zone }> = ({ miniGame, zone }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            // Placeholder for game start logic
            console.log(`Starting game: ${miniGame.title}`);
        }
    };
    
    return (
    <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
        tabIndex={0}
        role="button"
        aria-label={`Play ${miniGame.title}`}
        onKeyDown={handleKeyDown}
        onClick={() => console.log(`Starting game: ${miniGame.title}`)}
    >
        <div className={`${zone.bgColor} dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mb-4 hc-bg-primary hc-border`}>
            <miniGame.Icon className={`${zone.color} dark:text-gray-300 w-12 h-12 hc-accent`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">{miniGame.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 hc-text-secondary">{miniGame.description}</p>
    </div>
)};


const ZoneDetail: React.FC<ZoneDetailProps> = ({ zone, onBack, theme, setTheme }) => {
  return (
    <div className={`w-full h-full flex flex-col ${zone.bgColor} dark:bg-gray-900 transition-colors duration-500 hc-bg-primary`}>
      <header className="relative p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hc-bg-secondary hc-border">
        <button 
            onClick={onBack} 
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-primary hc-border"
            aria-label="Back to World Map"
        >
            <BackIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hc-accent" />
        </button>
        <div className="text-center">
            <h1 className={`text-4xl font-extrabold ${zone.color} dark:text-gray-100 hc-accent`}>{zone.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg hc-text-secondary">{zone.subtitle}</p>
        </div>
        <div className="absolute top-1/2 right-6 -translate-y-1/2">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {zone.miniGames.map(game => (
                <MiniGameCard key={game.id} miniGame={game} zone={zone} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ZoneDetail;