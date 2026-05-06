import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Play, Lock, Trophy } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const DailyIntroScreen: React.FC = () => {
  const { setScreen, startGame, user } = useGame();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const checkDailyStatus = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'daily_scores'),
        where('userId', '==', user.uid),
        where('date', '==', today)
      );

      try {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setHasPlayed(true);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'daily_scores');
      } finally {
        setLoading(false);
      }
    };

    checkDailyStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tuc-ink">
        <div className="w-12 h-12 border-4 border-tuc-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-tuc-ink text-tuc-cream p-12">
      <div className="max-w-2xl mx-auto w-full">
        <button 
          onClick={() => setScreen('intro')}
          className="flex items-center gap-2 text-tuc-silver hover:text-tuc-gold transition-colors font-label tracking-widest mb-12"
        >
          <ArrowLeft size={20} />
          BACK
        </button>

        <div className="font-label tracking-[0.4em] text-tuc-gold mb-4 uppercase flex items-center gap-3">
          <Calendar size={16} />
          Daily Challenge
        </div>
        
        <h1 className="text-7xl font-display font-bold tracking-tighter mb-8">
          {todayStr}<span className="text-tuc-gold">.</span>
        </h1>

        <div className="space-y-8 animate-slide-up">
          <p className="text-xl font-light text-tuc-silver leading-relaxed">
            Five colors. Same for everyone on Earth. You get one shot. No pressure.
          </p>
          
          <div className="p-8 bg-white/5 border border-tuc-rule">
            {hasPlayed ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <Lock className="text-tuc-gold opacity-40" size={48} />
                <p className="font-label tracking-widest text-tuc-gold">ALREADY PLAYED TODAY</p>
                <p className="text-sm text-tuc-silver">You've already set your score for today. Check the leaderboard to see how you rank.</p>
              </div>
            ) : (
              <p className="text-sm text-tuc-silver font-mono mb-4 italic">
                "The daily challenge is the ultimate test of visual fidelity. One attempt per 24 hours. Make it count."
              </p>
            )}
          </div>

          {hasPlayed ? (
            <button 
              onClick={() => setScreen('leaderboard')}
              className="btn-gold w-full flex items-center justify-center gap-4"
            >
              <Trophy size={20} />
              VIEW DAILY RANKINGS
            </button>
          ) : (
            <button 
              onClick={() => startGame('daily')}
              className="btn-gold w-full flex items-center justify-center gap-4"
            >
              <Play size={20} />
              START DAILY ROUND
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
