import React, { useState } from 'react';
import { Zone, MiniGame } from '../types';
import { BackIcon } from './icons';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { generateActivity, Activity } from '../services/activityService';
import { PatternPath } from './games/PatternPath';
import { FindMatch } from './games/FindMatch';
import { PuzzleBuilder } from './games/PuzzleBuilder';
import { PaintWorld } from './games/PaintWorld';
import { BuildItBlocks } from './games/BuildItBlocks';
import { StoryMaker } from './games/StoryMaker';
import { GoodNightStorytime } from './games/GoodNightStorytime';
import { GratitudeMoments } from './games/GratitudeMoments';
import { MusicClouds } from './games/MusicClouds';
import { ReadWithMe } from './games/ReadWithMe';
import { RhymeRace } from './games/RhymeRace';
import { WordFinder } from './games/WordFinder';
import { EmotionFaces } from './games/EmotionFaces';
import { FriendFinder } from './games/FriendFinder';
import { CalmCorner } from './games/CalmCorner';
import { NatureQuest } from './games/NatureQuest';
import { TreasureHunt } from './games/TreasureHunt';
import { SoundExplorer } from './games/SoundExplorer';
import { DanceTime } from './games/DanceTime';
import { AnimalMoves } from './games/AnimalMoves';
import { CatchBalance } from './games/CatchBalance';

// Games with real interactive implementations — bypasses the AI text modal.
// Add new entries here as more games are built.
type GameComponent = React.FC<{ zone: Zone; onClose: () => void }>;
const GAME_COMPONENTS: Record<string, GameComponent> = {
  puzzle:    (props) => <PuzzleBuilder       onClose={props.onClose} />,
  pattern:   PatternPath,
  match:     (props) => <FindMatch           onClose={props.onClose} />,
  paint:     (props) => <PaintWorld          onClose={props.onClose} />,
  build:     (props) => <BuildItBlocks       onClose={props.onClose} />,
  story:     (props) => <StoryMaker          onClose={props.onClose} />,
  storytime: (props) => <GoodNightStorytime  onClose={props.onClose} />,
  gratitude: (props) => <GratitudeMoments    onClose={props.onClose} />,
  music:     (props) => <MusicClouds         onClose={props.onClose} />,
  read:      (props) => <ReadWithMe          onClose={props.onClose} />,
  rhyme:     (props) => <RhymeRace           onClose={props.onClose} />,
  word:      (props) => <WordFinder          onClose={props.onClose} />,
  emotion:   (props) => <EmotionFaces        onClose={props.onClose} />,
  friend:    (props) => <FriendFinder        onClose={props.onClose} />,
  calm:      (props) => <CalmCorner          onClose={props.onClose} />,
  nature:    (props) => <NatureQuest         onClose={props.onClose} />,
  treasure:  (props) => <TreasureHunt        onClose={props.onClose} />,
  sound:     (props) => <SoundExplorer       onClose={props.onClose} />,
  dance:     (props) => <DanceTime           onClose={props.onClose} />,
  animal:    (props) => <AnimalMoves         onClose={props.onClose} />,
  catch:     (props) => <CatchBalance        onClose={props.onClose} />,
};

interface ZoneDetailProps {
  zone: Zone;
  onBack: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const MiniGameCard: React.FC<{ miniGame: MiniGame, zone: Zone, onPlay: (g: MiniGame) => void }> = ({ miniGame, zone, onPlay }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPlay(miniGame); }
    };

    return (
    <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-secondary hc-border"
        tabIndex={0}
        role="button"
        aria-label={`Play ${miniGame.title}`}
        onKeyDown={handleKeyDown}
        onClick={() => onPlay(miniGame)}
    >
        <div className={`${zone.bgColor} dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mb-4 hc-bg-primary hc-border`}>
            <miniGame.Icon className={`${zone.color} dark:text-gray-300 w-12 h-12 hc-accent`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">{miniGame.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 hc-text-secondary">{miniGame.description}</p>
    </div>
)};

const ActivityModal: React.FC<{
  game: MiniGame;
  zone: Zone;
  loading: boolean;
  error: string | null;
  activity: Activity | null;
  onClose: () => void;
  onRetry: () => void;
}> = ({ game, zone, loading, error, activity, onClose, onRetry }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-label={`Activity for ${game.title}`}
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 hc-bg-secondary hc-border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-extrabold ${zone.color} dark:text-gray-100 hc-accent`}>{game.title}</h2>
        <button type="button" onClick={onClose} aria-label="Close activity"
          className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-primary hc-border text-gray-700 dark:text-gray-200">✕</button>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-600 dark:text-gray-300 hc-text-secondary" aria-live="polite">
          <div className="animate-spin w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
          Making a fun activity just for you…
        </div>
      )}

      {error && !loading && (
        <div className="py-8 text-center" aria-live="assertive">
          <p className="text-red-600 dark:text-red-400 mb-4">Oops! We couldn't make an activity right now.</p>
          <button type="button" onClick={onRetry}
            className="px-5 py-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400">Try again</button>
        </div>
      )}

      {activity && !loading && !error && (
        <div className="space-y-5 text-gray-800 dark:text-gray-100 hc-text-primary">
          <h3 className="text-xl font-bold">{activity.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 hc-text-secondary">{activity.intro}</p>
          <ol className="list-decimal list-inside space-y-2">
            {activity.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className={`${zone.bgColor} dark:bg-gray-700 rounded-2xl p-4 hc-bg-primary hc-border`}>
            <p className="font-bold">🤔 {activity.question}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">✨ Did you know? {activity.funFact}</p>
        </div>
      )}
    </div>
  </div>
);

const ZoneDetail: React.FC<ZoneDetailProps> = ({ zone, onBack, theme, setTheme }) => {
  const [playingGame, setPlayingGame]   = useState<string | null>(null);
  const [activeGame, setActiveGame]     = useState<MiniGame | null>(null);
  const [activity, setActivity]         = useState<Activity | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const handlePlay = async (game: MiniGame) => {
    // Route to real interactive game if one exists
    if (GAME_COMPONENTS[game.id]) {
      setPlayingGame(game.id);
      return;
    }
    // Fallback: AI-generated text activity modal
    setActiveGame(game);
    setActivity(null);
    setError(null);
    setLoading(true);
    try {
      const result = await generateActivity(zone.title, game.title, game.description);
      setActivity(result);
    } catch (e) {
      console.error('[playgrow] activity generation failed:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // ── Full-screen interactive game ─────────────────────────────────────────
  if (playingGame && GAME_COMPONENTS[playingGame]) {
    const GameComp = GAME_COMPONENTS[playingGame];
    return (
      <div key={playingGame} className="pg-view-enter w-full h-full">
        <GameComp zone={zone} onClose={() => setPlayingGame(null)} />
      </div>
    );
  }

  // ── Zone game-select screen ───────────────────────────────────────────────
  return (
    <div key="grid" className={`pg-view-enter w-full h-full flex flex-col ${zone.bgColor} dark:bg-gray-900 transition-colors duration-500 hc-bg-primary`}>
      <header className="relative p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hc-bg-secondary hc-border">
        <button
            type="button"
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
              <div key={game.id} className="relative">
                <MiniGameCard miniGame={game} zone={zone} onPlay={handlePlay} />
                {/* "Playable" badge on implemented games */}
                {GAME_COMPONENTS[game.id] && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                    ▶ Play
                  </span>
                )}
              </div>
            ))}
        </div>
      </main>

      {activeGame && (
        <ActivityModal
          game={activeGame}
          zone={zone}
          loading={loading}
          error={error}
          activity={activity}
          onClose={() => setActiveGame(null)}
          onRetry={() => activeGame && handlePlay(activeGame)}
        />
      )}
    </div>
  );
};

export default ZoneDetail;
