/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './GameContext';
import { IntroScreen } from './components/IntroScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { MemorizeScreen } from './components/MemorizeScreen';
import { PickerScreen } from './components/PickerScreen';
import { ResultScreen } from './components/ResultScreen';
import { TotalScreen } from './components/TotalScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ChallengeSetupScreen } from './components/ChallengeSetupScreen';
import { ChallengeIntroScreen } from './components/ChallengeIntroScreen';
import { DailyIntroScreen } from './components/DailyIntroScreen';
import { DailyResultsScreen } from './components/DailyResultsScreen';
import { RulesScreen } from './components/RulesScreen';
import { AdminPanel } from './components/AdminPanel';
import { AnimatePresence, motion } from 'motion/react';

const GameRouter: React.FC = () => {
  const { screen } = useGame();

  const renderScreen = () => {
    switch (screen) {
      case 'intro': return <IntroScreen />;
      case 'countdown': return <CountdownScreen />;
      case 'memorize': return <MemorizeScreen />;
      case 'picker': return <PickerScreen />;
      case 'result': return <ResultScreen />;
      case 'total': return <TotalScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'challenge-setup': return <ChallengeSetupScreen />;
      case 'challenge-intro': return <ChallengeIntroScreen />;
      case 'daily-intro': return <DailyIntroScreen />;
      case 'daily-results': return <DailyResultsScreen />;
      case 'rules': return <RulesScreen />;
      case 'admin': return <AdminPanel />;
      default: return <IntroScreen />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

