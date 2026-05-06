import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { db, collection, query, where, orderBy, limit, getDocs, handleFirestoreError, OperationType } from '../firebase';
import { ScoreEntry } from '../types';

export const LeaderboardScreen: React.FC = () => {
  const { setScreen, mode, challengeCode } = useGame();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'global' | 'daily' | 'challenge'>(
    mode === 'daily' ? 'daily' : mode === 'challenge' ? 'challenge' : 'global'
  );

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      let path = 'leaderboard';
      let q;

      if (activeTab === 'daily') {
        path = 'daily_scores';
        const today = new Date().toISOString().split('T')[0];
        q = query(
          collection(db, path),
          where('date', '==', today),
          orderBy('score', 'desc'),
          limit(10)
        );
      } else if (activeTab === 'challenge' && challengeCode) {
        path = 'challenge_scores';
        q = query(
          collection(db, path),
          where('challengeCode', '==', challengeCode),
          orderBy('score', 'desc'),
          limit(10)
        );
      } else {
        q = query(
          collection(db, path),
          orderBy('score', 'desc'),
          limit(10)
        );
      }

      try {
        const snapshot = await getDocs(q);
        const fetchedScores = snapshot.docs.map(doc => doc.data() as ScoreEntry);
        setScores(fetchedScores);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [activeTab, challengeCode]);

  return (
    <div className="flex flex-col min-h-screen bg-tuc-cream text-tuc-ink p-12">
      <div className="max-w-4xl mx-auto w-full">
        <button 
          onClick={() => setScreen('intro')}
          className="flex items-center gap-2 text-tuc-silver hover:text-tuc-maroon transition-colors font-label tracking-widest mb-12"
        >
          <ArrowLeft size={20} />
          BACK TO START
        </button>

        <div className="flex items-baseline justify-between border-b-4 border-tuc-ink pb-4 mb-12">
          <h1 className="text-7xl font-display font-bold tracking-tighter">
            High Scores<span className="text-tuc-gold">.</span>
          </h1>
          <div className="flex gap-6 font-label tracking-[0.2em] text-sm">
            <button 
              onClick={() => setActiveTab('global')}
              className={`pb-2 transition-all ${activeTab === 'global' ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-silver'}`}
            >
              GLOBAL
            </button>
            <button 
              onClick={() => setActiveTab('daily')}
              className={`pb-2 transition-all ${activeTab === 'daily' ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-silver'}`}
            >
              DAILY
            </button>
            {challengeCode && (
              <button 
                onClick={() => setActiveTab('challenge')}
                className={`pb-2 transition-all ${activeTab === 'challenge' ? 'text-tuc-gold border-b-2 border-tuc-gold' : 'text-tuc-silver'}`}
              >
                CHALLENGE
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-tuc-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-20 text-tuc-silver font-light text-xl italic">
            No scores yet. Be the first to set the standard.
          </div>
        ) : (
          <div className="space-y-4">
            {scores.map((entry, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-6 bg-white border border-tuc-rule group hover:border-tuc-gold transition-all"
              >
                <div className="flex items-center gap-8">
                  <span className="font-label text-4xl text-tuc-silver w-12">{i + 1}</span>
                  <div>
                    <div className="font-display text-2xl font-bold">{entry.name}</div>
                    <div className="font-label text-xs tracking-widest text-tuc-silver uppercase">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-display font-bold tabular-nums">
                    {entry.score.toFixed(2)}
                  </div>
                  {i === 0 && <Trophy className="text-tuc-gold" size={32} />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 p-8 bg-tuc-ink text-tuc-cream text-center">
          <p className="font-label tracking-[0.2em] text-sm opacity-60 mb-2">YOUR BEST</p>
          <div className="text-5xl font-display font-bold tracking-tighter">--.--</div>
        </div>
      </div>
    </div>
  );
};
