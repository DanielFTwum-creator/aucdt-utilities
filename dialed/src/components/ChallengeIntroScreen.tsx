import React, { useEffect, useState } from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { Play, User, ArrowLeft } from 'lucide-react';
import { db, handleFirestoreError } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const ChallengeIntroScreen: React.FC = () => {
  const { startGame, challengeCode, setScreen } = useGame();
  const [name, setName] = useState('');
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeCode) {
        setScreen('intro');
        return;
      }

      try {
        const docRef = doc(db, 'challenges', challengeCode);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setChallenge(docSnap.data());
        } else {
          console.error("Challenge not found");
          setScreen('intro');
        }
      } catch (error) {
        handleFirestoreError(error, 'get' as any, `challenges/${challengeCode}`);
        setScreen('intro');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeCode, setScreen]);

  const handleStart = () => {
    if (!name.trim() || !challengeCode) return;
    startGame('challenge', challengeCode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tuc-ink">
        <div className="w-12 h-12 border-4 border-tuc-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-tuc-ink text-tuc-cream p-12 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <button 
          onClick={() => setScreen('intro')}
          className="flex items-center gap-2 text-tuc-silver hover:text-tuc-gold transition-colors font-label tracking-widest mb-12 mx-auto"
        >
          <ArrowLeft size={20} />
          BACK
        </button>

        <h2 className="font-label tracking-[0.4em] text-tuc-gold mb-4 uppercase">Challenge Accepted</h2>
        <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter mb-8 leading-tight">
          {challenge?.creatorName || 'A Friend'} thinks you can't remember these colors<span className="text-tuc-gold">.</span>
        </h1>

        <div className="space-y-8 bg-white/5 p-8 border border-tuc-rule mb-12">
          <div className="grid grid-cols-5 gap-2 mb-8">
            {challenge?.colors?.map((c: any, i: number) => (
              <div 
                key={i} 
                className="aspect-square border border-white/10"
                style={{ backgroundColor: `hsl(${c.h}, ${c.s}%, ${c.b}%)` }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 text-left">
            <label className="font-label tracking-widest text-xs text-tuc-silver">ENTER YOUR NAME TO COMPETE</label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 text-tuc-gold" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="bg-transparent border-b border-tuc-rule w-full pl-8 py-2 font-display text-xl focus:outline-none focus:border-tuc-gold transition-colors"
                autoFocus
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={!name.trim()}
          className="btn-gold w-full flex items-center justify-center gap-4 disabled:opacity-50"
        >
          <Play size={20} />
          START CHALLENGE
        </button>
      </motion.div>
    </div>
  );
};
