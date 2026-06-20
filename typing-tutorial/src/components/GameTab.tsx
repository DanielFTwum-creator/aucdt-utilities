import { useState, useEffect, useRef, ChangeEvent } from "react";
import { GAME_WORDS } from "../data";
import { RotateCcw, Award, Flame, Timer, Heart, Volume2 } from "lucide-react";

type GameMode = "arcade" | "shark" | "listen" | "bricks";
type Difficulty = "easy" | "medium" | "hard";

interface Brick {
  id: number;
  word: string;
  col: number;      // 0–3
  y: number;        // 0 (top) → 100 (bottom)
  speed: number;    // % per 100ms tick
  exploding: boolean;
}

interface GameTabProps {
  onGameFinished: (score: number) => void;
}

const BRICK_COLORS = [
  "bg-gradient-to-b from-sky-500 to-blue-700",
  "bg-gradient-to-b from-violet-500 to-purple-700",
  "bg-gradient-to-b from-emerald-500 to-teal-700",
  "bg-gradient-to-b from-amber-500 to-orange-700",
];

export default function GameTab({ onGameFinished }: GameTabProps) {
  const [gameMode, setGameMode]   = useState<GameMode>("arcade");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");

  // Shared
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [inputValue, setInputValue] = useState("");

  // Arcade / Listen
  const [timeLeft, setTimeLeft]   = useState(60);
  const [currentWord, setCurrentWord] = useState("");

  // Shark
  const [wordTimeLeft, setWordTimeLeft] = useState(0);
  const [wordsSaved, setWordsSaved]     = useState(0);

  // Shark + Bricks
  const [lives, setLives] = useState(3);

  // Listen
  const [wordRevealed, setWordRevealed] = useState(false);

  // Bricks
  const [bricks, setBricks] = useState<Brick[]>([]);

  // ── Refs (interval-safe) ──────────────────────────────────────────────────
  const scoreRef       = useRef(0);
  const streakRef      = useRef(0);
  const livesRef       = useRef(3);
  const multRef        = useRef(1);
  const diffRef        = useRef<Difficulty>("medium");
  const bricksRef      = useRef<Brick[]>([]);
  const brickIdRef     = useRef(0);
  const wordTimeTotalRef = useRef(5000);

  const timerRef      = useRef<NodeJS.Timeout | null>(null);
  const wordTickRef   = useRef<NodeJS.Timeout | null>(null);
  const brickLoopRef  = useRef<NodeJS.Timeout | null>(null);
  const brickSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef      = useRef<HTMLInputElement>(null);

  useEffect(() => { scoreRef.current  = score;  }, [score]);
  useEffect(() => { streakRef.current = streak; }, [streak]);

  useEffect(() => () => stopAll(), []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const stopAll = () => {
    [timerRef, wordTickRef, brickLoopRef, brickSpawnRef].forEach((r) => {
      if (r.current) { clearInterval(r.current); r.current = null; }
    });
  };

  const randomWord = (filter?: (w: string) => boolean) => {
    const pool = filter ? GAME_WORDS.filter(filter) : GAME_WORDS;
    return pool[Math.floor(Math.random() * pool.length)] ?? GAME_WORDS[0];
  };

  const playChime = (correct: boolean) => {
    try {
      const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = correct ? 659.25 : 120;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const speakWord = (word: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(word);
    utt.rate   = 0.85;
    utt.pitch  = 1;
    window.speechSynthesis.speak(utt);
  };

  const endGame = () => {
    stopAll();
    setGameState("gameover");
    onGameFinished(Math.round(scoreRef.current));
  };

  const spawnBrick = () => {
    const diff  = diffRef.current;
    const speed = diff === "easy"   ? 0.28 + Math.random() * 0.12
                : diff === "medium" ? 0.52 + Math.random() * 0.16
                :                     0.85 + Math.random() * 0.20;
    const lenOk = diff === "easy"   ? (w: string) => w.length <= 5
                : diff === "medium" ? (w: string) => w.length <= 8
                : undefined;
    const word = randomWord(lenOk);

    // Prefer a column not already occupied at the top
    const takenCols = bricksRef.current.filter(b => !b.exploding && b.y < 20).map(b => b.col);
    const freeCols  = [0,1,2,3].filter(c => !takenCols.includes(c));
    const col = freeCols.length > 0
      ? freeCols[Math.floor(Math.random() * freeCols.length)]
      : Math.floor(Math.random() * 4);

    const brick: Brick = { id: ++brickIdRef.current, word, col, y: 0, speed, exploding: false };
    const next = [...bricksRef.current, brick];
    bricksRef.current = next;
    setBricks([...next]);
  };

  // ── Game start ────────────────────────────────────────────────────────────

  const handleStartGame = (diff: Difficulty) => {
    setDifficulty(diff);
    diffRef.current = diff;
    const mult = diff === "easy" ? 1 : diff === "medium" ? 1.5 : 2;
    setMultiplier(mult);
    multRef.current = mult;

    setScore(0); scoreRef.current = 0;
    setStreak(0); streakRef.current = 0;
    setInputValue("");
    setGameState("playing");
    stopAll();

    // ── Arcade ──
    if (gameMode === "arcade") {
      const secs = diff === "easy" ? 60 : diff === "medium" ? 45 : 30;
      setTimeLeft(secs);
      const word = randomWord();
      setCurrentWord(word);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 1) { endGame(); return 0; } return prev - 1; });
      }, 1000);
    }

    // ── Listen & Type ──
    else if (gameMode === "listen") {
      const secs = diff === "easy" ? 90 : diff === "medium" ? 60 : 45;
      setTimeLeft(secs);
      setWordRevealed(false);
      const word = randomWord();
      setCurrentWord(word);
      speakWord(word);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 1) { endGame(); return 0; } return prev - 1; });
      }, 1000);
    }

    // ── Shark Attack ──
    else if (gameMode === "shark") {
      const total = diff === "easy" ? 7000 : diff === "medium" ? 5000 : 3500;
      wordTimeTotalRef.current = total;
      setWordTimeLeft(total);
      setLives(3); livesRef.current = 3;
      setWordsSaved(0);
      setCurrentWord(randomWord());

      wordTickRef.current = setInterval(() => {
        setWordTimeLeft(prev => {
          if (prev <= 100) {
            // Miss
            playChime(false);
            setStreak(0); streakRef.current = 0;
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            if (livesRef.current <= 0) { endGame(); return wordTimeTotalRef.current; }
            setCurrentWord(randomWord());
            setInputValue("");
            return wordTimeTotalRef.current;
          }
          return prev - 100;
        });
      }, 100);
    }

    // ── Falling Bricks ──
    else if (gameMode === "bricks") {
      const maxLives = diff === "easy" ? 5 : diff === "medium" ? 3 : 2;
      setLives(maxLives); livesRef.current = maxLives;
      setBricks([]); bricksRef.current = [];
      brickIdRef.current = 0;

      // Spawn first brick immediately
      setTimeout(() => spawnBrick(), 0);

      // Physics loop — move bricks down every 100ms
      brickLoopRef.current = setInterval(() => {
        const moved = bricksRef.current.map(b =>
          b.exploding ? b : { ...b, y: b.y + b.speed }
        );
        const landed = moved.filter(b => !b.exploding && b.y >= 93);
        if (landed.length > 0) {
          playChime(false);
          livesRef.current = Math.max(0, livesRef.current - landed.length);
          setLives(livesRef.current);
          if (livesRef.current <= 0) { endGame(); return; }
        }
        const remaining = moved.filter(b => b.exploding || b.y < 93);
        bricksRef.current = remaining;
        setBricks([...remaining]);
      }, 100);

      // Spawn loop
      const spawnMs  = diff === "easy" ? 3500 : diff === "medium" ? 2500 : 1800;
      const maxOnScreen = diff === "easy" ? 2 : diff === "medium" ? 3 : 4;
      brickSpawnRef.current = setInterval(() => {
        const active = bricksRef.current.filter(b => !b.exploding).length;
        if (active < maxOnScreen) spawnBrick();
      }, spawnMs);
    }

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Input handler ─────────────────────────────────────────────────────────

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const val = raw.toLowerCase().trim();
    setInputValue(raw);

    if (gameMode === "arcade" || gameMode === "listen" || gameMode === "shark") {
      if (val === currentWord.toLowerCase()) {
        playChime(true);
        const pts = Math.round(currentWord.length * 10 * multRef.current * (1 + streakRef.current * 0.1));
        setScore(p => p + pts); scoreRef.current += pts;
        setStreak(p => p + 1); streakRef.current += 1;
        if (gameMode === "shark") {
          setWordsSaved(p => p + 1);
          setWordTimeLeft(wordTimeTotalRef.current);
        }
        const next = randomWord();
        setCurrentWord(next);
        setInputValue("");
        if (gameMode === "listen") {
          setWordRevealed(false);
          setTimeout(() => speakWord(next), 300);
        }
      }

    } else if (gameMode === "bricks") {
      const hit = bricksRef.current.find(b => !b.exploding && b.word.toLowerCase() === val);
      if (hit) {
        playChime(true);
        const pts = Math.round(hit.word.length * 10 * multRef.current * (1 + streakRef.current * 0.1));
        setScore(p => p + pts); scoreRef.current += pts;
        setStreak(p => p + 1); streakRef.current += 1;
        setInputValue("");

        // Explode animation
        const withBoom = bricksRef.current.map(b => b.id === hit.id ? { ...b, exploding: true } : b);
        bricksRef.current = withBoom;
        setBricks([...withBoom]);

        // Remove after animation + spawn replacement
        setTimeout(() => {
          const clean = bricksRef.current.filter(b => b.id !== hit.id);
          bricksRef.current = clean;
          setBricks([...clean]);
          spawnBrick();
        }, 350);
      }
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const sharkProgress = gameMode === "shark" && wordTimeTotalRef.current > 0
    ? 1 - wordTimeLeft / wordTimeTotalRef.current : 0;

  const maxLivesDisplay = gameMode === "bricks" && difficulty === "easy" ? 5
    : gameMode === "bricks" && difficulty === "hard" ? 2 : 3;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Arcade Keyboarding Race</h2>
        <p className="text-xs text-zinc-500">Push your reflexes to the limit. Type fast to claim high school rank positions.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">

        {/* ══════════════════════════════ MENU ══════════════════════════════ */}
        {gameState === "menu" && (
          <div className="p-8 text-center space-y-6">

            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-950 rounded-full flex items-center justify-center mx-auto text-3xl select-none">
              {{ arcade: "🎮", shark: "🦈", listen: "🔊", bricks: "🧱" }[gameMode]}
            </div>

            {/* Mode grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {([
                { id: "arcade" as GameMode, label: "🎮 Arcade Race",    sub: "Type words before time runs out"     },
                { id: "shark"  as GameMode, label: "🦈 Shark Attack",   sub: "Don't let words reach the surface"  },
                { id: "listen" as GameMode, label: "🔊 Listen & Type",  sub: "Hear it — type it from memory"      },
                { id: "bricks" as GameMode, label: "🧱 Falling Bricks", sub: "Type words to smash the blocks"     },
              ]).map(({ id, label, sub }) => (
                <button
                  key={id}
                  id={`select-mode-${id}-btn`}
                  onClick={() => setGameMode(id)}
                  className={`p-3 border rounded-xl font-bold transition-all text-sm text-left ${
                    gameMode === id
                      ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-sky-400/50"
                  }`}
                >
                  <div>{label}</div>
                  <div className="text-[10px] font-normal text-zinc-400 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {{ arcade: "Select Difficulty", shark: "Select Shark Speed", listen: "Select Listening Speed", bricks: "Select Fall Speed" }[gameMode]}
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                {{
                  arcade:  "Choose your velocity scale. Each tier offers different time constraints and score multipliers.",
                  shark:   "A word rises from the deep — type it before the shark reaches the surface. Lose all 3 lives and it's over.",
                  listen:  "A word is spoken aloud via your browser's built-in voice. Type what you hear. Use Replay freely — Reveal only as a last resort.",
                  bricks:  "Words fall from the top in 4 columns. Type any brick's word exactly to smash it. Miss too many and it's game over.",
                }[gameMode]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {([
                { d: "easy"   as Difficulty, emoji: "🐢", label: "Easy (1.0x)",   subs: { arcade: "60 SEC",  shark: "SLOW RISING",  listen: "90 SEC",  bricks: "SLOW FALL"  } },
                { d: "medium" as Difficulty, emoji: "🐇", label: "Medium (1.5x)", subs: { arcade: "45 SEC",  shark: "MED RISING",   listen: "60 SEC",  bricks: "MED FALL"   } },
                { d: "hard"   as Difficulty, emoji: "🚀", label: "Hard (2.0x)",   subs: { arcade: "30 SEC",  shark: "FAST RISING",  listen: "45 SEC",  bricks: "FAST FALL"  } },
              ]).map(({ d, emoji, label, subs }, i) => (
                <button
                  key={d}
                  id={`start-${d}-game-btn`}
                  onClick={() => handleStartGame(d)}
                  className={`p-4 border rounded-xl font-bold transition-all text-sm block ${
                    i === 1
                      ? "border-sky-400 dark:border-sky-800 bg-sky-500/5 text-zinc-900 dark:text-zinc-100 hover:border-sky-500"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-sky-400/50"
                  }`}
                >
                  <div className="text-lg mb-1">{emoji}</div>
                  <span>{label}</span>
                  <div className={`text-[10px] font-mono mt-1 uppercase ${i === 1 ? "text-sky-600 dark:text-sky-400" : "text-zinc-400"}`}>
                    {subs[gameMode]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════ PLAYING ═══════════════════════════ */}
        {gameState === "playing" && (
          <div className="p-8 space-y-6">

            {/* Stats bar */}
            <div className="flex items-center justify-between text-xs px-4 py-2 bg-zinc-50 dark:bg-zinc-850 rounded-xl">
              {(gameMode === "arcade" || gameMode === "listen") ? (
                <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  <Timer size={14} className="text-rose-500" />
                  <span>TIME: <span className="text-zinc-900 dark:text-white font-black">{timeLeft}s</span></span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  <span>LIVES: </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: maxLivesDisplay }).map((_, i) => (
                      <Heart key={i} size={13} className={i < lives ? "text-rose-500 fill-rose-500" : "text-zinc-300 dark:text-zinc-700"} />
                    ))}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                <Flame size={14} className="text-amber-500" />
                <span>STREAK: <span className="text-zinc-900 dark:text-white font-black">{streak}x</span></span>
              </div>

              <div className="flex items-center space-x-1.5 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                <Award size={14} className="text-sky-500" />
                <span>SCORE: <span className="text-zinc-900 dark:text-white font-black">{score}</span></span>
              </div>
            </div>

            {/* ── Arcade ── */}
            {gameMode === "arcade" && (
              <div className="text-center py-10 space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">Active Target Word</div>
                <div className="text-4xl font-extrabold tracking-wide drop-shadow-sm select-none break-all">
                  {currentWord.split("").map((ch, i) => (
                    <span key={i} className={
                      inputValue[i] === undefined ? "text-sky-600 dark:text-sky-400"
                      : inputValue[i] === ch      ? "text-emerald-500"
                      :                             "text-rose-500 underline"
                    }>{ch}</span>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase">
                  VALUE: {Math.round(currentWord.length * 10 * multiplier)} PTS
                </p>
              </div>
            )}

            {/* ── Shark ── */}
            {gameMode === "shark" && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase text-center">
                  Type the word before the shark strikes!
                </div>
                <div id="sharkTankArea" className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-300 via-sky-500 to-blue-900 dark:from-sky-900 dark:via-blue-950 dark:to-black border border-sky-400/30">
                  <div className="absolute top-0 inset-x-0 h-2 bg-white/40" />
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute left-[15%] bottom-2  w-2   h-2   rounded-full bg-white/60 animate-pulse" />
                    <div className="absolute left-[75%] bottom-6  w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                    <div className="absolute left-[45%] bottom-10 w-1   h-1   rounded-full bg-white/40 animate-pulse" />
                  </div>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 ease-linear px-4 py-2 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-lg font-mono text-lg sm:text-2xl font-extrabold tracking-wide select-none"
                    style={{ top: `${6 + sharkProgress * 62}%` }}
                  >
                    {currentWord.split("").map((ch, i) => (
                      <span key={i} className={
                        inputValue[i] === undefined ? "text-sky-700 dark:text-sky-400"
                        : inputValue[i] === ch      ? "text-emerald-500"
                        :                             "text-rose-500 underline"
                      }>{ch}</span>
                    ))}
                  </div>
                  <div
                    className={`absolute bottom-1 right-4 text-4xl sm:text-5xl transition-transform duration-150 ${sharkProgress > 0.75 ? "animate-bounce" : ""}`}
                    style={{ transform: `scale(${1 + sharkProgress * 0.4})` }}
                    aria-hidden="true"
                  >🦈</div>
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase text-center">
                  VALUE: {Math.round(currentWord.length * 10 * multiplier)} PTS · SAVED: {wordsSaved}
                </p>
              </div>
            )}

            {/* ── Listen & Type ── */}
            {gameMode === "listen" && (
              <div className="text-center py-8 space-y-4">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">
                  Listen carefully — then type the word below
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-sky-100 dark:bg-sky-950 rounded-full flex items-center justify-center text-4xl select-none">
                    🔊
                  </div>
                  {wordRevealed && (
                    <div className="text-3xl font-extrabold tracking-wide text-emerald-500 select-none">
                      {currentWord}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakWord(currentWord)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 transition-all"
                    >
                      <Volume2 size={13} /> Replay
                    </button>
                    {!wordRevealed && (
                      <button
                        onClick={() => setWordRevealed(true)}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                      >
                        Reveal
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase">
                  VALUE: {Math.round(currentWord.length * 10 * multiplier)} PTS
                </p>
              </div>
            )}

            {/* ── Falling Bricks ── */}
            {gameMode === "bricks" && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase text-center">
                  Type a brick's word exactly to destroy it
                </div>
                <div className="relative h-64 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                  {/* Column guides */}
                  <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                    {[0,1,2].map(i => <div key={i} className="border-r border-zinc-800/40" />)}
                  </div>

                  {bricks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs font-mono animate-pulse">
                      INCOMING…
                    </div>
                  )}

                  {bricks.map((brick) => {
                    const typed    = inputValue.toLowerCase().trim();
                    const isActive = !brick.exploding && typed.length > 0
                      && brick.word.toLowerCase().startsWith(typed);
                    return (
                      <div
                        key={brick.id}
                        className={`absolute px-1.5 py-1 rounded-md font-mono font-bold text-xs text-white shadow-lg select-none text-center
                          ${BRICK_COLORS[brick.col]}
                          ${brick.exploding ? "opacity-0 scale-150 duration-300" : ""}
                          ${isActive ? "ring-2 ring-white ring-offset-1 ring-offset-zinc-950 scale-105" : ""}
                          transition-all`}
                        style={{ left: `${brick.col * 25 + 1}%`, top: `${brick.y}%`, width: "23%" }}
                      >
                        {brick.word.split("").map((ch, i) => (
                          <span key={i} className={isActive && i < typed.length ? "text-yellow-300" : ""}>
                            {ch}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-zinc-400 font-semibold font-mono uppercase text-center">
                  ACTIVE: {bricks.filter(b => !b.exploding).length} BRICKS · SCORE: {score}
                </p>
              </div>
            )}

            {/* Shared input */}
            <input
              ref={inputRef}
              id="arcadeTypingInputElement"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full text-center py-3 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl text-xl font-mono focus:outline-none focus:border-sky-500 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900"
              placeholder={
                gameMode === "listen" ? "Type the word you heard…"
                : gameMode === "bricks" ? "Type a falling word to destroy it…"
                : "Type the word here…"
              }
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )}

        {/* ══════════════════════════════ GAME OVER ═════════════════════════ */}
        {gameState === "gameover" && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto text-3xl">
              {{ arcade: "🏆", shark: "🦈", listen: "🎧", bricks: "🧱" }[gameMode]}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {{ arcade: "Race Concluded", shark: "The Shark Won This Round", listen: "Session Complete", bricks: "Bricks Won This Time" }[gameMode]}
              </h3>
              <p className="text-xs text-zinc-500">Your total achievements recorded inside memory arrays:</p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-850 p-5 rounded-2xl max-w-sm mx-auto font-mono shadow-inner space-y-2">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                <span className="text-zinc-500">DIFFICULTY:</span>
                <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 capitalize">{difficulty}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                <span className="text-zinc-500">MULTIPLIER:</span>
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

            <button
              id="replayArcadeBtn"
              onClick={() => setGameState("menu")}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw size={12} />
              Play New Mode
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
