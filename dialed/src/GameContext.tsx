import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameState, Screen, HSB, Theme } from './types';
import { ROUNDS, DEFAULT_PICKER_HSB, THEMES } from './constants';
import { randomHsb, randomPickerDefault } from './lib/colorUtils';
import { auth, onAuthStateChanged, User, db, collection, addDoc, getDoc, doc, Timestamp, handleFirestoreError, OperationType } from './firebase';

interface GameContextType {
  state: GameState;
  screen: Screen;
  mode: 'solo' | 'challenge' | 'daily';
  theme: Theme;
  challengeCode: string | null;
  user: User | null;
  isAuthReady: boolean;
  setScreen: (screen: Screen) => void;
  setTheme: (theme: Theme) => void;
  startGame: (mode?: 'solo' | 'challenge' | 'daily', challengeCode?: string) => void;
  nextRound: () => void;
  submitRound: (score: number, playerColor: HSB) => void;
  saveFinalScore: (name: string) => Promise<void>;
  resetGame: () => void;
}

const initialGameState: GameState = {
  round: 0,
  totalScore: 0,
  currentHsb: { h: 0, s: 0, b: 0 },
  pickerHsb: DEFAULT_PICKER_HSB,
  roundScores: [],
  playerColors: [],
  targetColors: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialGameState);
  const [screen, setScreen] = useState<Screen>('intro');
  const [mode, setMode] = useState<'solo' | 'challenge' | 'daily'>('solo');
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('dialed-theme');
    return (saved as Theme) || 'dark';
  });
  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('dialed-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    // Check for challenge code in URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#c=')) {
      const code = hash.substring(3);
      if (code) {
        setChallengeCode(code);
        setScreen('challenge-intro');
      }
    }

    return () => unsubscribe();
  }, []);

  const startGame = useCallback(async (newMode: 'solo' | 'challenge' | 'daily' = 'solo', code?: string) => {
    let colors: HSB[] = [];
    
    if (newMode === 'challenge' && code) {
      try {
        const docRef = doc(db, 'challenges', code);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          colors = docSnap.data().colors;
        }
      } catch (error) {
        console.error("Failed to fetch challenge colors", error);
      }
    }

    // If no challenge colors found or not in challenge mode, generate random ones
    if (colors.length === 0) {
      if (newMode === 'daily') {
        // Seeded random based on date
        const today = new Date().toISOString().split('T')[0];
        const seed = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
        const seededRandom = (s: number) => {
          const x = Math.sin(s++) * 10000;
          return x - Math.floor(x);
        };
        colors = Array.from({ length: ROUNDS }, (_, i) => {
          const s = seededRandom(seed + i);
          const s2 = seededRandom(seed + i + 10);
          const s3 = seededRandom(seed + i + 20);
          return {
            h: Math.floor(s * 360),
            s: 30 + Math.floor(s2 * 60),
            b: 40 + Math.floor(s3 * 50)
          };
        });
      } else {
        colors = Array.from({ length: ROUNDS }, () => randomHsb());
      }
    }

    const firstColor = colors[0];
    setMode(newMode);
    if (code) setChallengeCode(code);
    
    setState({
      ...initialGameState,
      round: 1,
      currentHsb: firstColor,
      targetColors: colors,
      pickerHsb: randomPickerDefault(firstColor.h),
    });
    setScreen('countdown');
  }, []);

  const nextRound = useCallback(() => {
    if (state.round < ROUNDS) {
      const nextColor = state.targetColors[state.round];
      setState(prev => ({
        ...prev,
        round: prev.round + 1,
        currentHsb: nextColor,
        pickerHsb: randomPickerDefault(nextColor.h),
      }));
      setScreen('countdown');
    } else {
      setScreen(mode === 'daily' ? 'daily-results' : 'total');
    }
  }, [state.round, state.targetColors, mode]);

  const submitRound = useCallback((score: number, playerColor: HSB) => {
    setState(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      roundScores: [...prev.roundScores, score],
      playerColors: [...prev.playerColors, playerColor],
    }));
    setScreen('result');
  }, []);

  const saveFinalScore = useCallback(async (name: string) => {
    if (!user) return;
    
    let path = 'leaderboard';
    if (mode === 'daily') path = 'daily_scores';
    if (mode === 'challenge') path = 'challenge_scores';

    const scoreData = {
      name,
      score: state.totalScore,
      mode: 'easy',
      createdAt: Timestamp.now(),
      ...(mode === 'daily' ? { date: new Date().toISOString().split('T')[0] } : {}),
      ...(mode === 'challenge' ? { challengeCode } : {})
    };

    try {
      await addDoc(collection(db, path), scoreData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }, [user, state.totalScore, mode, challengeCode]);

  const resetGame = useCallback(() => {
    setState(initialGameState);
    setScreen('intro');
  }, []);

  return (
    <GameContext.Provider value={{ state, screen, mode, theme, challengeCode, user, isAuthReady, setScreen, setTheme, startGame, nextRound, submitRound, saveFinalScore, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
