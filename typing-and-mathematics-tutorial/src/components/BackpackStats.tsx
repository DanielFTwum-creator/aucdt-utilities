import { useState } from 'react';
import { Badge, UserProgress } from '../types';
import { ALL_BADGES } from '../data/levelData';
import { Award, ShoppingBag, Sparkles, User, TrendingUp, CircleAlert, Trophy } from 'lucide-react';
import { playSoundCoin } from '../utils/audio';

interface BackpackStatsProps {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function BackpackStats({
  userProgress,
  onUpdateProgress,
}: BackpackStatsProps) {
  const [activeTab, setActiveTab] = useState<'stickers' | 'shop' | 'charts'>('stickers');
  const [profileOpen, setProfileOpen] = useState(false);

  // Available kid avatar list
  const avatars = ['🐱', '🦄', '🦖', '👽', '🚀', '🦊', '🐙', '🐼', '🤖', '🦁'];

  // Corresponding badge IDs to unlock premium companions
  const avatarRequirements: Record<string, string> = {
    '🦄': 'companion-unicorn',
    '🦖': 'companion-dino',
    '👽': 'companion-alien',
  };

  // Combine initial badges list with user locks/unlocks
  const badgesList: Badge[] = ALL_BADGES.map((b) => ({
    ...b,
    unlocked: userProgress.unlockedBadgeIds.includes(b.id),
  }));

  const handleBuyBadge = (badge: Badge) => {
    if (userProgress.unlockedBadgeIds.includes(badge.id)) return;

    if (userProgress.coins >= badge.cost) {
      const updatedBadgeIds = [...userProgress.unlockedBadgeIds, badge.id];
      const updatedCoins = userProgress.coins - badge.cost;

      onUpdateProgress({
        ...userProgress,
        unlockedBadgeIds: updatedBadgeIds,
        coins: updatedCoins,
      });

      if (userProgress.audioSynth !== 'mute') {
        playSoundCoin();
      }
      alert(`🎉 Hurrah! You unlocked the matching "${badge.title}" sticker badge in your backpack!`);
    } else {
      alert(`⚠️ Oops! You need ${badge.cost - userProgress.coins} more Gold Coins to get this badge! Keep playing! 🔥`);
    }
  };

  const handleSelectAvatar = (emoji: string) => {
    const requiredBadge = avatarRequirements[emoji];
    if (requiredBadge && !userProgress.unlockedBadgeIds.includes(requiredBadge)) {
      alert(`🔒 Oops! This magical premium companion is currently locked. Buy its license sticker in the Sticker Shop first!`);
      return;
    }
    onUpdateProgress({
      ...userProgress,
      currentProfilePic: emoji,
    });
    setProfileOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Visual profile header */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-left">
          {/* Avatar selector popup trigger */}
          <div className="relative group">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-16 h-16 rounded-2xl bg-slate-800 hover:bg-slate-755 border-2 border-indigo-500/50 flex items-center justify-center text-4xl shadow-lg transition-all"
              title="Click to switch companion!"
            >
              {userProgress.currentProfilePic}
            </button>
            <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-[9px] font-bold text-slate-100 px-1.5 py-0.5 rounded-full uppercase border border-indigo-400 select-none cursor-pointer">
              EDIT
            </div>

            {profileOpen && (
              <div className="absolute top-20 left-0 bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl z-20 w-48 grid grid-cols-5 gap-2 animate-fadeIn">
                {avatars.map((av) => {
                  const requiredBadge = avatarRequirements[av];
                  const isLocked = requiredBadge && !userProgress.unlockedBadgeIds.includes(requiredBadge);

                  return (
                    <button
                      key={av}
                      onClick={() => handleSelectAvatar(av)}
                      className="text-2xl hover:bg-slate-800 rounded p-1.5 transition relative flex items-center justify-center cursor-pointer"
                      title={isLocked ? "Unlocks via Sticker Shop!" : "Choose companion"}
                    >
                      <span className={isLocked ? "opacity-35" : ""}>{av}</span>
                      {isLocked && (
                        <span className="absolute bottom-0 right-0 text-[8px] font-bold select-none leading-none">
                          🔒
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-1.5 leading-tight font-sans">
              Adventurer Kid {userProgress.currentProfilePic}
            </h3>
            <p className="text-slate-400 text-xs font-mono font-semibold mt-1">
              🎖️ Level {userProgress.level} Knight | Score: {userProgress.coins * 3 + userProgress.stars * 10}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center font-mono min-w-24">
            <span className="block text-[10px] uppercase text-slate-450">Stars Earned</span>
            <span className="text-lg font-extrabold text-amber-400">⭐ {userProgress.stars}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 text-center font-mono min-w-24">
            <span className="block text-[10px] uppercase text-slate-450">Coins</span>
            <span className="text-lg font-extrabold text-yellow-400">🪙 {userProgress.coins}</span>
          </div>
        </div>
      </div>

      {/* Tabs list switches */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 self-center">
        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'stickers'
              ? 'bg-indigo-650 text-white shadow'
              : 'text-slate-450 hover:text-slate-200'
          }`}
        >
          <Trophy size={14} /> My Sticker Bag
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'shop'
              ? 'bg-indigo-650 text-white shadow'
              : 'text-slate-450 hover:text-slate-200'
          }`}
        >
          <ShoppingBag size={14} /> Sticker Shop
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'charts'
              ? 'bg-indigo-650 text-white shadow'
              : 'text-slate-450 hover:text-slate-200'
          }`}
        >
          <TrendingUp size={14} /> Typing Metrics
        </button>
      </div>

      {/* Tab Contents: My Sticker Bag */}
      {activeTab === 'stickers' && (
        <div className="space-y-4">
          <div className="text-left font-sans pl-2">
            <h4 className="text-base font-bold text-slate-200">Unlocked Emblems &amp; Backpack Stickers</h4>
            <p className="text-slate-400 text-xs">These are rewards you purchased or earned through completing calculations!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badgesList.filter(b => b.unlocked).length === 0 ? (
              <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 text-slate-500 font-sans text-xs">
                🛍️ Your Sticker Bag is empty! Collect coins and visit the Sticker Shop!
              </div>
            ) : (
              badgesList
                .filter((b) => b.unlocked)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 bg-gradient-to-tr from-slate-900 via-slate-905 to-slate-850 rounded-3xl border border-indigo-950/40 text-center flex flex-col items-center gap-2 hover:scale-102 transition"
                  >
                    <span className="text-4xl filter drop-shadow select-none animate-bounce">{badge.icon}</span>
                    <strong className="text-slate-200 text-sm font-sans truncate w-full">{badge.title}</strong>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">{badge.category} Medal</span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Tab Contents: Sticker Shop */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          <div className="text-left font-sans pl-2">
            <h4 className="text-base font-bold text-slate-200">Interactive Badge Shop 🛍️</h4>
            <p className="text-slate-400 text-xs">Exchange your glowing math coins for rare sticker collectibles!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badgesList.map((badge) => {
              const worksCoins = userProgress.coins >= badge.cost;

              return (
                <div
                  key={badge.id}
                  className={`p-4 bg-slate-900/80 rounded-3xl border text-left flex flex-col justify-between gap-4 transition relative ${
                    badge.unlocked
                      ? 'border-emerald-900/60 bg-emerald-950/10'
                      : worksCoins
                      ? 'border-slate-800 hover:border-indigo-800/80'
                      : 'border-slate-900 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl bg-slate-950 p-2 rounded-xl border border-slate-850 select-none">
                      {badge.icon}
                    </span>
                    <div>
                      <h5 className="text-slate-200 text-sm font-bold truncate leading-tight">{badge.title}</h5>
                      <span className="text-[10px] text-slate-450 uppercase font-mono font-bold">{badge.category}</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed font-sans">{badge.description}</p>

                  <div className="flex items-center justify-between border-t border-slate-850 mt-1 pt-3">
                    <span className="text-amber-500 font-mono text-xs font-bold block">
                      🪙 {badge.cost} Coins
                    </span>

                    {badge.unlocked ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-900/40 font-mono">
                        ✓ UNLOCKED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyBadge(badge)}
                        disabled={badge.unlocked}
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl block transition font-mono ${
                          worksCoins
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95'
                            : 'bg-slate-850 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Buy Stickers
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Contents: Typing Speed Metrics */}
      {activeTab === 'charts' && (
        <div className="space-y-4">
          <div className="text-left font-sans pl-2">
            <h4 className="text-base font-bold text-slate-200">Historic Performance Data Tracker</h4>
            <p className="text-slate-400 text-xs font-sans">See your typing speed growth and computation accuracy improve over time!</p>
          </div>

          {userProgress.wpmHistory.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 text-slate-550 text-xs">
              📊 No game sessions completed yet. Practice a math zone to plot graph metrics!
            </div>
          ) : (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 space-y-6">
              {/* Playful graphical layout bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Words Per Minute Progress bar chart */}
                <div className="space-y-3.5">
                  <h5 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider font-mono">
                    📈 Typing Speed (WPM)
                  </h5>
                  <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                    {userProgress.wpmHistory.map((item, idx) => {
                      const maxWPM = Math.max(...userProgress.wpmHistory.map((h) => h.wpm), 40);
                      const widthPercent = `${Math.min(100, (item.wpm / maxWPM) * 100)}%`;

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                            <span>{item.date}</span>
                            <span className="text-teal-400 font-bold">{item.wpm} WPM</span>
                          </div>
                          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                              style={{ width: widthPercent }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accuracy bar charts */}
                <div className="space-y-3.5">
                  <h5 className="text-xs font-extrabold text-rose-450 uppercase tracking-wider font-mono">
                    🎯 Accuracy Percentage (%)
                  </h5>
                  <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-855">
                    {userProgress.wpmHistory.map((item, idx) => {
                      const widthPercent = `${item.accuracy}%`;

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                            <span>{item.date}</span>
                            <span className="text-rose-400 font-bold">{item.accuracy}%</span>
                          </div>
                          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"
                              style={{ width: widthPercent }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tips for keyboard posture */}
              <div className="flex items-start gap-3 bg-indigo-950/20 text-indigo-300 border border-indigo-900/30 p-4 rounded-2xl text-xs">
                <CircleAlert size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 leading-relaxed text-left">
                  <strong className="text-indigo-200 block font-bold font-sans">Coach Tabby Advice for Speed:</strong>
                  <span>Always rests fingers on the Home Row (ASDF JKL;). Try typing without looking directly down. Feeling the shape of keys unlocks high-speed math!</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
