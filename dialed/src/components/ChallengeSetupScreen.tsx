import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Check, Play } from 'lucide-react';
import { db, handleFirestoreError } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ChallengeSetupScreen: React.FC = () => {
  const { setScreen, startGame, user } = useGame();
  const [name, setName] = useState(user?.displayName || '');
  const [isCreating, setIsCreating] = useState(false);
  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !user) return;
    setIsCreating(true);
    
    try {
      // Generate 5 random colors for the challenge
      const colors = Array.from({ length: 5 }, () => ({
        h: Math.floor(Math.random() * 360),
        s: 40 + Math.floor(Math.random() * 60),
        b: 40 + Math.floor(Math.random() * 60),
      }));

      const challengeData = {
        creatorId: user.uid,
        creatorName: name.trim(),
        colors,
        createdAt: serverTimestamp(),
        type: 'custom'
      };

      const docRef = await addDoc(collection(db, 'challenges'), challengeData);
      setChallengeCode(docRef.id);
    } catch (error) {
      handleFirestoreError(error, 'write' as any, 'challenges');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (!challengeCode) return;
    const url = `${window.location.origin}/#c=${challengeCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        <h1 className="text-7xl font-display font-bold tracking-tighter mb-8">
          Create Challenge<span className="text-tuc-gold">.</span>
        </h1>

        {!challengeCode ? (
          <div className="space-y-8 animate-slide-up">
            <p className="text-xl font-light text-tuc-silver">
              Enter your name to start a challenge. We'll generate a unique link you can share with friends.
            </p>
            <div className="flex flex-col gap-4">
              <label className="font-label tracking-widest text-sm text-tuc-gold">YOUR NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Editorial Director"
                className="input-editorial w-full"
                autoFocus
              />
            </div>
            <button 
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="btn-gold w-full flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isCreating ? (
                <div className="w-5 h-5 border-2 border-tuc-ink border-t-transparent rounded-full animate-spin" />
              ) : (
                'GENERATE CHALLENGE'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            <div className="p-8 bg-white/5 border border-tuc-rule">
              <p className="font-label tracking-widest text-sm text-tuc-gold mb-4">CHALLENGE LINK</p>
              <div className="flex items-center gap-4 bg-tuc-ink p-4 border border-tuc-rule">
                <code className="flex-1 font-mono text-sm truncate">
                  {window.location.origin}/#c={challengeCode}
                </code>
                <button 
                  onClick={handleCopy}
                  className="text-tuc-gold hover:text-white transition-colors"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => startGame('challenge', challengeCode)}
                className="btn-gold w-full flex items-center justify-center gap-4"
              >
                <Play size={20} />
                START YOUR ROUND
              </button>
              <p className="text-center text-sm text-tuc-silver font-light">
                You need to play first to set the scores!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
