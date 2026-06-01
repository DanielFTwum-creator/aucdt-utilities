/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelConfig, MathQuestion, UserProgress } from './types';
import { INITIAL_LEVELS } from './data/levelData';
import { playSoundTap, playSoundSuccess, playSoundIncorrect, playSoundUpgrade } from './utils/audio';
import { getCompanion } from './utils/companion';

// Subcomponents
import MathIslandMap from './components/MathIslandMap';
import InteractiveKeyboard from './components/InteractiveKeyboard';
import TabbyCatSpeech from './components/TabbyCatSpeech';
import LevelBlockCounter from './components/LevelBlockCounter';
import LevelBridgeShooter from './components/LevelBridgeShooter';
import LevelFractionBakery from './components/LevelFractionBakery';
import LevelCosmicBlitz from './components/LevelCosmicBlitz';
import BackpackStats from './components/BackpackStats';

import { Star, Flame, Trophy, Map, ArrowLeft, RefreshCw, Sparkles, Award, Volume2, VolumeX, BookOpen, HelpCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tabquest_local_state_v1';

const DEFAULT_PROGRESS: UserProgress = {
  level: 1,
  stars: 0,
  coins: 0,
  highScore: 0,
  streak: 0,
  maxStreak: 0,
  completedLevels: [],
  unlockedBadgeIds: ['badge-novice'],
  wpmHistory: [
    { date: 'Initial', wpm: 12, accuracy: 85 }
  ],
  currentProfilePic: '🦊',
  audioSynth: 'triangle',
};

export default function App() {
  // Remove splash screen body styles so app fills the full viewport
  useEffect(() => {
    const splashStyles = document.getElementById('island-splash-styles');
    if (splashStyles) splashStyles.remove();
    document.body.style.cssText = '';
  }, []);

  // Navigation: 'map' | 'backpack' | 'play' | 'win_modal'
  const [activeScreen, setActiveScreen] = useState<'map' | 'backpack' | 'play' | 'win_modal'>('map');

  // Levels & Progress States
  const [levels, setLevels] = useState<LevelConfig[]>(INITIAL_LEVELS);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // standard fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Level Play States
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [typedValue, setTypedValue] = useState<string>('');
  const [isTypingError, setIsTypingError] = useState<boolean>(false);
  const [lastTypedChar, setLastTypedChar] = useState<string>('');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'excited' | 'cheering' | 'helpful'>('helpful');
  const [mascotQuote, setMascotQuote] = useState<string>('Welcome to the islands! Click a stepping stone to start your quest!');

  // Timing logs for WPM calculation
  const [drillStartTime, setDrillStartTime] = useState<number>(0);
  const [drillTotalErrors, setDrillTotalErrors] = useState<number>(0);

  // Completed level scorecard summary
  const [scoresSummary, setScoresSummary] = useState<{
    starsEarned: number;
    coinsEarned: number;
    accuracy: number;
    wpm: number;
    bonusEarned: number;
  } | null>(null);

  const textInputRef = useRef<HTMLInputElement>(null);

  // Configured sound synthesizer triggers for Real-time Sensory Feedback
  const playConfiguredTap = (freq = 440) => {
    if (userProgress.audioSynth !== 'mute') {
      playSoundTap(freq, userProgress.audioSynth || 'triangle');
    }
  };

  const playConfiguredSuccess = () => {
    if (userProgress.audioSynth !== 'mute') {
      playSoundSuccess();
    }
  };

  const playConfiguredIncorrect = () => {
    if (userProgress.audioSynth !== 'mute') {
      playSoundIncorrect();
    }
  };

  const playConfiguredUpgrade = () => {
    if (userProgress.audioSynth !== 'mute') {
      playSoundUpgrade();
    }
  };

  // Core synchronization: greet using chosen companion and handle companion mood resets
  useEffect(() => {
    const comp = getCompanion(userProgress.currentProfilePic);
    setMascotQuote(comp.greeting);
    setMascotMood('helpful');
  }, [userProgress.currentProfilePic]);

  // Sync state with matching Level configuration unlocks
  useEffect(() => {
    const updated = INITIAL_LEVELS.map((level) => ({
      ...level,
      unlocked: userProgress.stars >= level.starsRequired,
    }));
    setLevels(updated);
  }, [userProgress.stars]);

  // Persist levels progress to Local Storage
  const updateProgressAndSave = (nextProgress: UserProgress) => {
    setUserProgress(nextProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextProgress));
    } catch (e) {
      // safe fallback
    }
  };

  // Launch direct level exercise drill
  const handleSelectLevel = (level: LevelConfig) => {
    setActiveLevel(level);
    setCurrentQuestionIndex(0);
    setTypedValue('');
    setIsTypingError(false);
    setLastTypedChar('');
    setDrillTotalErrors(0);
    setDrillStartTime(Date.now());
    
    const firstQ = level.practices[0];
    const comp = getCompanion(userProgress.currentProfilePic);
    setMascotMood('thinking');
    setMascotQuote(firstQ.helperTip || comp.helperTips[0] || 'Type correct formula inputs precisely! Focus on the keys.');
    setActiveScreen('play');

    // Focus input field dynamically
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 150);
  };

  // Evaluation trigger on keys pressed
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!activeLevel) return;
    const value = e.target.value;
    const activeQuestion = activeLevel.practices[currentQuestionIndex];
    const targetExpr = activeQuestion.equation;

    // Filter characters
    if (value.length > targetExpr.length) return;

    const lastChar = value[value.length - 1] || '';
    setLastTypedChar(lastChar);

    // Verify correct slice
    const correctPart = targetExpr.substring(0, value.length);
    if (value === correctPart) {
      // Success character tick
      playConfiguredTap();
      setTypedValue(value);
      setIsTypingError(false);

      // Boost streak combos
      const nextStreak = userProgress.streak + 1;
      const nextMaxStreak = Math.max(userProgress.maxStreak, nextStreak);

      updateProgressAndSave({
        ...userProgress,
        streak: nextStreak,
        maxStreak: nextMaxStreak,
      });

      if (nextStreak > 4 && nextStreak % 4 === 0) {
        const comp = getCompanion(userProgress.currentProfilePic);
        const randomCheer = comp.encouragement[Math.floor(Math.random() * comp.encouragement.length)] || `Incredible! That is an active ${nextStreak}-streak arpeggio calculation!`;
        setMascotMood('excited');
        setMascotQuote(randomCheer);
      }

      // Check if finished equation typing
      if (value === targetExpr) {
        handleEndQuestion();
      }
    } else {
      // Typo corrective low tone
      playConfiguredIncorrect();
      setIsTypingError(true);
      setDrillTotalErrors((prev) => prev + 1);

      updateProgressAndSave({
        ...userProgress,
        streak: 0,
      });

      const comp = getCompanion(userProgress.currentProfilePic);
      setMascotMood('thinking');
      setMascotQuote(activeQuestion.helperTip || comp.helperTips[1] || 'Look at the pulsing green key on the on-screen keyboard guide!');
    }
  };

  const handleEndQuestion = () => {
    if (!activeLevel) return;

    playConfiguredSuccess();
    const activeQuestion = activeLevel.practices[currentQuestionIndex];

    // Happy mascot cheer
    setMascotMood('cheering');
    const comp = getCompanion(userProgress.currentProfilePic);
    const congratulations = comp.encouragement;
    setMascotQuote(congratulations[Math.floor(Math.random() * congratulations.length)] || 'Stellar math calculation!');

    // Check if more questions inside level
    const isLastQ = currentQuestionIndex >= activeLevel.practices.length - 1;
    if (isLastQ) {
      handleCompleteLevel();
    } else {
      // Progress next question draft
      setTimeout(() => {
        setTypedValue('');
        setIsTypingError(false);
        setLastTypedChar('');
        setCurrentQuestionIndex((prev) => prev + 1);
        
        const nextQ = activeLevel.practices[currentQuestionIndex + 1];
        setMascotMood('thinking');
        const compObj = getCompanion(userProgress.currentProfilePic);
        setMascotQuote(nextQ.helperTip || compObj.helperTips[0] || 'Next visual pattern! Let us calculate!');
        
        // Refocus input
        textInputRef.current?.focus();
      }, 700);
    }
  };

  const handleCompleteLevel = () => {
    if (!activeLevel) return;

    playConfiguredUpgrade();

    // End timing and compute parameters
    const msSpent = Date.now() - drillStartTime;
    const secondsSpent = Math.max(3, Math.round(msSpent / 1000));
    
    // Level stats
    const totalChars = activeLevel.practices.reduce((acc, q) => acc + q.equation.length, 0);
    const accuracy = Math.max(0, Math.round(((totalChars - drillTotalErrors) / totalChars) * 100));
    const wpm = Math.max(5, Math.round((totalChars / 5) / (secondsSpent / 60)));

    // Stars and coins distribution rewards
    const starsEarned = 3; // Fixed 3 stars per completed stepping stone
    const isAlreadyCompleted = userProgress.completedLevels.includes(activeLevel.id);
    
    // Dynamic gold coins
    const baseCoins = accuracy > 90 ? 15 : 10;
    const speedBonus = wpm >= 25 ? 10 : 5;
    const totalRewardCoins = isAlreadyCompleted ? 2 : baseCoins + speedBonus;

    // Update progress variables
    const updatedCompletedLevels = isAlreadyCompleted 
      ? userProgress.completedLevels 
      : [...userProgress.completedLevels, activeLevel.id];

    const updatedStars = isAlreadyCompleted 
      ? userProgress.stars 
      : userProgress.stars + starsEarned;

    // WPM History date log creation
    const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const newHistory = [
      ...userProgress.wpmHistory,
      { date: `${today} (#${activeLevel.id})`, wpm, accuracy }
    ].slice(-5); // keep last 5 points to fit the charts nicely

    updateProgressAndSave({
      ...userProgress,
      level: Math.min(10, Math.floor((updatedStars + 3) / 3)),
      stars: updatedStars,
      coins: userProgress.coins + totalRewardCoins,
      completedLevels: updatedCompletedLevels,
      wpmHistory: newHistory,
      streak: 0,
    });

    setScoresSummary({
      starsEarned: isAlreadyCompleted ? 0 : starsEarned,
      coinsEarned: totalRewardCoins,
      accuracy,
      wpm,
      bonusEarned: accuracy === 100 ? 5 : 0
    });

    setActiveScreen('win_modal');
  };

  const handleResetApp = () => {
    if (confirm('Are you sure you want to reset all progress? You will lose stickers and unlocked math maps.')) {
      updateProgressAndSave(DEFAULT_PROGRESS);
      setActiveScreen('map');
      alert('Baseline loaded. Start fresh! 🚀');
    }
  };

  // Safe fetch target char currently typing for on-screen keyboard feedback
  const getNextTargetChar = () => {
    if (!activeLevel) return '';
    const q = activeLevel.practices[currentQuestionIndex];
    return q.equation[typedValue.length] || '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative antialiased leading-normal select-none">
      {/* Playful background space dust effect */}
      <div className="absolute inset-0 bg-radial-at-t from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Header bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5">
        <div className="w-full flex items-center justify-between">
          {/* Logo Name */}
          <button
            onClick={() => setActiveScreen('map')}
            className="flex items-center gap-2.5 hover:opacity-90 active:scale-98 transition group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-650 to-teal-500 flex items-center justify-center text-xl shadow border border-white/5 font-extrabold select-none">
              ⌨️
            </div>
            <div>
              <span className="block text-[10px] text-teal-400 font-bold tracking-widest font-mono uppercase">
                TABQUEST ADVENTURES
              </span>
              <h1 className="text-sm font-black text-slate-100 uppercase tracking-tight">
                Typing &amp; Math Quest
              </h1>
            </div>
          </button>

          {/* User state overview */}
          <div className="flex items-center gap-2 flex-wrap sm:gap-3.5 font-mono justify-end">
            {/* Streak metrics */}
            {userProgress.streak > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-full border border-rose-500/15 text-xs font-bold animate-pulse">
                <Flame size={14} fill="currentColor" /> {userProgress.streak} Combo!
              </div>
            )}

            {/* Audio Synth Selector - Real-Time Feedback setting */}
            <button
              onClick={() => {
                const nextModes: Record<string, 'sine' | 'triangle' | 'sawtooth' | 'mute'> = {
                  'triangle': 'sine',
                  'sine': 'sawtooth',
                  'sawtooth': 'mute',
                  'mute': 'triangle'
                };
                const nextMode = nextModes[userProgress.audioSynth || 'triangle'] || 'triangle';
                updateProgressAndSave({
                  ...userProgress,
                  audioSynth: nextMode
                });
                // Play tactile sample
                if (nextMode !== 'mute') {
                  playSoundTap(523.25, nextMode);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition select-none bg-slate-900 hover:bg-slate-850 hover:text-slate-100 border border-slate-800 text-slate-300"
              title="Click to toggle synthesizer audio feedback mode!"
            >
              {userProgress.audioSynth === 'mute' ? (
                <VolumeX className="text-rose-400" size={13} />
              ) : (
                <Volume2 className="text-teal-400 animate-pulse" size={13} />
              )}
              <span className="text-[10px] uppercase font-mono tracking-wider">
                {userProgress.audioSynth || 'triangle'}
              </span>
            </button>

            {/* Stars count */}
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl select-none">
              <Star size={13} fill="currentColor" /> {userProgress.stars} Stars
            </div>

            {/* Profile pic / edit shortcut */}
            <button
              onClick={() => setActiveScreen('backpack')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition select-none ${
                activeScreen === 'backpack'
                  ? 'bg-indigo-650 text-slate-100 border border-indigo-500 shadow'
                  : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
              }`}
            >
              <Trophy size={13} /> {userProgress.currentProfilePic} Backpack
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Section */}
      <main className="flex-1 w-full p-4 sm:p-6 flex flex-col gap-6 justify-center">
        <AnimatePresence mode="wait">
          {/* MATH progressive map screen */}
          {activeScreen === 'map' && (
            <motion.div
              key="map"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full"
            >
              <MathIslandMap
                levels={levels}
                userProgress={userProgress}
                onSelectLevel={handleSelectLevel}
              />
              {/* Mascot Tip */}
              <TabbyCatSpeech text={mascotQuote} mood={mascotMood} companionEmoji={userProgress.currentProfilePic} />
            </motion.div>
          )}

          {/* BACKPACK Stickers and reward charts */}
          {activeScreen === 'backpack' && (
            <motion.div
              key="backpack"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full text-center"
            >
              {/* Back to map link */}
              <div className="self-start">
                <button
                  onClick={() => setActiveScreen('map')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-100 transition font-sans"
                >
                  <ArrowLeft size={16} /> Dashboard Map
                </button>
              </div>

              <BackpackStats
                userProgress={userProgress}
                onUpdateProgress={updateProgressAndSave}
              />

              <div className="h-px bg-slate-900 my-4" />
              <button
                onClick={handleResetApp}
                className="text-[10px] text-slate-600 hover:text-rose-500 font-mono flex items-center gap-1 mx-auto"
              >
                <RefreshCw size={10} /> Reset user stats and sticker backpack (Dangerous)
              </button>
            </motion.div>
          )}

          {/* GAME Drills Screen */}
          {activeScreen === 'play' && activeLevel && (
            <motion.div
              key="play"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Top back bar links */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Exit level? Progress on active drilling exercises will be lost.')) {
                      setActiveScreen('map');
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-slate-100 transition font-sans"
                >
                  <ArrowLeft size={16} /> Exit Quest
                </button>

                <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-teal-400">
                  Question {currentQuestionIndex + 1} of {activeLevel.practices.length}
                </div>
              </div>

              {/* Drill Banner Info */}
              <div className="text-left space-y-1 font-sans px-1">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block tracking-wider">
                  🎯 level #{activeLevel.id} | {activeLevel.zoneTitle}
                </span>
                <h2 className="text-xl font-black text-slate-100 tracking-tight leading-none">
                  {activeLevel.practices[currentQuestionIndex].prompt}
                </h2>
              </div>

              {/* Multi-grid Split: Left=Visual, Right=Typing Evaluation input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Visual Mathematical Representations */}
                <div className="flex flex-col justify-center h-full">
                  {activeLevel.practices[currentQuestionIndex].visualType === 'blocks' && (
                    <LevelBlockCounter
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                  {activeLevel.practices[currentQuestionIndex].visualType === 'ten-frame' && (
                    <LevelBlockCounter
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                  {activeLevel.practices[currentQuestionIndex].visualType === 'balloon-pop' && (
                    <LevelBridgeShooter
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                  {activeLevel.practices[currentQuestionIndex].visualType === 'star-grid' && (
                    <LevelBridgeShooter
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                  {activeLevel.practices[currentQuestionIndex].visualType === 'pizza' && (
                    <LevelFractionBakery
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                  {activeLevel.practices[currentQuestionIndex].visualType === 'asteroid' && (
                    <LevelCosmicBlitz
                      question={activeLevel.practices[currentQuestionIndex]}
                      typedValue={typedValue}
                    />
                  )}
                </div>

                {/* Typing interactive interface */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-xl relative min-h-[220px]">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-wider text-slate-450 uppercase block font-semibold">
                      👉 TYPE CORRESPONDING FORMULA HERE:
                    </span>

                    {/* Highlights typed letters as children type */}
                    <div className="flex justify-center items-center gap-0.5 text-2xl font-mono tracking-wider bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 shadow-inner select-none font-bold">
                      {activeLevel.practices[currentQuestionIndex].equation.split('').map((char, index) => {
                        let charStyle = 'text-slate-600'; // Default hidden/upcoming
                        let cursor = '';

                        if (index < typedValue.length) {
                          if (typedValue[index] === char) {
                            charStyle = 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]';
                          } else {
                            charStyle = 'text-rose-400 bg-rose-950/40 rounded px-0.5 border border-rose-800/40';
                          }
                        }

                        if (index === typedValue.length) {
                          charStyle = 'text-slate-100 border-b-2 border-dashed border-teal-400 animate-pulse bg-teal-950/20 px-0.5';
                        }

                        return (
                          <span key={index} className={`${charStyle} relative`}>
                            {char === ' ' ? '·' : char}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hidden input field for physical keyboard intercept */}
                  <div className="space-y-4">
                    <input
                      ref={textInputRef}
                      type="text"
                      value={typedValue}
                      onChange={handleInputChange}
                      className="absolute inset-x-0 bottom-0 opacity-0 h-10 w-full cursor-default"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      placeholder="Interact with physically typed keys..."
                      autoFocus
                    />
                    <button
                      onClick={() => textInputRef.current?.focus()}
                      className="w-full py-3 bg-gradient-to-tr from-indigo-650 to-indigo-550 active:from-indigo-700 animate-pulse text-xs font-bold rounded-2xl border border-indigo-400/20 shadow uppercase tracking-wide cursor-pointer"
                    >
                      ⌨️ Tap here to capture keyboard keys
                    </button>
                    <p className="text-[10px] text-slate-500 font-mono leading-tight text-center">
                      (Typing on physical or virtual keyboard executes immediate actions)
                    </p>
                  </div>
                </div>
              </div>

              {/* On-screen visual keyboard helper */}
              <InteractiveKeyboard
                targetChar={getNextTargetChar()}
                lastTypedChar={lastTypedChar}
                isError={isTypingError}
              />

              {/* Coach Tabby speech chat advice trigger */}
              <TabbyCatSpeech text={mascotQuote} mood={mascotMood} isTypingCorrect={!isTypingError} companionEmoji={userProgress.currentProfilePic} />
            </motion.div>
          )}

          {/* Level Complete Win celebration screen */}
          {activeScreen === 'win_modal' && scoresSummary && (
            <motion.div
              key="win"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full mx-auto"
            >
              <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center gap-6 relative overflow-hidden">
                {/* Visual sparkles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none animate-pulse" />

                <motion.div
                  className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-lg border border-yellow-300 animate-bounce"
                  initial={{ scale: 0.5, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring' }}
                >
                  🏆
                </motion.div>

                <div className="space-y-1 font-sans">
                  <span className="text-[11px] font-mono tracking-widest text-teal-400 uppercase font-black">
                     Level Complete! 
                  </span>
                  <h3 className="text-2xl font-black text-slate-50 tracking-tight leading-tight">
                    You sliced those formulas! 🍕
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                    Phenom calculation speeds! Coach Tabby is dancing with Joy!
                  </p>
                </div>

                {/* Scorecard visual summary */}
                <div className="w-full bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex justify-between text-xs pb-2 border-b border-slate-900">
                    <span className="text-slate-400 uppercase">Accuracy:</span>
                    <strong className="text-rose-400 font-bold">{scoresSummary.accuracy}%</strong>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-slate-900">
                    <span className="text-slate-400 uppercase">Speed WPM:</span>
                    <strong className="text-teal-400 font-bold">{scoresSummary.wpm} Words/m</strong>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-slate-900">
                    <span className="text-slate-400 uppercase">New Stars:</span>
                    <strong className="text-amber-400 font-bold">⭐ +{scoresSummary.starsEarned}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 uppercase">Gold Coins:</span>
                    <strong className="text-yellow-400 font-bold">🪙 +{scoresSummary.coinsEarned}</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => {
                      setTypedValue('');
                      setIsTypingError(false);
                      setLastTypedChar('');
                      setActiveScreen('map');
                      setMascotMood('happy');
                      setMascotQuote('Amazing steps! Pick a new stepping stone map marker to progress!');
                    }}
                    className="flex-1 py-3 bg-gradient-to-tr from-teal-500 to-emerald-500 text-slate-950 font-sans font-black uppercase text-xs rounded-2xl hover:shadow-lg hover:shadow-teal-500/10 active:scale-98 transition cursor-pointer"
                  >
                     Done &amp; Check Map
                  </button>
                  <button
                    onClick={() => {
                      if (activeLevel) handleSelectLevel(activeLevel);
                    }}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-755 border border-slate-700 font-sans font-bold text-slate-300 text-xs rounded-2xl hover:text-slate-100 transition cursor-pointer"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer system details */}
      <footer className="py-4 border-t border-slate-950 bg-slate-950/60 text-center text-[10px] text-slate-600 font-mono select-none">
        <p>TabQuest Adventures - Designed with ❤️ for Child Mathematics Development &amp; Keyboard Touch Typing Proficiency.</p>
        <p className="mt-1">Techbridge AI Blueprint Series • IEEE TUC Reference: TUC-ICT-SRS-2026-001</p>
      </footer>
    </div>
  );
}
