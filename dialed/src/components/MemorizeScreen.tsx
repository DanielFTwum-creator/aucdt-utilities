import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { hsbToCss, getContrastColor, hsbToRgb } from '../lib/colorUtils';
import { motion } from 'motion/react';

export const MemorizeScreen: React.FC = () => {
  const { state, setScreen } = useGame();
  const [timeLeft, setTimeLeft] = useState(5.0);
  const colorCss = hsbToCss(state.currentHsb.h, state.currentHsb.s, state.currentHsb.b);
  const rgb = hsbToRgb(state.currentHsb.h, state.currentHsb.s, state.currentHsb.b);
  const textColor = getContrastColor(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    const start = performance.now();
    const duration = 5000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      setTimeLeft(remaining);

      if (remaining > 0) {
        requestAnimationFrame(tick);
      } else {
        setScreen('picker');
      }
    };

    const animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [setScreen]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colorCss }}
    >
      <div 
        className="absolute top-12 left-12 font-label tracking-[0.2em]"
        style={{ color: textColor, opacity: 0.6 }}
      >
        ROUND {state.round} / 5
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
        style={{ color: textColor }}
      >
        <div className="text-[12rem] font-display font-bold leading-none tracking-tighter tabular-nums">
          {timeLeft.toFixed(2)}
        </div>
        <div className="font-label tracking-[0.3em] text-xl opacity-80">
          SECONDS TO REMEMBER
        </div>
      </motion.div>
    </div>
  );
};
