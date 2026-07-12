import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  BookOpen, 
  Sparkles,
  Eye,
  Activity,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Define TypeScript interfaces for the Diagnostic Quiz
interface Question {
  type: "mc" | "short";
  text: string;
  options?: string[];
  correct?: number;
  hint: string;
  rationale: string;
}

const QUESTIONS: Question[] = [
  {
    type: "mc",
    text: "In the case study, Nana missed three internal deadlines before the group raised the issue directly with her. What is the main risk of waiting this long to address a problem?",
    options: [
      "The other members look lazy by comparison",
      "There's less time left to recover or redistribute the work",
      "Nana will definitely leave the group",
      "The lecturer will notice sooner"
    ],
    correct: 1,
    hint: "Think about what shrinks every day the problem goes unaddressed.",
    rationale: "Delay shrinks the time available to recover, redistribute work, or adjust the plan."
  },
  {
    type: "mc",
    text: "Nana said she was \"waiting for materials\" that she had not actually ordered. What does this reveal about relying on verbal status updates alone?",
    options: [
      "Verbal updates are always reliable if the person is honest",
      "Groups should verify progress with visible evidence, not just assurances",
      "It reveals nothing important",
      "Only the team leader should ask for updates"
    ],
    correct: 1,
    hint: "What would have caught this earlier — a receipt, a sample, a WhatsApp message?",
    rationale: "Verbal reassurance isn't evidence; visible progress (samples, receipts, drafts) is what confirms real status."
  },
  {
    type: "mc",
    text: "The group divided roles so that only one person handled embellishment. What is the main risk of this 'one person, one skill' structure?",
    options: [
      "It's unfair because embellishment is more creative than other tasks",
      "If that one person falls behind, there's no one else who can immediately step in",
      "It makes the workload too easy for everyone else",
      "There is no real risk — specialisation is always best"
    ],
    correct: 1,
    hint: "What happened when Nana fell behind — could anyone else pick up the beading straight away?",
    rationale: "Single-owner roles create a bottleneck: if that person stalls, no one else can pick up the specialised work quickly."
  },
  {
    type: "short",
    text: "Name one practical way a group could track progress on a shared project without needing to confront anyone directly.",
    hint: "Think about tools or habits, not conversations — shared drives, photo updates, checklists.",
    rationale: "Accepted answers: a shared checklist, WhatsApp progress photos, a shared drive with dated files, or a weekly stand-up update."
  },
  {
    type: "mc",
    text: "Which of the following is the best early warning sign that a team member may be struggling, before a deadline is even missed?",
    options: [
      "They stop replying to messages until the last minute",
      "They ask a clarifying question about the brief",
      "They submit work a day early",
      "They attend every meeting"
    ],
    correct: 0,
    hint: "Withdrawal usually comes before the missed deadline itself.",
    rationale: "Withdrawal and reduced communication typically precede a missed deadline, more than the deadline itself."
  },
  {
    type: "short",
    text: "If you were a group member and noticed a teammate falling behind in week 2 of a 6-week project, what is one thing you could say to them that raises the issue without sounding like an accusation?",
    hint: "A genuine question about progress usually lands better than a statement about failure.",
    rationale: "Core idea: something direct but non-accusatory, e.g. \"How's the beading coming along — do you need help with anything?\""
  },
  {
    type: "mc",
    text: "The group eventually redistributed Nana's beading work between two other members. What is the main trade-off of this kind of last-minute redistribution?",
    options: [
      "It guarantees the same quality as originally planned",
      "It usually means rushed work and a weaker final result, even if the deadline is met",
      "It has no downside once the work gets done",
      "It only affects the person who picks up the extra work"
    ],
    correct: 1,
    hint: "Recall what the runway garments actually looked like after the redistribution.",
    rationale: "Redistribution under time pressure almost always costs quality, even when it saves the deadline."
  },
  {
    type: "mc",
    text: "Your group agreed that fabric sourcing would be done by Week 2. It's now Week 3, and the person responsible says 'it's basically sorted' but has shown no receipts, samples, or supplier confirmation. What should the group do first?",
    options: [
      "Trust the update and move on to the next phase",
      "Ask to see concrete evidence before proceeding",
      "Report them to the lecturer immediately",
      "Quietly start a backup fabric search without telling them"
    ],
    correct: 1,
    hint: "What's the difference between a reassurance and proof?",
    rationale: "Concrete evidence, not reassurance, should trigger the next phase of work."
  },
  {
    type: "mc",
    text: "Two weeks before your group's fashion show, one garment still has no embellishment done, and the responsible member insists they can finish it in time. What is the most sensible group decision?",
    options: [
      "Trust them completely and do nothing, since they made a promise",
      "Set a firm short-term checkpoint with a visible deliverable, and agree on a backup plan if it's missed",
      "Remove them from the group immediately",
      "Redo all the embellishment yourselves without discussion"
    ],
    correct: 1,
    hint: "Balance isn't full trust or full takeover — it's a short deadline with a safety net.",
    rationale: "A short, firm checkpoint with a backup plan balances trust with protection against total failure."
  },
  {
    type: "short",
    text: "In one sentence, what is the difference between supporting a struggling teammate and enabling them to keep missing deadlines?",
    hint: "One helps them deliver. The other quietly absorbs the cost of them not delivering.",
    rationale: "Core idea: supporting means helping them deliver; enabling means letting them avoid consequences while others absorb the cost."
  }
];

type Theme = "dark" | "light" | "high-contrast";

export default function App() {
  // Application State
  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | string | null)[]>(() => {
    const saved = localStorage.getItem("tuc_diagnostic_answers");
    return saved ? JSON.parse(saved) : new Array(QUESTIONS.length).fill(null);
  });
  const [currentShortAnswer, setCurrentShortAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("tuc_diagnostic_theme") as Theme) || "dark";
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem("tuc_diagnostic_muted") === "true";
  });
  const [announcement, setAnnouncement] = useState<string>("");

  const shortInputRef = useRef<HTMLTextAreaElement>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("tuc_diagnostic_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("tuc_diagnostic_theme", theme);
    const root = document.documentElement;
    root.className = ""; // clear previous themes
    if (theme === "light") {
      root.classList.add("theme-light");
    } else if (theme === "high-contrast") {
      root.classList.add("theme-high-contrast");
    } else {
      root.classList.add("theme-dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tuc_diagnostic_muted", String(isMuted));
  }, [isMuted]);

  // Calculate score whenever answers change
  useEffect(() => {
    let computedScore = 0;
    QUESTIONS.forEach((q, idx) => {
      if (q.type === "mc" && answers[idx] === q.correct) {
        computedScore++;
      }
    });
    setScore(computedScore);
  }, [answers]);

  // Set the current short answer when changing questions
  useEffect(() => {
    const savedAnswer = answers[current];
    if (QUESTIONS[current].type === "short") {
      setCurrentShortAnswer(typeof savedAnswer === "string" ? savedAnswer : "");
    }
    setShowFeedback(savedAnswer !== null);
    setShowHint(false);
  }, [current, answers]);

  // Sound Feedback Generator using Web Audio API
  const playSound = useCallback((type: "success" | "error" | "click" | "complete") => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "complete") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
        osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.1); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.warn("Audio context not allowed yet by browser.", e);
    }
  }, [isMuted]);

  // Announcement helper for screen readers
  const announce = (text: string) => {
    setAnnouncement(text);
    setTimeout(() => setAnnouncement(""), 1000);
  };

  // Keyboard listeners for ease of use
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const q = QUESTIONS[current];
      if (current >= QUESTIONS.length) return;

      // Avoid trigger when typing in textarea
      if (document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (q.type === "mc" && !showFeedback) {
        if (e.key.toLowerCase() === "a") selectOption(0);
        if (e.key.toLowerCase() === "b") selectOption(1);
        if (e.key.toLowerCase() === "c") selectOption(2);
        if (e.key.toLowerCase() === "d") selectOption(3);
      }

      if (e.key === "Enter") {
        if (q.type === "short" && !showFeedback) {
          submitShortAnswer();
        } else if (showFeedback) {
          goNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, showFeedback, currentShortAnswer]);

  const selectOption = (idx: number) => {
    const q = QUESTIONS[current];
    if (answers[current] !== null) return; // Answered already

    const isCorrect = idx === q.correct;
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    setShowFeedback(true);

    if (isCorrect) {
      playSound("success");
      announce(`Correct answer selected. ${q.rationale}`);
    } else {
      playSound("error");
      announce(`Incorrect. The correct answer is option ${String.fromCharCode(65 + (q.correct ?? 0))}. ${q.rationale}`);
    }
  };

  const submitShortAnswer = () => {
    if (currentShortAnswer.trim() === "") {
      playSound("error");
      announce("Please type an answer before submitting.");
      return;
    }
    const newAnswers = [...answers];
    newAnswers[current] = currentShortAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);
    playSound("success");
    announce(`Answer submitted. Model rationale displayed.`);
  };

  const goNext = () => {
    playSound("click");
    if (current + 1 === QUESTIONS.length) {
      playSound("complete");
    }
    setCurrent(prev => prev + 1);
  };

  const goBack = () => {
    if (current > 0) {
      playSound("click");
      setCurrent(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    playSound("click");
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setCurrent(0);
    setCurrentShortAnswer("");
    setShowFeedback(false);
    setShowHint(false);
    announce("Diagnostic restarted.");
  };

  const toggleHint = () => {
    playSound("click");
    setShowHint(!showHint);
    announce(showHint ? "Hint hidden." : `Hint displayed: ${QUESTIONS[current].hint}`);
  };

  // Themes & Styles Configurations
  const getThemeBg = () => {
    if (theme === "light") {
      return "bg-[#F7F5F0] text-[#1E1113]";
    } else if (theme === "high-contrast") {
      return "bg-black text-white";
    }
    return "bg-[#1a080a] text-[#f4efe6]";
  };

  const getCardBg = () => {
    if (theme === "light") {
      return "bg-white border-[#C9A24B]/30 shadow-lg";
    } else if (theme === "high-contrast") {
      return "bg-black border-2 border-white";
    }
    return "bg-[#241012]/80 border border-[#c9a24b]/20 shadow-2xl backdrop-blur-md rounded-none";
  };

  const getButtonPrimary = () => {
    if (theme === "light") {
      return "bg-[#6E1423] text-white hover:bg-[#8D1D30]";
    } else if (theme === "high-contrast") {
      return "bg-white text-black font-bold hover:bg-[#E4C374]";
    }
    return "bg-[#c9a24b] text-[#1a080a] font-bold tracking-[0.2em] uppercase shadow-lg shadow-[#c9a24b]/20 hover:bg-[#e4c374] active:translate-y-px transition-all rounded-none";
  };

  const getButtonSecondary = () => {
    if (theme === "light") {
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300";
    } else if (theme === "high-contrast") {
      return "bg-black text-white border-2 border-white hover:bg-white hover:text-black";
    }
    return "bg-white/5 border border-white/5 hover:border-[#c9a24b]/40 text-[#f4efe6]/50 hover:text-[#f4efe6] transition-all rounded-none";
  };

  const isCompleted = current >= QUESTIONS.length;
  const scoredQuestionsCount = QUESTIONS.filter(q => q.type === "mc").length;

  return (
    <div 
      className={`h-screen max-h-screen flex flex-col justify-between items-center font-serif transition-colors duration-300 relative overflow-hidden ${getThemeBg()}`}
      id="diagnostic-root"
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement}
      </div>

      {/* Atmospheric Background Glows */}
      {theme === "dark" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#6e1423] opacity-20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[#c9a24b] opacity-10 blur-[120px] rounded-full"></div>
        </div>
      )}

      {/* Top Utility Header */}
      <div className="relative z-20 w-full px-4 sm:px-12 pt-3 sm:pt-4 flex justify-between items-center font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#c9a24b]/50 shrink-0">
        <span>TUC ICT-ACADEMIC PERFORMANCE</span>
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-sm border border-[#C9A24B]/20">
            <button
              onClick={() => { setTheme("dark"); playSound("click"); }}
              className={`p-1 rounded-sm transition-colors ${theme === "dark" ? "bg-[#C9A24B] text-[#1a080a]" : "text-gray-400 hover:text-white"}`}
              title="Dark Academic Theme"
              aria-label="Switch to dark academic theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setTheme("light"); playSound("click"); }}
              className={`p-1 rounded-sm transition-colors ${theme === "light" ? "bg-[#6E1423] text-white" : "text-gray-400 hover:text-white"}`}
              title="Warm Library Theme"
              aria-label="Switch to warm library theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setTheme("high-contrast"); playSound("click"); }}
              className={`p-1 rounded-sm transition-colors ${theme === "high-contrast" ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white"}`}
              title="High Contrast Theme"
              aria-label="Switch to high contrast theme"
            >
              <span className="text-[9px] font-sans px-1 font-bold">HC</span>
            </button>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-sm border border-[#C9A24B]/20 bg-black/40 hover:bg-[#C9A24B]/10 text-[#C9A24B] transition-colors"
            title={isMuted ? "Unmute diagnostic audio" : "Mute diagnostic audio"}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Top Navigation / Progress Header */}
      <nav className="relative z-10 w-full px-4 sm:px-12 pt-2 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#c9a24b]/10 gap-2 sm:gap-4 mb-3 shrink-0">
        <div className="space-y-1">
          <p className="text-[#c9a24b] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] opacity-80">Case Study Assessment</p>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[#e4c374]">
            Teamwork &amp; Accountability <span className="text-[#f4efe6]/30 px-2 italic">Diagnostic</span>
          </h1>
        </div>
        <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1.5 sm:gap-2 w-full sm:w-auto">
          <div className="flex gap-1.5 sm:gap-2" role="progressbar" aria-valuenow={isCompleted ? QUESTIONS.length : current + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
            {QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-1 rounded-full transition-all duration-300 ${
                  idx < current || isCompleted
                    ? "bg-[#c9a24b] opacity-100 shadow-[0_0_8px_#c9a24b]"
                    : idx === current
                    ? "bg-[#e4c374] opacity-100 shadow-[0_0_12px_#e4c374] scale-y-125"
                    : theme === "dark"
                      ? "bg-white/10"
                      : theme === "high-contrast"
                        ? "bg-gray-700"
                        : "bg-black/10"
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[10px] sm:text-[11px] text-[#c9a24b]/60 uppercase tracking-widest">
            {isCompleted ? "Diagnostic Complete" : `Module 3 / Step ${String(current + 1).padStart(2, '0')}`}
          </p>
        </div>
      </nav>

      {/* Main Content Wrap */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center w-full px-4 sm:px-12 py-2 sm:py-3">
        <div className="w-full max-h-full flex flex-col">
          <AnimatePresence mode="wait">
        {!isCompleted ? (
              <motion.div
                key={`question-${current}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`w-full rounded-none p-4 sm:p-6 lg:p-8 border transition-all duration-300 backdrop-blur-md flex flex-col max-h-full overflow-hidden ${getCardBg()}`}
                id="diagnostic-card"
              >
                {/* Question Label Header */}
                <header className="mb-4 sm:mb-5 shrink-0">
                  <span className="inline-block px-3 py-1 bg-[#6e1423] text-[#e4c374] text-[10px] font-mono uppercase tracking-[0.2em] mb-2 sm:mb-3 border border-[#c9a24b]/30 rounded-none">
                    Scenario Query — Case {current + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl md:text-2xl leading-normal font-light text-[#f4efe6] font-serif">
                    {QUESTIONS[current].text}
                  </h2>
                </header>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-4 mb-4">
                  {/* Input / Options Body */}
                  <div>
                    {QUESTIONS[current].type === "mc" ? (
                      <div className="grid grid-cols-1 gap-3" id="mc-options-container" role="radiogroup" aria-label="Multiple choice answers">
                        {QUESTIONS[current].options?.map((opt, idx) => {
                          const letter = String.fromCharCode(65 + idx);
                          const isSelected = answers[current] === idx;
                          const isCorrectOption = idx === QUESTIONS[current].correct;
                          const isAnswered = answers[current] !== null;

                          let optStyle = "";
                          let prefixStyle = "";
                          let indicatorElement = null;

                          if (theme === "dark") {
                            if (isAnswered) {
                              if (isCorrectOption) {
                                optStyle = "bg-[#6e1423]/40 border-[#c9a24b] shadow-[0_0_20px_rgba(201,162,75,0.05)] text-[#f4efe6]";
                                prefixStyle = "text-[#e4c374] underline decoration-2 underline-offset-4";
                                indicatorElement = (
                                  <div className="ml-auto flex items-center gap-2 shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-[#e4c374]" />
                                    <div className="w-2 h-2 bg-[#e4c374] rounded-full shadow-[0_0_10px_#e4c374]" />
                                  </div>
                                );
                              } else if (isSelected) {
                                optStyle = "bg-rose-950/30 border-rose-500/50 text-rose-100";
                                prefixStyle = "text-rose-400";
                                indicatorElement = (
                                  <div className="ml-auto flex items-center gap-2 shrink-0">
                                    <XCircle className="w-4 h-4 text-rose-500" />
                                    <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
                                  </div>
                                );
                              } else {
                                optStyle = "bg-[#F4EFE6]/2 opacity-40 border-transparent text-[#f4efe6]/40 pointer-events-none";
                                prefixStyle = "text-[#c9a24b]/40";
                              }
                            } else {
                              optStyle = "bg-white/5 border border-white/5 hover:border-[#c9a24b]/40 text-[#f4efe6]/80 hover:text-[#f4efe6]";
                              prefixStyle = "text-[#c9a24b] group-hover:scale-110";
                            }
                          } else {
                            // light / high contrast fallback
                            let baseStyle = "bg-[#F4EFE6]/5 border-[#F4EFE6]/10 hover:bg-[#F4EFE6]/10";
                            if (theme === "light") {
                              baseStyle = "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800";
                            } else if (theme === "high-contrast") {
                              baseStyle = "bg-black border-white hover:bg-white hover:text-black text-white";
                            }

                            if (isAnswered) {
                              if (isCorrectOption) {
                                optStyle = "bg-emerald-950/20 border-emerald-500 text-emerald-200 font-medium";
                                prefixStyle = "text-emerald-500";
                                indicatorElement = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-auto" />;
                              } else if (isSelected) {
                                optStyle = "bg-rose-950/20 border-rose-500 text-rose-200";
                                prefixStyle = "text-rose-500";
                                indicatorElement = <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-auto" />;
                              } else {
                                optStyle = "opacity-50 pointer-events-none border-transparent bg-transparent";
                                prefixStyle = "opacity-50";
                              }
                            } else {
                              optStyle = baseStyle;
                              prefixStyle = "text-[#C9A24B]";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => selectOption(idx)}
                              disabled={isAnswered}
                              className={`w-full flex items-center text-left p-3 sm:p-4 transition-all duration-200 outline-none rounded-none group ${optStyle}`}
                              role="radio"
                              aria-checked={isSelected}
                            >
                              <span className={`font-mono mr-4 text-xs transition-transform shrink-0 ${prefixStyle}`}>
                                [{letter}]
                              </span>
                              <span className="text-sm sm:text-base flex-1">{opt}</span>
                              {indicatorElement}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <textarea
                          ref={shortInputRef}
                          id="short-answer-input"
                          value={currentShortAnswer}
                          onChange={(e) => setCurrentShortAnswer(e.target.value)}
                          disabled={showFeedback}
                          placeholder="Provide a professional, critical, one-to-two sentence assessment..."
                          className={`w-full min-h-[90px] sm:min-h-[110px] p-4 bg-white/5 border border-[#c9a24b]/20 rounded-none font-serif text-base text-[#f4efe6] placeholder:text-[#f4efe6]/30 focus:outline-none focus:ring-1 focus:ring-[#c9a24b] disabled:opacity-60 transition-all ${
                            theme === "light" 
                              ? "bg-black/5 border-[#6e1423]/20 text-[#1e1113] focus:ring-[#6e1423] placeholder:text-gray-400" 
                              : theme === "high-contrast"
                                ? "bg-black border-2 border-white text-white focus:ring-white placeholder:text-gray-400"
                                : ""
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Rationale / Feedback Panel */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-4 mt-3"
                      >
                        <div className={`border-l-2 border-[#c9a24b] p-4 bg-[#6e1423]/10 font-sans text-xs sm:text-sm leading-relaxed text-gray-300 rounded-none ${
                          theme === "light"
                            ? "bg-gray-100 border-[#6e1423] text-gray-800"
                            : theme === "high-contrast"
                              ? "bg-black border-white text-white"
                              : ""
                        }`}>
                          <div className="flex items-center gap-2 mb-2 text-[#e4c374] font-medium text-[10px] tracking-wider uppercase font-mono">
                            <Sparkles className="w-3.5 h-3.5" />
                            {QUESTIONS[current].type === "mc" ? "Correct Rationale" : "Institutional Guideline / Benchmark"}
                          </div>
                          <p className="italic font-serif text-[#f4efe6] text-sm sm:text-base leading-relaxed">
                            "{QUESTIONS[current].rationale}"
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#c9a24b]/10 pt-4 gap-4 mt-4 shrink-0">
                  <div className="flex items-center gap-4 group cursor-help w-full sm:w-auto">
                    <button
                      onClick={toggleHint}
                      className="w-8 h-8 shrink-0 flex items-center justify-center border border-[#c9a24b]/30 rounded-full text-[#c9a24b] hover:border-[#e4c374] hover:text-[#e4c374] font-mono text-xs transition-all outline-none"
                      aria-expanded={showHint}
                      title="Pedagogical Hint"
                    >
                      ?
                    </button>
                    <div className="text-left">
                      <p className="text-xs text-[#c9a24b]/60 italic font-light">
                        {showHint ? QUESTIONS[current].hint : "Hint: Click '?' to consider the timeline and group context."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end w-full sm:w-auto">
                    <button 
                      onClick={goBack}
                      disabled={current === 0}
                      className="px-6 py-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[#f4efe6]/50 hover:text-[#f4efe6] disabled:opacity-20 transition-all outline-none"
                    >
                      Prev Task
                    </button>
                    {QUESTIONS[current].type === "short" && !showFeedback ? (
                      <button
                        onClick={submitShortAnswer}
                        disabled={currentShortAnswer.trim() === ""}
                        className={`px-8 py-3.5 text-[11px] font-mono uppercase tracking-[0.2em] ${getButtonPrimary()}`}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={goNext}
                        disabled={answers[current] === null}
                        className={`px-8 py-3.5 text-[11px] font-mono uppercase tracking-[0.2em] ${getButtonPrimary()}`}
                      >
                        {current === QUESTIONS.length - 1 ? "Finish Summary" : "Proceed"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="summary-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full rounded-none p-4 sm:p-6 lg:p-8 border transition-all duration-300 backdrop-blur-md flex flex-col max-h-full overflow-hidden ${getCardBg()}`}
                id="summary-card"
              >
                <div className="text-center pb-4 border-b border-[#c9a24b]/20 mb-4 shrink-0">
                  <Award className="w-10 h-10 mx-auto text-[#e4c374] mb-2" />
                  <h1 className="text-2xl sm:text-3xl font-light text-[#e4c374] mb-1 font-serif">
                    Diagnostic Complete
                  </h1>
                  <p className="font-mono text-[10px] text-[#c9a24b]/70 max-w-md mx-auto uppercase tracking-wider">
                    Your performance profile has been analyzed against Techbridge University College teamwork metrics.
                  </p>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar space-y-4 mb-4">
                  {/* Scorecard Display */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-around bg-[#6e1423]/10 p-4 sm:p-6 rounded-none border border-[#c9a24b]/20">
                    <div className="text-center">
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a24b] mb-1">
                        Multiple Choice Accuracy
                      </div>
                      <div className="text-3xl sm:text-4xl font-mono font-bold text-[#e4c374]" id="score-display">
                        {score} <span className="text-lg text-[#f4efe6]/30">/ {scoredQuestionsCount}</span>
                      </div>
                    </div>

                    <div className="hidden sm:block h-12 w-px bg-[#c9a24b]/20" />

                    <div className="text-center max-w-xs">
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a24b] mb-1">
                        Accountability Evaluation
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-[#f4efe6]/80 leading-relaxed italic">
                        {score >= 5
                          ? "Advanced Alignment: High understanding of peer delegation structures and evidence-based progress reporting."
                          : score >= 3
                          ? "Developmental Alignment: Shows awareness of risks but may require tighter accountability safeguards."
                          : "Immediate Support Required: Struggles to distinguish passive alignment from active mitigation."}
                      </p>
                    </div>
                  </div>

                  {/* Detail Answer Review */}
                  <div>
                    <h3 className="text-base sm:text-lg font-serif text-[#e4c374] mb-3 flex items-center gap-2 font-light">
                      <BookOpen className="w-4 h-4 text-[#c9a24b]" />
                      Detailed Case Review
                    </h3>

                    <div className="space-y-3">
                      {QUESTIONS.map((q, idx) => {
                        const userAnswer = answers[idx];
                        const isCorrect = q.type === "mc" ? userAnswer === q.correct : true;

                        return (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-none border text-xs sm:text-sm font-sans ${
                              q.type === "mc" 
                                ? isCorrect 
                                  ? "border-emerald-500/25 bg-emerald-950/10 text-emerald-100" 
                                  : "border-rose-500/25 bg-rose-950/10 text-rose-100"
                                : "border-[#c9a24b]/20 bg-[#6e1423]/5 text-[#f4efe6]"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="font-mono text-[9px] text-[#c9a24b] uppercase tracking-widest">
                                Question {idx + 1} ({q.type.toUpperCase()})
                              </span>
                              {q.type === "mc" ? (
                                isCorrect ? (
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-mono">
                                    <CheckCircle2 className="w-3 h-3" /> Correct
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1 font-mono">
                                    <XCircle className="w-3 h-3" /> Incorrect
                                  </span>
                                )
                              ) : (
                                <span className="text-[10px] text-[#c9a24b]/80 font-bold flex items-center gap-1 font-mono">
                                  Submitted
                                </span>
                              )}
                            </div>

                            <p className="text-[#f4efe6] font-serif text-sm sm:text-base leading-relaxed mb-3">
                              {q.text}
                            </p>

                            <div className="space-y-1 text-[11px] font-mono">
                              <div>
                                <span className="text-[#c9a24b]/60">Your Response: </span>
                                <span className="text-[#f4efe6]">
                                  {q.type === "mc" 
                                    ? userAnswer !== null 
                                      ? q.options?.[userAnswer as number] 
                                      : "No response"
                                    : (userAnswer as string) || "No response"}
                                </span>
                              </div>
                              {q.type === "mc" && !isCorrect && (
                                <div>
                                  <span className="text-[#c9a24b]/60">Correct Answer: </span>
                                  <span className="text-emerald-400 font-medium">
                                    {q.options?.[q.correct as number]}
                                  </span>
                                </div>
                              )}
                              <div className="mt-2 pt-2 border-t border-[#c9a24b]/10">
                                <span className="text-[#c9a24b]/60 block mb-1 font-mono uppercase text-[8px] tracking-wider">Pedagogical Core:</span>
                                <span className="italic text-gray-300 block bg-black/30 p-2 rounded-none font-serif text-xs sm:text-sm">
                                  "{q.rationale}"
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Restart Actions */}
                <div className="flex justify-center border-t border-[#c9a24b]/10 pt-4 mt-4 shrink-0">
                  <button
                    onClick={handleRestart}
                    className={`flex items-center gap-2 px-8 py-3 bg-[#c9a24b] text-[#1a080a] font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#c9a24b]/20 active:translate-y-px hover:bg-[#e4c374] transition-all`}
                    id="restart-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart Diagnostic</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Metadata Bar */}
      <footer className="relative z-10 bg-black/40 px-4 sm:px-12 py-3 border-t border-[#c9a24b]/5 flex flex-col sm:flex-row justify-between w-full mt-3 gap-3 shrink-0">
        <div className="flex flex-wrap gap-6 sm:gap-12 font-mono text-[9px] uppercase tracking-[0.3em] text-[#c9a24b]/40">
          <span>Session ID: TUC-2026-9X</span>
          <span>Environment: Secure Diagnostic</span>
          <span>Candidate: Academic Participation</span>
        </div>
        <div className="flex justify-between sm:justify-end gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#c9a24b]/40">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-50 animation-pulse"></div> 
            Server Sync Active
          </span>
          <span>&copy; 2026 TUC ICT</span>
        </div>
      </footer>
    </div>
  );
}
