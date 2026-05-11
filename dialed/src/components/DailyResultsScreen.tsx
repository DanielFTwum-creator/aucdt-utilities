import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { hsbToCss } from '../lib/colorUtils';
import { getTotalDescription } from '../lib/descriptions';
import { motion } from 'motion/react';
import { Share2, Trophy, ArrowLeft, Check } from 'lucide-react';

export const DailyResultsScreen: React.FC = () => {
  const { state, resetGame, setScreen, saveFinalScore, user } = useGame();
  const [displayScore, setDisplayScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

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

  useEffect(() => {
    const saveScore = async () => {
      if (isSaved || isSaving || !user) return;
      setIsSaving(true);
      try {
        await saveFinalScore(user.displayName || 'Anonymous');
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to save daily score", error);
      } finally {
        setIsSaving(false);
      }
    };

    saveScore();
  }, [user, saveFinalScore, isSaved, isSaving]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 bg-tuc-ink text-tuc-cream overflow-hidden relative">
      <div className="absolute top-12 left-12 font-label tracking-[0.2em] text-tuc-gold">
        DAILY CHALLENGE COMPLETED
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center max-w-3xl"
      >
        <h2 className="font-display text-4xl mb-2">{today}</h2>
        <div className="text-[10rem] md:text-[14rem] font-display font-bold tracking-tighter leading-none mb-4 tabular-nums">
          {displayScore.toFixed(2)}
          <span className="text-4xl md:text-6xl text-tuc-silver opacity-40 ml-4">/ 50</span>
        </div>

        <p className="text-2xl md:text-3xl font-light text-tuc-silver leading-relaxed mb-12 italic">
          "{getTotalDescription(state.totalScore, 50)}"
        </p>

        <div className="flex items-center justify-center gap-3 text-tuc-gold font-label tracking-widest mb-16">
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-tuc-gold border-t-transparent rounded-full animate-spin" />
              SAVING SCORE...
            </>
          ) : isSaved ? (
            <>
              <Check size={24} />
              SCORE POSTED TO DAILY RANKINGS
            </>
          ) : (
            <span className="text-tuc-red">FAILED TO POST SCORE</span>
          )}
        </div>

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
            onClick={() => setScreen('leaderboard')}
            className="btn-gold flex items-center gap-4"
          >
            <Trophy size={20} />
            DAILY LEADERBOARD
          </button>

          <button 
            onClick={resetGame}
            className="flex items-center gap-4 text-tuc-silver hover:text-white transition-colors font-label tracking-widest"
          >
            <ArrowLeft size={20} />
            BACK TO START
          </button>
        </div>
      </motion.div>
    </div>
  );
};
