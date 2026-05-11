import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { hsbToCss, hsbToRgb, getContrastColor } from '../lib/colorUtils';
import { getTotalDescription } from '../lib/descriptions';
import { motion } from 'motion/react';
import { RotateCcw, Share2, Trophy, Check } from 'lucide-react';

export const TotalScreen: React.FC = () => {
  const { state, resetGame, setScreen, saveFinalScore, user } = useGame();
  const [displayScore, setDisplayScore] = useState(0);
  const [name, setName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 5);
      setDisplayScore(eased * state.totalScore);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [state.totalScore]);

  const handleSave = async () => {
    if (!name.trim() || isSaving || isSaved) return;
    setIsSaving(true);
    try {
      await saveFinalScore(name.trim());
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save score", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-tuc-ink text-tuc-cream overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <span className="text-[40vw] font-display font-bold leading-none">TOTAL</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-3xl"
      >
        <h2 className="font-label tracking-[0.4em] text-tuc-gold mb-4">FINAL SCORE</h2>
        <div className="text-[10rem] md:text-[14rem] font-display font-bold tracking-tighter leading-none mb-4 tabular-nums">
          {displayScore.toFixed(2)}
          <span className="text-4xl md:text-6xl text-tuc-silver opacity-40 ml-4">/ 50</span>
        </div>

        <p className="text-2xl md:text-3xl font-light text-tuc-silver leading-relaxed mb-12 italic">
          "{getTotalDescription(state.totalScore, 50)}"
        </p>

        {/* Save Score Section */}
        {!isSaved ? (
          <div className="flex flex-col items-center gap-4 mb-16 max-w-md mx-auto">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Initials"
              maxLength={12}
              aria-label="Enter your name or initials for the leaderboard"
              className="input-editorial w-full text-center"
            />
            <button 
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="btn-gold w-full flex items-center justify-center gap-4 disabled:opacity-50"
              aria-label="Post your score to the leaderboard"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-tuc-ink border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trophy size={20} />
              )}
              POST TO LEADERBOARD
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 text-tuc-gold font-label tracking-widest mb-16 animate-slide-up">
            <Check size={24} />
            SCORE POSTED SUCCESSFULLY
          </div>
        )}

        {/* Swatches */}
        <div className="grid grid-cols-5 gap-4 mb-16">
          {state.targetColors.map((target, i) => {
            const player = state.playerColors[i];
            return (
              <div key={i} className="aspect-square relative overflow-hidden border border-white/10">
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: hsbToCss(target.h, target.s, target.b),
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                  }}
                />
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: hsbToCss(player.h, player.s, player.b),
                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={resetGame}
            className="btn-gold flex items-center gap-4"
            aria-label="Play a new game"
          >
            <RotateCcw size={20} />
            PLAY AGAIN
          </button>

          <button 
            onClick={() => setScreen('leaderboard')}
            className="flex items-center gap-4 border border-tuc-silver text-tuc-silver px-8 py-3 font-label tracking-[0.2em] hover:bg-tuc-silver hover:text-tuc-ink transition-all"
            aria-label="View leaderboards"
          >
            <Trophy size={20} />
            LEADERBOARD
          </button>
        </div>
      </motion.div>
    </div>
  );
};
