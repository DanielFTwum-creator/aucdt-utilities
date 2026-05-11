import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { motion, AnimatePresence } from 'motion/react';

export const CountdownScreen: React.FC = () => {
  const { setScreen, state } = useGame();
  const [count, setCount] = useState(0);
  const words = ['READY', 'SET', 'GO'];

  useEffect(() => {
    if (count < words.length) {
      const timer = setTimeout(() => {
        setCount(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setScreen('memorize');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count, setScreen, words.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tuc-ink text-tuc-cream">
      <div className="absolute top-12 left-12 font-label tracking-[0.2em] text-tuc-silver">
        ROUND {state.round} / 5
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.2, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-9xl font-display font-bold tracking-tighter"
        >
          {words[count] || ''}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
