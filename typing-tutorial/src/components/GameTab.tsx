import { useState, useEffect, useRef, ChangeEvent } from "react";
import { GAME_WORDS } from "../data";
import { Play, RotateCcw, Award, Flame, Timer, Sparkles, Heart } from "lucide-react";

interface GameTabProps {
  onGameFinished: (score: number) => void;
}

export default function GameTab({ onGameFinished }: GameTabProps) {
  const [gameMode, setGameMode] = useState<"arcade" | "shark">("arcade");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [streak, setStreak] = useState(0);

  const [multiplier, setMultiplier] = useState(1);

  // Shark Attack specific state
  const [lives, setLives] = useState(3);
  const [wordTimeLeft, setWordTimeLeft] = useState(0);
  const [wordsSaved, setWordsSaved] = useState(0);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordTickRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef(0);
  const wordTimeTotalRef = useRef(5000);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wordTickRef.current) clearInterval(wordTickRef.current);
    };
  }, []);

  const selectRandomWord = () => {
    const idx = Math.floor(Math.random() * GAME_WORDS.length);
    setCurrentWord(GAME_WORDS[idx]);
  };

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wordTickRef.current) clearInterval(wordTickRef.current);
    setGameState("gameover");
    onGameFinished(Math.round(scoreRef.current));
  };

  const handleStartGame = (diff: "easy" | "medium" | "hard") => {
    setDifficulty(diff);
    const mult = diff === "easy" ? 1 : diff === "medium" ? 1.5 : 2;
    setMultiplier(mult);

    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    setGameState("playing");
    setInputValue("");

    if (timerRef.current) clearInterval(timerRef.current);
    if (wordTickRef.current) clearInterval(wordTickRef.current);

    // Choose initial word
    const idx = Math.floor(Math.random() * GAME_WORDS.length);
    setCurrentWord(GAME_WORDS[idx]);

    if (gameMode === "arcade") {
      setTimeLeft(diff === "easy" ? 60 : diff === "medium" ? 45 : 30);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Shark Attack: a word rises from the deep every round. Type it before
      // the shark reaches the surface and eats it, or lose a life.
      const total = diff === "easy" ? 7000 : diff === "medium" ? 5000 : 3500;
      wordTimeTotalRef.current = total;
      setWordTimeLeft(total);
      setLives(3);
      setWordsSaved(0);

      wordTickRef.current = setInterval(() => {
        setWordTimeLeft((prev) => {
          if (prev <= 100) {
            handleSharkMiss();
            return wordTimeTotalRef.current;
          }
          return prev - 100;
        });
      }, 100);
    }

    // Focus input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // The shark reaches the word before it's typed: lose a life and surface a new word.
  const handleSharkMiss = () => {
    playChime(false);
    setStreak(0);
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        handleGameOver();
      }
      return Math.max(0, next);
    });
    const idx = Math.floor(Math.random() * GAME_WORDS.length);
    setCurrentWord(GAME_WORDS[idx]);
    setInputValue("");
  };

  const playChime = (correct: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = correct ? 659.25 : 120; // High tone (E5) vs buzzing low tone
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context blocked
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setInputValue(e.target.value);

    // Match exact word
    if (value === currentWord.toLowerCase()) {
      playChime(true);

      // Calculate active points based on difficulty multipliers and streaks
      const wordPoints = Math.round(currentWord.length * 10 * multiplier * (1 + streak * 0.1));
      setScore((prev) => prev + wordPoints);
      setStreak((prev) => prev + 1);

      if (gameMode === "shark") {
        setWordsSaved((prev) => prev + 1);
        setWordTimeLeft(wordTimeTotalRef.current);
      }

      // Select new target word
      selectRandomWord();
      setInputValue("");
    }
  };

  const sharkProgress = gameMode === "shark" && wordTimeTotalRef.current > 0
    ? 1 - wordTimeLeft / wordTimeTotalRef.current
    : 0;

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Arcade Keyboarding Race
          </h2>
          <p className="text-xs text-zinc-500">
            Push your reflexes to the limit. Type descending structures fast to claim high school rank positions.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Game Menu State */}
        {gameState === "menu" && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              {gameMode === "arcade" ? "🎮" : "🦈"}
            </div>

            {/* Game Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                id="select-mode-arcade-btn"
                onClick={() => setGameMode("arcade")}
                className={`p-3 border rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                  gameMode === "arcade"
                    ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-sky-400/50"
                }`}
              >
                🎮 Arcade Race
              </button>
              <button
                id="select-mode-shark-btn"
                onClick={() => setGameMode("shark")}
                className={`p-3 border rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                  gameMode === "shark"
                    ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-sky-400/50"
                }`}
              >
                🦈 Shark Attack
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {gameMode === "arcade" ? "Select Difficulty Speed" : "Select Shark Speed"}
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                {gameMode === "arcade"
                  ? "Choose your velocity scale. Each tier offers different time constraints and score multipliers."
                  : "A word rises from the deep — type it before the shark reaches the surface and eats it. Lose all 3 lives and it's game over."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                id="start-easy-game-btn"
                onClick={() => handleStartGame("easy")}
                className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/20 text-zinc-800 dark:text-zinc-200 font-bold transition-all text-sm block"
              >
                <div className="text-lg mb-1">🐢</div>
                <span>Easy (1.0x)</span>
                <div className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">
                  {gameMode === "arcade" ? "60 SEC TIMED" : "SLOW RISING WORDS"}
                </div>
              </button>

              <button
                id="start-medium-game-btn"
                onClick={() => handleStartGame("medium")}
                className="p-4 border border-sky-400 dark:border-sky-800 rounded-xl hover:border-sky-500 bg-sky-500/5 text-zinc-900 dark:text-zinc-100 font-bold transition-all text-sm block"
              >
                <div className="text-lg mb-1">🐇</div>
                <span>Medium (1.5x)</span>
                <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 mt-1 uppercase">
                  {gameMode === "arcade" ? "45 SEC TIMED" : "MEDIUM RISING WORDS"}
                </div>
              </button>

              <button
                id="start-hard-game-btn"
                onClick={() => handleStartGame("hard")}
                className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-50/20 text-zinc-800 dark:text-zinc-200 font-bold transition-all text-sm block"
              >
                <div className="text-lg mb-1">🚀</div>
                <span>Hard (2.0x)</span>
                <div className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">
                  {gameMode === "arcade" ? "30 SEC TIMED" : "FAST RISING WORDS"}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Game Active State */}
        {gameState === "playing" && (
          <div className="p-8 space-y-6">

            {/* Live Stats Header Row */}
            <div className="flex items-center justify-between text-xs px-4 py-2 bg-zinc-50 dark:bg-zinc-850 rounded-xl">
              {gameMode === "arcade" ? (
                <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  <Timer size={14} className="text-rose-500" />
                  <span>TIME LEFT:</span>
                  <span className="text-sm text-zinc-900 dark:text-white font-black">{timeLeft}s</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  <span>LIVES:</span>
                  <span className="flex items-center gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <Heart
                        key={i}
                        size={14}
                        className={i < lives ? "text-rose-500 fill-rose-500" : "text-zinc-300 dark:text-zinc-700"}
                      />
                    ))}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                <Flame size={14} className="text-amber-500" />
                <span>STREAK:</span>
                <span className="text-sm text-zinc-900 dark:text-white font-black">{streak}x</span>
              </div>

              <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                <Award size={14} className="text-sky-500" />
                <span>SCORE:</span>
                <span className="text-sm text-zinc-900 dark:text-white font-black">{score}</span>
              </div>
            </div>

            {gameMode === "arcade" ? (
              /* Target Word visual block */
              <div className="text-center py-10 space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">
                  Active Target Word
                </div>

                {/* Renders letters styled nicely */}
                <div className="text-4xl font-extrabold tracking-wide text-sky-600 dark:text-sky-400 drop-shadow-sm select-none break-all">
                  {currentWord.split("").map((letter, lIdx) => {
                    let color = "text-sky-600 dark:text-sky-400";
                    if (lIdx < inputValue.length) {
                      color = letter === inputValue[lIdx]
                        ? "text-emerald-500"
                        : "text-rose-500 underline";
                    }
                    return <span key={lIdx} className={color}>{letter}</span>;
                  })}
                </div>

                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase mt-1">
                  VALUE: {Math.round(currentWord.length * 10 * multiplier)} PTS
                </p>
              </div>
            ) : (
              /* Shark Attack visual block */
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase text-center">
                  Type the word before the shark strikes!
                </div>

                <div
                  id="sharkTankArea"
                  className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-300 via-sky-500 to-blue-900 dark:from-sky-900 dark:via-blue-950 dark:to-black border border-sky-400/30"
                >
                  {/* Water surface */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-white/40"></div>

                  {/* Bubbles */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute left-[15%] bottom-2 w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                    <div className="absolute left-[75%] bottom-6 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse"></div>
                    <div className="absolute left-[45%] bottom-10 w-1 h-1 rounded-full bg-white/40 animate-pulse"></div>
                  </div>

                  {/* Rising target word */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 ease-linear px-4 py-2 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-lg font-mono text-lg sm:text-2xl font-extrabold tracking-wide select-none break-all"
                    style={{ top: `${6 + sharkProgress * 62}%` }}
                  >
                    {currentWord.split("").map((letter, lIdx) => {
                      let color = "text-sky-700 dark:text-sky-400";
                      if (lIdx < inputValue.length) {
                        color = letter === inputValue[lIdx]
                          ? "text-emerald-500"
                          : "text-rose-500 underline";
                      }
                      return <span key={lIdx} className={color}>{letter}</span>;
                    })}
                  </div>

                  {/* Shark, lurking at the bottom and lunging as time runs out */}
                  <div
                    className={`absolute bottom-1 right-4 text-4xl sm:text-5xl transition-transform duration-150 ${sharkProgress > 0.75 ? "animate-bounce" : ""}`}
                    style={{ transform: `scale(${1 + sharkProgress * 0.4})` }}
                    aria-hidden="true"
                  >
                    🦈
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase mt-1 text-center">
                  VALUE: {Math.round(currentWord.length * 10 * multiplier)} PTS · SAVED: {wordsSaved}
                </p>
              </div>
            )}

            {/* Interactive User Arena */}
            <div className="space-y-3">
              <input
                ref={inputRef}
                id="arcadeTypingInputElement"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full text-center py-3 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-xl font-mono focus:outline-none focus:border-sky-500 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900"
                placeholder="Type the word here..."
                autoComplete="off"
                spellCheck="false"
              />
            </div>

          </div>
        )}

        {/* Game Over State */}
        {gameState === "gameover" && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              {gameMode === "arcade" ? "🏆" : "🦈"}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {gameMode === "arcade" ? "Race Concluded" : "The Shark Won This Round"}
              </h3>
              <p className="text-xs text-zinc-500">Your total achievements recorded inside memory arrays:</p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-850 p-5 rounded-2xl max-w-sm mx-auto font-mono text-base shadow-inner space-y-2">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                <span className="text-zinc-500">DIFFICULTY LEVEL:</span>
                <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 capitalize">{difficulty}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                <span className="text-zinc-500">MULTIPLIER APPLIED:</span>
                <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{multiplier}x</span>
              </div>
              {gameMode === "shark" && (
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <span className="text-zinc-500">WORDS SAVED:</span>
                  <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{wordsSaved}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">ACCUMULATED SCORE:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-2xl">{score}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                id="replayArcadeBtn"
                onClick={() => setGameState("menu")}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <RotateCcw size={12} />
                <span>Play New Mode</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
