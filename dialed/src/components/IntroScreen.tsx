import React from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { Users, User, Calendar, Trophy, LogIn, Target } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

export const IntroScreen: React.FC = () => {
  const { startGame, setScreen, user, isAuthReady } = useGame();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center min-h-screen p-12 bg-tuc-ink text-tuc-cream overflow-hidden relative">
      {/* Ghost letters background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
        <span className="text-[40vw] font-display font-bold leading-none">COLOR</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 max-w-2xl"
      >
        <h1 className="text-8xl md:text-9xl font-display font-bold tracking-tighter mb-8">
          color<span className="text-tuc-gold italic">.</span>
        </h1>
        
        <div className="space-y-6 text-xl md:text-2xl font-light text-tuc-silver leading-relaxed mb-12">
          <p>
            Humans can’t reliably recall colors. This is a simple game to see how good (or bad) you are at it.
          </p>
          <p>
            We’ll show you five colors, then you’ll try and recreate them.
          </p>
        </div>

        {!isAuthReady ? (
          <div className="h-16 flex items-center">
            <div className="w-8 h-8 border-4 border-tuc-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-4 bg-white text-tuc-ink px-8 py-4 font-label tracking-[0.2em] text-lg hover:bg-tuc-gold transition-all active:scale-95"
            aria-label="Sign in with Google to play"
          >
            <LogIn size={24} />
            SIGN IN TO PLAY
          </button>
        ) : (
          <div className="flex flex-wrap gap-6 items-center">
            <button 
              onClick={() => startGame('solo')}
              className="group flex items-center gap-4 bg-tuc-gold text-tuc-ink px-8 py-4 font-label tracking-[0.2em] text-lg hover:bg-white transition-all active:scale-95"
              aria-label="Start a solo color memory game"
            >
              <User size={24} />
              SOLO PLAY
            </button>

            <button 
              onClick={() => setScreen('challenge-setup')}
              className="group flex items-center gap-4 border border-tuc-gold text-tuc-gold px-8 py-4 font-label tracking-[0.2em] text-lg hover:bg-tuc-gold hover:text-tuc-ink transition-all active:scale-95"
              aria-label="Set up a challenge to play with friends"
            >
              <Users size={24} />
              CHALLENGE FRIENDS
            </button>

            <button 
              onClick={() => setScreen('daily-intro')}
              className="group flex items-center gap-4 border border-tuc-silver text-tuc-silver px-8 py-4 font-label tracking-[0.2em] text-lg hover:bg-tuc-silver hover:text-tuc-ink transition-all active:scale-95"
              aria-label="Play the synchronized daily challenge"
            >
              <Calendar size={24} />
              DAILY
            </button>
          </div>
        )}
      </motion.div>

      <div className="absolute bottom-12 right-12 flex items-center gap-12">
        <button 
          onClick={() => setScreen('rules')}
          className="text-tuc-silver hover:text-tuc-gold transition-colors flex items-center gap-2 font-label tracking-widest"
          aria-label="View game rules and mechanics"
        >
          <Target size={20} />
          RULES
        </button>
        <button 
          onClick={() => setScreen('leaderboard')}
          className="text-tuc-silver hover:text-tuc-gold transition-colors flex items-center gap-2 font-label tracking-widest"
          aria-label="View global high scores leaderboard"
        >
          <Trophy size={20} />
          HIGH SCORES
        </button>
      </div>

      <button 
        onClick={() => setScreen('admin')}
        className="absolute bottom-12 left-12 font-mono text-xs text-tuc-silver opacity-50 cursor-help hover:opacity-100 transition-opacity"
        aria-label="Access administrative console"
      >
        TUC EDITORIAL v3.1.0
      </button>
    </div>
  );
};
