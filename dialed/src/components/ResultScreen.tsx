import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { hsbToCss, hsbToRgb, getContrastColor } from '../lib/colorUtils';
import { getRoundDescription } from '../lib/descriptions';
import { getColorCritique } from '../services/aiService';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ResultScreen: React.FC = () => {
  const { state, nextRound } = useGame();
  const lastScore = state.roundScores[state.roundScores.length - 1];
  const lastPlayerColor = state.playerColors[state.playerColors.length - 1];
  const lastTargetColor = state.targetColors[state.roundScores.length - 1];

  const playerCss = hsbToCss(lastPlayerColor.h, lastPlayerColor.s, lastPlayerColor.b);
  const targetCss = hsbToCss(lastTargetColor.h, lastTargetColor.s, lastTargetColor.b);
  
  const playerRgb = hsbToRgb(lastPlayerColor.h, lastPlayerColor.s, lastPlayerColor.b);
  const playerTextColor = getContrastColor(playerRgb.r, playerRgb.g, playerRgb.b);

  const [displayScore, setDisplayScore] = useState(0);
  const [aiCritique, setAiCritique] = useState<string | null>(null);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(eased * lastScore);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);

    // Fetch AI critique
    getColorCritique(lastScore, lastTargetColor, lastPlayerColor).then(setAiCritique);
  }, [lastScore, lastTargetColor, lastPlayerColor]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Player Selection */}
        <div 
          className="flex-1 flex flex-col justify-end p-12 relative"
          style={{ backgroundColor: playerCss, color: playerTextColor }}
        >
          <div className="font-label tracking-[0.2em] opacity-60 mb-2">YOUR SELECTION</div>
          <div className="text-2xl font-display font-bold">
            H{lastPlayerColor.h} S{lastPlayerColor.s} B{lastPlayerColor.b}
          </div>

          <div className="absolute top-12 left-12 font-label tracking-[0.2em] opacity-60">
            ROUND {state.round} / 5
          </div>
        </div>

        {/* Target Color */}
        <div 
          className="flex-1 flex flex-col justify-end p-12 relative"
          style={{ backgroundColor: targetCss }}
        >
          <div 
            className="font-label tracking-[0.2em] opacity-60 mb-2"
            style={{ color: getContrastColor(...Object.values(hsbToRgb(lastTargetColor.h, lastTargetColor.s, lastTargetColor.b)) as [number, number, number]) }}
          >
            ORIGINAL
          </div>
          <div 
            className="text-2xl font-display font-bold"
            style={{ color: getContrastColor(...Object.values(hsbToRgb(lastTargetColor.h, lastTargetColor.s, lastTargetColor.b)) as [number, number, number]) }}
          >
            H{lastTargetColor.h} S{lastTargetColor.s} B{lastTargetColor.b}
          </div>
        </div>
      </div>

      {/* Score Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block bg-white text-tuc-ink p-12 shadow-2xl border border-tuc-rule"
        >
          <div className="text-8xl font-display font-bold tracking-tighter tabular-nums mb-4">
            {displayScore.toFixed(2)}
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="text-xl font-light text-tuc-silver leading-tight mb-4">
              {getRoundDescription(lastScore)}
            </div>
            
            {aiCritique && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 text-sm italic text-tuc-maroon bg-tuc-cream p-4 border-l-4 border-tuc-gold text-left"
              >
                <Sparkles className="shrink-0 text-tuc-gold" size={16} />
                <p>"{aiCritique}"</p>
              </motion.div>
            )}
          </div>

          <button 
            onClick={nextRound}
            className="btn-gold flex items-center gap-4 mx-auto"
          >
            NEXT ROUND
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

