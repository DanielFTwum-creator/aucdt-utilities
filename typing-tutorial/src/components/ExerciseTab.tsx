import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Lesson, UserProgress, Difficulty } from "../types";
import { normaliseTypedInput } from "../inputNormalisation";
import { ArrowLeft, Play, RefreshCw, Volume2, VolumeX, Keyboard, Settings } from "lucide-react";

// US-QWERTY shift pairs: maps a shifted character to the physical key that
// produces it, so the tactile highlight and finger guidance can point at a real
// key instead of falling back silently (TUC-ICT-FIX-2026-VTX-PUNCT).
const SHIFTED_TO_BASE: Record<string, string> = {
  "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8",
  "(": "9", ")": "0", "_": "-", "+": "=",
  "{": "[", "}": "]", "|": "\\",
  ":": ";", '"': "'",
  "<": ",", ">": ".", "?": "/",
};

// Per-finger colour-coding shared between the hand diagram and the keyboard's
// active-key highlight, so each finger always maps to the same colour everywhere.
// "Active": full-strength colour + glow. "Idle": same colour at low opacity.
export const FINGER_ACCENTS: Record<string, { handActive: string; handIdle: string; label: string; text: string; key: string; keySpace?: string }> = {
  Pinky: {
    handActive: "fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.85)]",
    handIdle: "fill-amber-500/30",
    label: "fill-amber-600 dark:fill-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    key: "bg-amber-400 border-amber-600 text-slate-950 scale-110 shadow-lg ring-4 ring-amber-300/70 animate-pulse dark:border-amber-200 dark:ring-amber-300/50 dark:shadow-[0_0_30px_rgba(245,158,11,0.7)]",
  },
  Ring: {
    handActive: "fill-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.85)]",
    handIdle: "fill-emerald-500/30",
    label: "fill-emerald-600 dark:fill-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    key: "bg-emerald-400 border-emerald-600 text-slate-950 scale-110 shadow-lg ring-4 ring-emerald-300/70 animate-pulse dark:border-emerald-200 dark:ring-emerald-300/50 dark:shadow-[0_0_30px_rgba(16,185,129,0.7)]",
  },
  Middle: {
    handActive: "fill-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.85)]",
    handIdle: "fill-violet-500/30",
    label: "fill-violet-600 dark:fill-violet-400",
    text: "text-violet-600 dark:text-violet-400",
    key: "bg-violet-400 border-violet-600 text-slate-950 scale-110 shadow-lg ring-4 ring-violet-300/70 animate-pulse dark:border-violet-200 dark:ring-violet-300/50 dark:shadow-[0_0_30px_rgba(139,92,246,0.7)]",
  },
  Index: {
    handActive: "fill-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.85)]",
    handIdle: "fill-blue-500/30",
    label: "fill-blue-600 dark:fill-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    key: "bg-blue-400 border-blue-600 text-slate-950 scale-110 shadow-lg ring-4 ring-blue-300/70 animate-pulse dark:border-blue-200 dark:ring-blue-300/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.7)]",
  },
  Thumbs: {
    handActive: "fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]",
    handIdle: "fill-cyan-400/30",
    label: "fill-cyan-600 dark:fill-cyan-400",
    text: "text-cyan-600 dark:text-cyan-400",
    key: "bg-cyan-400 border-cyan-600 text-slate-950 scale-110 shadow-lg ring-4 ring-cyan-300/70 animate-pulse dark:border-cyan-200 dark:ring-cyan-300/50 dark:shadow-[0_0_30px_rgba(34,211,238,0.7)]",
    keySpace: "bg-cyan-400 border-cyan-600 text-slate-950 scale-105 shadow-lg ring-4 ring-cyan-300/70 animate-pulse dark:border-cyan-200 dark:ring-cyan-300/50 dark:shadow-[0_0_30px_rgba(34,211,238,0.7)]",
  },
};

// Results-screen letter grade thresholds: S=100%acc+40wpm, A=95%+30, B=85%+20, C=pass, F=<70%
function getGrade(accuracy: number, wpm: number): "S" | "A" | "B" | "C" | "F" {
  if (accuracy >= 100 && wpm >= 40) return "S";
  if (accuracy >= 95 && wpm >= 30) return "A";
  if (accuracy >= 85 && wpm >= 20) return "B";
  if (accuracy >= 70) return "C";
  return "F";
}

const GRADE_STYLES: Record<string, string> = {
  S: "bg-amber-400/10 border-amber-400 text-amber-500 dark:text-amber-300",
  A: "bg-emerald-400/10 border-emerald-400 text-emerald-500 dark:text-emerald-300",
  B: "bg-blue-400/10 border-blue-400 text-blue-500 dark:text-blue-300",
  C: "bg-violet-400/10 border-violet-400 text-violet-500 dark:text-violet-300",
  F: "bg-rose-400/10 border-rose-400 text-rose-500 dark:text-rose-300",
};

// R1/R3 Hand diagram: realistic palm + finger illustration showing which finger
// to use for the next target character, in resting position over the home row.
function HandDiagram({ activeHand, activeFinger, isIdle }: { activeHand: string; activeFinger: string; isIdle: boolean }) {
  const isSpace = activeHand === "Hands";

  const leftFingers = [
    { name: "Pinky", key: "A", x: 28, w: 28, h: 58, lean: -5 },
    { name: "Ring", key: "S", x: 70, w: 31, h: 76, lean: -3 },
    { name: "Middle", key: "D", x: 116, w: 33, h: 94, lean: 0 },
    { name: "Index", key: "F", x: 164, w: 31, h: 80, lean: 4 },
  ];
  const rightFingers = [
    { name: "Index", key: "J", x: 405, w: 31, h: 80, lean: -4 },
    { name: "Middle", key: "K", x: 451, w: 33, h: 94, lean: 0 },
    { name: "Ring", key: "L", x: 499, w: 31, h: 76, lean: 3 },
    { name: "Pinky", key: ";", x: 543, w: 28, h: 58, lean: 5 },
  ];

  // When idle/resting: all 8 home-row fingers glow at full strength (Mavis Beacon
  // passive posture reinforcement — hands always shown at home row, no dimming).
  // During active typing: only the target finger is active; the rest go to idle opacity.
  const fingerClass = (hand: "Left" | "Right", name: string) => {
    if (isIdle) return FINGER_ACCENTS[name].handActive;
    if (!isSpace && activeHand.startsWith(hand) && activeFinger === name) return FINGER_ACCENTS[name].handActive;
    return FINGER_ACCENTS[name].handIdle;
  };

  // Mavis Beacon lift: active finger displaces upward to show it's reaching for a key.
  // Resting and space bar use no lift — all fingers stay at home row.
  const liftY = (hand: "Left" | "Right", name: string): number => {
    if (isIdle || isSpace) return 0;
    return activeHand.startsWith(hand) && activeFinger === name ? -26 : 0;
  };

  const thumbClass = isSpace ? FINGER_ACCENTS.Thumbs.handActive : FINGER_ACCENTS.Thumbs.handIdle;
  const skinClass = "fill-[#9a6134] dark:fill-[#8a542b]";
  const skinShadowClass = "fill-[#72401f] dark:fill-[#5f351b]";
  const nailClass = "fill-[#f2c7a1] dark:fill-[#c58a62]";
  const creaseClass = "stroke-[#5f351b]/50 dark:stroke-[#3b2315]/70";
  const palmTop = 128;

  const fingerPath = (x: number, y: number, w: number, h: number, lean: number) => {
    const tipY = y + 8;
    const baseY = y + h + 26;
    const leftBase = x - 1;
    const rightBase = x + w + 1;
    const leftTip = x + 4 + lean;
    const rightTip = x + w - 4 + lean;
    const mid = x + w / 2 + lean;
    return [
      `M ${leftBase} ${baseY}`,
      `C ${leftBase - 2} ${baseY - 22}, ${leftTip - 3} ${tipY + 28}, ${leftTip} ${tipY}`,
      `C ${leftTip + 2} ${y - 3}, ${rightTip - 2} ${y - 3}, ${rightTip} ${tipY}`,
      `C ${rightTip + 3} ${tipY + 30}, ${rightBase + 2} ${baseY - 22}, ${rightBase} ${baseY}`,
      `C ${rightBase - 10} ${baseY + 6}, ${leftBase + 10} ${baseY + 6}, ${leftBase} ${baseY}`,
      "Z",
      `M ${mid - w * 0.23} ${y + h * 0.42} C ${mid - 4} ${y + h * 0.48}, ${mid + 4} ${y + h * 0.48}, ${mid + w * 0.23} ${y + h * 0.42}`,
      `M ${mid - w * 0.2} ${y + h * 0.7} C ${mid - 3} ${y + h * 0.75}, ${mid + 3} ${y + h * 0.75}, ${mid + w * 0.2} ${y + h * 0.7}`,
    ].join(" ");
  };

  return (
    <svg viewBox="0 0 600 230" className="w-full max-w-md mx-auto lg:max-w-none" aria-hidden="true">
      {/* Left hand fingers — lift active finger upward to show it reaching for a key */}
      {leftFingers.map((f) => {
        const lift = liftY("Left", f.name);
        const y = palmTop - f.h;
        const d = fingerPath(f.x, y, f.w, f.h, f.lean);
        const isActive = isIdle || (activeHand.startsWith("Left") && activeFinger === f.name);
        return (
          <g key={f.name} style={{ transform: `translateY(${lift}px)`, transition: "transform 130ms ease" }}>
            <path d={d} className={`${skinClass} transition-all duration-100`} />
            <path d={d} className={`${fingerClass("Left", f.name)} transition-all duration-100`} opacity={isActive ? 0.82 : 0.18} />
            <path d={d} className={`${creaseClass} fill-transparent`} strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx={f.x + f.w / 2 + f.lean} cy={y + 14} rx={f.w * 0.27} ry="5.2" className={nailClass} opacity="0.86" />
          </g>
        );
      })}
      {/* Left palm */}
      <path d="M12,142 C18,122 33,116 62,120 C93,124 117,121 142,119 C178,116 212,120 236,130 C249,141 251,188 238,214 C199,222 63,222 22,214 C12,192 7,164 12,142 Z"
        className={`transition-all duration-100 ${skinClass}`} />
      <path d="M22,169 C62,152 107,153 145,159 M45,202 C92,211 172,211 222,201"
        className={`${creaseClass} fill-transparent`} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14,197 C64,222 188,222 240,199 C237,207 235,214 231,219 H30 C23,214 18,207 14,197 Z"
        className={skinShadowClass} opacity="0.42" />
      {/* Left thumb */}
      <path d="M198,166 C219,158 253,166 270,186 C275,194 269,203 258,202 C231,201 205,192 192,180 C188,174 191,169 198,166 Z"
        className={`transition-all duration-100 ${skinClass}`} />
      <path d="M198,166 C219,158 253,166 270,186 C275,194 269,203 258,202 C231,201 205,192 192,180 C188,174 191,169 198,166 Z"
        className={`transition-all duration-100 ${thumbClass}`} opacity={isSpace ? 0.85 : 0.18} />
      <ellipse cx="255" cy="188" rx="8" ry="5" transform="rotate(20 255 188)" className={nailClass} opacity="0.86" />

      {/* Right hand fingers */}
      {rightFingers.map((f) => {
        const lift = liftY("Right", f.name);
        const y = palmTop - f.h;
        const d = fingerPath(f.x, y, f.w, f.h, f.lean);
        const isActive = isIdle || (activeHand.startsWith("Right") && activeFinger === f.name);
        return (
          <g key={f.name} style={{ transform: `translateY(${lift}px)`, transition: "transform 130ms ease" }}>
            <path d={d} className={`${skinClass} transition-all duration-100`} />
            <path d={d} className={`${fingerClass("Right", f.name)} transition-all duration-100`} opacity={isActive ? 0.82 : 0.18} />
            <path d={d} className={`${creaseClass} fill-transparent`} strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx={f.x + f.w / 2 + f.lean} cy={y + 14} rx={f.w * 0.27} ry="5.2" className={nailClass} opacity="0.86" />
          </g>
        );
      })}
      {/* Right palm */}
      <path d="M348,130 C372,120 407,116 443,119 C468,121 493,124 524,120 C553,116 568,122 588,142 C593,164 588,192 578,214 C537,222 401,222 362,214 C349,188 351,141 348,130 Z"
        className={`transition-all duration-100 ${skinClass}`} />
      <path d="M378,159 C416,153 461,152 502,169 M368,201 C418,211 498,211 545,202"
        className={`${creaseClass} fill-transparent`} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M360,199 C412,222 536,222 586,197 C582,207 577,214 570,219 H369 C365,214 362,207 360,199 Z"
        className={skinShadowClass} opacity="0.42" />
      {/* Right thumb */}
      <path d="M402,166 C381,158 347,166 330,186 C325,194 331,203 342,202 C369,201 395,192 408,180 C412,174 409,169 402,166 Z"
        className={`transition-all duration-100 ${skinClass}`} />
      <path d="M402,166 C381,158 347,166 330,186 C325,194 331,203 342,202 C369,201 395,192 408,180 C412,174 409,169 402,166 Z"
        className={`transition-all duration-100 ${thumbClass}`} opacity={isSpace ? 0.85 : 0.18} />
      <ellipse cx="345" cy="188" rx="8" ry="5" transform="rotate(-20 345 188)" className={nailClass} opacity="0.86" />

      {/* Spacebar */}
      <rect x="220" y="207" width="160" height="14" rx="7"
        className={`transition-all duration-100 ${isSpace ? FINGER_ACCENTS.Thumbs.handActive : "fill-slate-300 dark:fill-slate-700"}`} />

      {/* Home-row key labels — travel with the finger they sit on */}
      {[
        ...leftFingers.map((f) => ({ ...f, hand: "Left" as const })),
        ...rightFingers.map((f) => ({ ...f, hand: "Right" as const })),
      ].map((f) => {
        const isActiveLabel = !isSpace && activeHand.startsWith(f.hand) && activeFinger === f.name;
        const lift = liftY(f.hand, f.name);
        return (
          <text key={`${f.name}-lbl`} x={f.x + f.w / 2 + f.lean} y={palmTop - f.h + 17} textAnchor="middle"
            className={`text-[11px] font-mono font-bold uppercase ${isActiveLabel ? "fill-slate-950" : FINGER_ACCENTS[f.name].label}`}
            style={{ transform: `translateY(${lift}px)`, transition: "transform 130ms ease" }}>
            {f.key}
          </text>
        );
      })}
    </svg>
  );
}


// R1 · R2 · R3 — Unified keyboard-with-hands SVG.
// West African child hands (semi-transparent skin #9a6134 at 0.52 opacity) overlaid
// on the QWERTY keyboard so the key labels show through the fingernails.
// Delivers: R1 resting glow on all home-row fingers when idle, R2 transparent
// hand overlay, R3 active-finger lift (-22px, 130ms ease).
function KeyboardWithHands({ activeHand, activeFinger, isIdle, nextTargetChar }: {
  activeHand: string;
  activeFinger: string;
  isIdle: boolean;
  nextTargetChar?: string;
}) {
  const PITCH = 50, KW = 46, KH = 40, KR = 6;
  const ROW_X = [27, 52, 77, 102];
  const ROW_Y = [14, 58, 102, 146];
  const PALM_TOP = 220;

  const NUM_KEYS  = ["1","2","3","4","5","6","7","8","9","0","-","="];
  const TOP_KEYS  = ["q","w","e","r","t","y","u","i","o","p","[","]","\\"];
  const HOME_KEYS = ["a","s","d","f","g","h","j","k","l",";","'"];
  const BOT_KEYS  = ["z","x","c","v","b","n","m",",",".","/"];

  const KEY_FINGER: Record<string, { hand: "L" | "R"; finger: string }> = {
    "1":{hand:"L",finger:"Pinky"},"q":{hand:"L",finger:"Pinky"},"a":{hand:"L",finger:"Pinky"},"z":{hand:"L",finger:"Pinky"},
    "2":{hand:"L",finger:"Ring" },"w":{hand:"L",finger:"Ring" },"s":{hand:"L",finger:"Ring" },"x":{hand:"L",finger:"Ring" },
    "3":{hand:"L",finger:"Middle"},"e":{hand:"L",finger:"Middle"},"d":{hand:"L",finger:"Middle"},"c":{hand:"L",finger:"Middle"},
    "4":{hand:"L",finger:"Index"},"r":{hand:"L",finger:"Index"},"f":{hand:"L",finger:"Index"},"v":{hand:"L",finger:"Index"},
    "5":{hand:"L",finger:"Index"},"t":{hand:"L",finger:"Index"},"g":{hand:"L",finger:"Index"},"b":{hand:"L",finger:"Index"},
    "6":{hand:"R",finger:"Index"},"y":{hand:"R",finger:"Index"},"h":{hand:"R",finger:"Index"},"n":{hand:"R",finger:"Index"},
    "7":{hand:"R",finger:"Index"},"u":{hand:"R",finger:"Index"},"j":{hand:"R",finger:"Index"},"m":{hand:"R",finger:"Index"},
    "8":{hand:"R",finger:"Middle"},"i":{hand:"R",finger:"Middle"},"k":{hand:"R",finger:"Middle"},",":{hand:"R",finger:"Middle"},
    "9":{hand:"R",finger:"Ring"  },"o":{hand:"R",finger:"Ring"  },"l":{hand:"R",finger:"Ring"  },".":{hand:"R",finger:"Ring"  },
    "0":{hand:"R",finger:"Pinky" },"p":{hand:"R",finger:"Pinky" },";":{hand:"R",finger:"Pinky" },"/":{hand:"R",finger:"Pinky" },
    "-":{hand:"R",finger:"Pinky" },"=":{hand:"R",finger:"Pinky"},
    "[":{hand:"R",finger:"Pinky" },"]":{hand:"R",finger:"Pinky"},"\\":{hand:"R",finger:"Pinky"},
    "'":{hand:"R",finger:"Pinky" },
  };

  const FINGER_HEX: Record<string,string> = {
    Pinky:"#f59e0b", Ring:"#10b981", Middle:"#8b5cf6", Index:"#3b82f6", Thumbs:"#22d3ee",
  };

  const nailFill = "#d9b48c";
  const nailHi = "#efe3d2";
  const creaseSt = "rgba(74,41,19,0.55)";
  const tendonSt = "#4a2913";
  const knuckleHi = "#c08a55";
  const isSpace = activeHand === "Hands";
  // Shifted characters highlight the physical key that produces them.
  const rawTarget = (nextTargetChar ?? "").toLowerCase();
  const target = SHIFTED_TO_BASE[rawTarget] ?? rawTarget;

  const liftY = (side: "L" | "R", name: string): number => {
    if (isIdle || isSpace) return 0;
    const prefix = side === "L" ? "Left" : "Right";
    return activeHand.startsWith(prefix) && activeFinger === name ? -22 : 0;
  };

  const fingerPath = (x: number, y: number, w: number, h: number, lean: number): string => {
    const tipY = y + 6, baseY = y + h + 30;
    const lb = x - 1, rb = x + w + 1;
    const lt = x + 5 + lean, rt = x + w - 5 + lean;
    return [
      `M ${lb} ${baseY}`,
      `C ${lb-2} ${baseY-26},${lt-4} ${tipY+30},${lt} ${tipY}`,
      `C ${lt+2} ${y-4},${rt-2} ${y-4},${rt} ${tipY}`,
      `C ${rt+4} ${tipY+32},${rb+2} ${baseY-26},${rb} ${baseY}`,
      `C ${rb-11} ${baseY+7},${lb+11} ${baseY+7},${lb} ${baseY} Z`,
    ].join(" ");
  };
  const fingerCreases = (x: number, y: number, w: number, h: number, lean: number): string => {
    const mid = x + w / 2 + lean;
    return `M ${mid-w*0.24} ${y+h*0.40} C ${mid-4} ${y+h*0.46},${mid+4} ${y+h*0.46},${mid+w*0.24} ${y+h*0.40}`
         + ` M ${mid-w*0.2} ${y+h*0.68} C ${mid-3} ${y+h*0.73},${mid+3} ${y+h*0.73},${mid+w*0.2} ${y+h*0.68}`;
  };

  const LEFT_F = [
    { name:"Pinky", x: 96, w:23, h: 84, lean:-4 },
    { name:"Ring",  x:140, w:26, h: 98, lean:-2 },
    { name:"Middle",x:186, w:28, h:108, lean: 0 },
    { name:"Index", x:233, w:26, h: 96, lean: 3 },
  ];
  const RIGHT_F = [
    { name:"Index", x:427, w:26, h: 96, lean:-3 },
    { name:"Middle",x:472, w:28, h:108, lean: 0 },
    { name:"Ring",  x:520, w:26, h: 98, lean: 2 },
    { name:"Pinky", x:567, w:23, h: 84, lean: 4 },
  ];

  const renderKeys = (keys: string[], rowIdx: number) =>
    keys.map((k, ki) => {
      const kx = ROW_X[rowIdx] + ki * PITCH;
      const ky = ROW_Y[rowIdx];
      const owner = KEY_FINGER[k];
      const hex = owner ? FINGER_HEX[owner.finger] : "#6b7280";
      const isActive = target === k;
      const isBump = k === "f" || k === "j";
      return (
        <g key={k}>
          <rect x={kx} y={ky} width={KW} height={KH} rx={KR}
            fill={isActive ? hex : "#1a1f2e"} />
          {!isActive && (
            <rect x={kx} y={ky} width={KW} height={KH} rx={KR}
              fill={hex} fillOpacity={0.13} />
          )}
          {isActive && (
            <rect x={kx-1.5} y={ky-1.5} width={KW+3} height={KH+3} rx={KR+1}
              fill="none" stroke={hex} strokeWidth={2.5} strokeOpacity={0.9} />
          )}
          <text x={kx+KW/2} y={ky+KH/2+5} textAnchor="middle"
            fontFamily="monospace" fontSize={13} fontWeight="bold"
            fill="white" fillOpacity={isActive ? 0.95 : 0.72}>{k.toUpperCase()}</text>
          {isBump && (
            <rect x={kx+KW/2-5} y={ky+KH-6} width={10} height={3} rx={2}
              fill="rgba(255,255,255,0.55)" />
          )}
        </g>
      );
    });

  const renderFingers = (fingers: typeof LEFT_F, side: "L" | "R") =>
    fingers.map((f) => {
      const lift = liftY(side, f.name);
      const y = PALM_TOP - f.h;
      const d = fingerPath(f.x, y, f.w, f.h, f.lean);
      const cx = f.x + f.w / 2 + f.lean;
      const accent = FINGER_HEX[f.name];
      const active = isIdle || (() => {
        const px = side === "L" ? "Left" : "Right";
        return !isSpace && activeHand.startsWith(px) && activeFinger === f.name;
      })();
      return (
        <g key={`${side}-${f.name}`}
          style={{ transform: `translateY(${lift}px)`, transition: "transform 130ms ease" }}>
          {active && (
            <g filter="url(#kbGlow)"><path d={d} fill={accent} opacity={0.8} /></g>
          )}
          <path d={d} fill="url(#kbSkinCyl)" />
          <path d={fingerCreases(f.x, y, f.w, f.h, f.lean)} fill="none"
            stroke={creaseSt} strokeWidth={1.1} strokeLinecap="round" />
          {active && (
            <path d={d} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.45} />
          )}
          <ellipse cx={cx} cy={y+15} rx={f.w*0.30} ry={8} fill={nailFill} />
          <ellipse cx={cx} cy={y+12} rx={f.w*0.22} ry={3.4} fill={nailHi} opacity={0.75} />
        </g>
      );
    });

  const sx = 195, sy = 192, sw = 208, sh = 34;
  const isSpaceActive = target === " ";

  return (
    <div style={{ animation: "kbHandEntry 580ms ease-out both" }}>
      <style>{`@keyframes kbHandEntry{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <svg viewBox="0 0 686 328" className="w-full max-w-5xl mx-auto" aria-hidden="true">

        <defs>
          {/* cylindrical skin shading across each finger/thumb width */}
          <linearGradient id="kbSkinCyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5e3417" />
            <stop offset="0.22" stopColor="#8a5528" />
            <stop offset="0.5" stopColor="#b8834f" />
            <stop offset="0.78" stopColor="#8a5528" />
            <stop offset="1" stopColor="#4f2c14" />
          </linearGradient>
          {/* back-of-hand shading, lighter at knuckles, darker at wrist */}
          <linearGradient id="kbSkinPalm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a86c3a" />
            <stop offset="0.55" stopColor="#875126" />
            <stop offset="1" stopColor="#552f16" />
          </linearGradient>
          {/* active-finger accent glow */}
          <filter id="kbGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Keyboard backdrop */}
        <rect x="6" y="6" width="674" height="238" rx="14" fill="#0f1420" fillOpacity="0.97" />

        {/* Key rows */}
        {renderKeys(NUM_KEYS,  0)}
        {renderKeys(TOP_KEYS,  1)}
        {renderKeys(HOME_KEYS, 2)}
        {renderKeys(BOT_KEYS,  3)}

        {/* Spacebar */}
        <rect x={sx} y={sy} width={sw} height={sh} rx={KR}
          fill={isSpaceActive ? "#22d3ee" : "#1a1f2e"} />
        {!isSpaceActive && (
          <rect x={sx} y={sy} width={sw} height={sh} rx={KR}
            fill="#22d3ee" fillOpacity={0.13} />
        )}
        {isSpaceActive && (
          <rect x={sx-1.5} y={sy-1.5} width={sw+3} height={sh+3} rx={KR+1}
            fill="none" stroke="#22d3ee" strokeWidth={2.5} strokeOpacity={0.9} />
        )}
        <text x={sx+sw/2} y={sy+sh/2+4} textAnchor="middle"
          fontFamily="monospace" fontSize={10} fontWeight="bold"
          fill="white" fillOpacity={0.72}>SPACE</text>

        {/* ── Hand overlay ── */}

        {/* Left hand: back-of-hand widest at knuckles, tapering to a narrow rounded wrist */}
        <path d="M 144 306 C 122 299, 100 276, 94 247 C 91 231, 98 218, 112 215 C 130 211, 140 215, 154 214 C 173 213, 187 212, 203 212 C 223 211, 245 211, 261 216 C 273 220, 277 231, 274 247 C 269 276, 250 300, 227 306 C 205 311, 166 311, 144 306 Z"
          fill="url(#kbSkinPalm)" />
        {/* tendons: fingers continue into the back of the hand */}
        <path d="M 108 216 C 110 236, 112 252, 118 266 M 152 214 C 154 238, 156 258, 160 272 M 200 213 C 200 240, 200 262, 200 276 M 248 216 C 246 238, 242 258, 236 272"
          fill="none" stroke={tendonSt} strokeWidth={7} strokeLinecap="round" strokeOpacity={0.28} />
        <path d="M 122 250 C 154 241, 208 241, 252 252"
          fill="none" stroke={knuckleHi} strokeWidth={6} strokeLinecap="round" strokeOpacity={0.35} />
        <path d="M 144 293 C 174 305, 210 305, 232 292 C 228 299, 223 303, 217 306 L 158 306 C 152 303, 147 299, 144 293 Z"
          fill={tendonSt} fillOpacity={0.4} />
        {/* Left thumb: resting up toward the spacebar */}
        {isSpace && (
          <g filter="url(#kbGlow)"><path d="M 264 256 C 258 236, 242 220, 226 216 C 216 214, 209 222, 213 232 C 218 245, 240 255, 256 261 C 262 263, 266 262, 264 256 Z"
            fill="#22d3ee" opacity={0.8} /></g>
        )}
        <path d="M 264 256 C 258 236, 242 220, 226 216 C 216 214, 209 222, 213 232 C 218 245, 240 255, 256 261 C 262 263, 266 262, 264 256 Z"
          fill="url(#kbSkinCyl)" />
        <path d="M 264 256 C 258 236, 242 220, 226 216 C 216 214, 209 222, 213 232 C 218 245, 240 255, 256 261 C 262 263, 266 262, 264 256 Z"
          fill="none" stroke={creaseSt} strokeWidth={1.1} strokeLinecap="round" opacity={0.5} />
        {isSpace && (
          <path d="M 264 256 C 258 236, 242 220, 226 216 C 216 214, 209 222, 213 232 C 218 245, 240 255, 256 261 C 262 263, 266 262, 264 256 Z"
            fill="none" stroke="#22d3ee" strokeWidth={1.6} opacity={0.45} />
        )}
        <ellipse cx="224" cy="220" rx="8" ry="5" transform="rotate(-34 224 220)" fill={nailFill} />
        {/* Left fingers */}
        {renderFingers(LEFT_F, "L")}

        {/* Right hand: mirror of the left about x=343 */}
        <path d="M 542 306 C 564 299, 586 276, 592 247 C 595 231, 588 218, 574 215 C 556 211, 546 215, 532 214 C 513 213, 499 212, 483 212 C 463 211, 441 211, 425 216 C 413 220, 409 231, 412 247 C 417 276, 436 300, 459 306 C 481 311, 520 311, 542 306 Z"
          fill="url(#kbSkinPalm)" />
        <path d="M 578 216 C 576 236, 574 252, 568 266 M 534 214 C 532 238, 530 258, 526 272 M 486 213 C 486 240, 486 262, 486 276 M 438 216 C 440 238, 444 258, 450 272"
          fill="none" stroke={tendonSt} strokeWidth={7} strokeLinecap="round" strokeOpacity={0.28} />
        <path d="M 564 250 C 532 241, 478 241, 434 252"
          fill="none" stroke={knuckleHi} strokeWidth={6} strokeLinecap="round" strokeOpacity={0.35} />
        <path d="M 542 293 C 512 305, 476 305, 454 292 C 458 299, 463 303, 469 306 L 528 306 C 534 303, 539 299, 542 293 Z"
          fill={tendonSt} fillOpacity={0.4} />
        {/* Right thumb: resting up toward the spacebar */}
        {isSpace && (
          <g filter="url(#kbGlow)"><path d="M 422 256 C 428 236, 444 220, 460 216 C 470 214, 477 222, 473 232 C 468 245, 446 255, 430 261 C 424 263, 420 262, 422 256 Z"
            fill="#22d3ee" opacity={0.8} /></g>
        )}
        <path d="M 422 256 C 428 236, 444 220, 460 216 C 470 214, 477 222, 473 232 C 468 245, 446 255, 430 261 C 424 263, 420 262, 422 256 Z"
          fill="url(#kbSkinCyl)" />
        <path d="M 422 256 C 428 236, 444 220, 460 216 C 470 214, 477 222, 473 232 C 468 245, 446 255, 430 261 C 424 263, 420 262, 422 256 Z"
          fill="none" stroke={creaseSt} strokeWidth={1.1} strokeLinecap="round" opacity={0.5} />
        {isSpace && (
          <path d="M 422 256 C 428 236, 444 220, 460 216 C 470 214, 477 222, 473 232 C 468 245, 446 255, 430 261 C 424 263, 420 262, 422 256 Z"
            fill="none" stroke="#22d3ee" strokeWidth={1.6} opacity={0.45} />
        )}
        <ellipse cx="462" cy="220" rx="8" ry="5" transform="rotate(34 462 220)" fill={nailFill} />
        {/* Right fingers */}
        {renderFingers(RIGHT_F, "R")}

      </svg>
    </div>
  );
}

// Numeric keypad layout (Right Hand only): 3 columns x 4 rows, mirroring the
// standard touch-typing numpad fingering with 5 as the home-row anchor for the
// Middle finger, 4/6 for Index/Ring either side, and the bottom row stretching
// to Middle (0), Ring (.), and Pinky (-).
const NUMPAD_ROWS: { key: string; finger: string }[][] = [
  [{ key: "7", finger: "Index" }, { key: "8", finger: "Middle" }, { key: "9", finger: "Ring" }],
  [{ key: "4", finger: "Index" }, { key: "5", finger: "Middle" }, { key: "6", finger: "Ring" }],
  [{ key: "1", finger: "Index" }, { key: "2", finger: "Middle" }, { key: "3", finger: "Ring" }],
  [{ key: "0", finger: "Middle" }, { key: ".", finger: "Ring" }, { key: "-", finger: "Pinky" }],
];

const NUMPAD_ANCHORS: Record<string, string> = { Index: "4", Middle: "5", Ring: "6", Pinky: "-" };

// R3 numpad reach calculator (Right Hand only) — numpad counterpart to getFingerGuidance.
// Characters with no numpad key (e.g. spaces between groups in a drill) return null.
function getNumpadFingerGuidance(char: string | undefined) {
  if (!char) return null;
  for (const row of NUMPAD_ROWS) {
    const cell = row.find((c) => c.key === char);
    if (cell) {
      const anchor = NUMPAD_ANCHORS[cell.finger];
      return {
        hand: "Right Hand",
        finger: cell.finger,
        anchor,
        path: char === anchor
          ? `Anchor Right ${cell.finger} on ${anchor} tactile home key`
          : `Anchor Right ${cell.finger} on ${anchor} and reach to ${char}`,
      };
    }
  }
  return null;
}

// R1/R3 Numpad guide: numeric keypad grid plus a translucent "ghost hand" overlay
// that highlights which finger reaches for the active key, using the same
// FINGER_ACCENTS colour tokens as the QWERTY hand diagram.
function NumpadGuide({ activeKey }: { activeKey?: string }) {
  const guidance = getNumpadFingerGuidance(activeKey);

  return (
    <div className="relative mx-auto w-fit pt-10">
      {/* Ghost hand overlay */}
      <div className="absolute inset-x-0 top-0 flex items-end justify-center gap-1.5 px-2 pointer-events-none">
        <svg viewBox="0 0 168 64" className="w-40 sm:w-48 opacity-80">
          {["Index", "Middle", "Ring", "Pinky"].map((finger, i) => {
            const active = guidance?.finger === finger;
            const accents = FINGER_ACCENTS[finger];
            return (
              <rect
                key={finger}
                x={6 + i * 41}
                y={active ? 4 : 22}
                width="32"
                height={active ? 60 : 38}
                rx="14"
                className={`transition-all duration-300 ${active ? accents.handActive : accents.handIdle}`}
              />
            );
          })}
        </svg>
      </div>

      {/* Numpad key grid */}
      <div className="relative grid grid-cols-3 gap-1.5 sm:gap-2 font-mono">
        {NUMPAD_ROWS.flat().map(({ key, finger }) => {
          const active = activeKey === key;
          return (
            <div
              key={key}
              className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg text-lg sm:text-xl font-bold border-2 transition-all ${
                active ? FINGER_ACCENTS[finger].key : "bg-white dark:bg-slate-900/40 border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-slate-400"
              }`}
            >
              {key}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ExerciseTabProps {
  lesson: Lesson;
  difficulty: Difficulty;
  progress: UserProgress;
  onFinish: (accuracy: number, wpm: number, points: number, sessionMaxCombo: number) => void;
  onBack: () => void;
}

export default function ExerciseTab({ lesson, difficulty, progress, onFinish, onBack }: ExerciseTabProps) {
  // The active drill pool for this lesson at the selected difficulty.
  // Pools are optional per lesson; missing pools fall back to the beginner set.
  const practicePool =
    (difficulty === "advanced" && lesson.practicesAdvanced?.length ? lesson.practicesAdvanced : undefined) ??
    (difficulty !== "beginner" && lesson.practicesIntermediate?.length ? lesson.practicesIntermediate : undefined) ??
    lesson.practices;

  const [currentPracticeIdx, setCurrentPracticeIdx] = useState(0);
  const [usedPracticeIndices, setUsedPracticeIndices] = useState<number[]>([]);
  const targetText = practicePool[currentPracticeIdx];

  const [inputVal, setInputVal] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [muteAudio, setMuteAudio] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // R5 Regenerate: results shown when the whole lesson's practice set is completed
  const [results, setResults] = useState<{ accuracy: number; wpm: number; points: number; time: number; combo: number } | null>(null);

  // Focus
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref mirror of usedPracticeIndices to avoid stale closures in the completion setTimeout
  const usedPracticeIndicesRef = useRef<number[]>([]);

  // TUC Academic 6R Methodology controls (R2: BPM & tone persisted across sessions)
  const [metronomeBpm, setMetronomeBpm] = useState<number>(() => {
    const cached = localStorage.getItem("tuc_metronome_bpm");
    return cached ? Number(cached) : 0;
  });
  const [metronomeTick, setMetronomeTick] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<"synth-tick" | "mechanical-clack" | "none">(() => {
    const cached = localStorage.getItem("tuc_audio_mode");
    return (cached as "synth-tick" | "mechanical-clack" | "none") || "none";
  });
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [sessionMaxCombo, setSessionMaxCombo] = useState<number>(0);
  const [wrongKeys, setWrongKeys] = useState<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // R6 Calibration Mode
  const [isCalibrationMode, setIsCalibrationMode] = useState<boolean>(false);
  const [calibrationText, setCalibrationText] = useState<string>("");

  // R3 relative reach calculator
  const getFingerGuidance = (char: string) => {
    if (!char) return null;
    const c = char.toLowerCase();
    if (c === " ") return { hand: "Hands", finger: "Thumbs", anchor: "Space", path: "Press Spacebar naturally centered between thumbs" };
    if ("qaz1".includes(c)) return { hand: "Left Hand", finger: "Pinky", anchor: "A", path: "Anchor Left Pinky on A" + (c !== "a" ? ` and transit up/down to strike ${c.toUpperCase()}` : " tactile home key") };
    if ("wsx2".includes(c)) return { hand: "Left Hand", finger: "Ring", anchor: "S", path: "Anchor Left Ring on S" + (c !== "s" ? ` and stretch up/down to stroke ${c.toUpperCase()}` : " tactile home key") };
    if ("edc3".includes(c)) return { hand: "Left Hand", finger: "Middle", anchor: "D", path: "Anchor Left Middle on D" + (c !== "d" ? ` and extend forward/backward to index ${c.toUpperCase()}` : " tactile home key") };
    if ("rfvtgb45".includes(c)) return { hand: "Left Hand", finger: "Index", anchor: "F", path: "Anchor Left Index on F" + (c !== "f" ? ` and reach forward/diagonal to reach ${c.toUpperCase()}` : " tactile anchor key with bump") };
    if ("yhnujm67".includes(c)) return { hand: "Right Hand", finger: "Index", anchor: "J", path: "Anchor Right Index on J" + (c !== "j" ? ` and reach diagonal/left to grasp ${c.toUpperCase()}` : " tactile anchor key with bump") };
    if ("ik,8".includes(c)) return { hand: "Right Hand", finger: "Middle", anchor: "K", path: "Anchor Right Middle on K" + (c !== "k" ? ` and reach upward to register ${c.toUpperCase()}` : " tactile home key") };
    if ("ol.9".includes(c)) return { hand: "Right Hand", finger: "Ring", anchor: "L", path: "Anchor Right Ring on L" + (c !== "l" ? ` and displace upward to strike ${c.toUpperCase()}` : " tactile home key") };
    if ("p;/0['\\]=".includes(c)) return { hand: "Right Hand", finger: "Pinky", anchor: ";", path: "Anchor Right Pinky on ;" + (c !== ";" ? ` and pitch outward to record ${c.toUpperCase()}` : " tactile home key") };
    if (c === "-" || c === "_") return { hand: "Right Hand", finger: "Pinky", anchor: ";", path: `Anchor Right Pinky on ; and reach up past 0 to strike -${c === "_" ? " while holding Shift for _" : ""}` };
    // Unmapped characters must fail loudly rather than masquerade as a mapped key.
    console.warn(`[VortexType] No finger guidance mapping for character: "${char}"`);
    return { hand: "Fingers", finger: "Finger", anchor: "Home", path: `Stroke ${char.toUpperCase()} returning swiftly to standard home row resting rows.` };
  };

  // Audio effects synthesizer generator (R4 Response Audio)
  // force=true bypasses audioMode check so error/success sounds always play unless muted
  const playFeedTone = (frequency: number, type: OscillatorType, duration: number, force = false) => {
    if ((audioMode === "none" && !force) || muteAudio) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio engine deactivated or suspended by browser agent
      audioCtxRef.current = null; // reset so we recreate next time
    }
  };

  const playSuccessChime = () => {
    playFeedTone(523.25, "sine", 0.15, true);
    setTimeout(() => playFeedTone(659.25, "sine", 0.15, true), 80);
  };

  const playErrorBuzz = () => {
    playFeedTone(130, "triangle", 0.22, true);
  };

  // R2: persist metronome BPM and audio tone selections
  useEffect(() => {
    localStorage.setItem("tuc_metronome_bpm", String(metronomeBpm));
  }, [metronomeBpm]);

  useEffect(() => {
    localStorage.setItem("tuc_audio_mode", audioMode);
  }, [audioMode]);

  // Active metronome synchronization thread (R2 Rhythm Metronome)
  useEffect(() => {
    let metronomeInterval: NodeJS.Timeout | null = null;
    if (metronomeBpm > 0 && isStarted) {
      const beatMs = 60000 / metronomeBpm;
      metronomeInterval = setInterval(() => {
        playFeedTone(1000, "sine", 0.012);
        setMetronomeTick(true);
        setTimeout(() => setMetronomeTick(false), 70);
      }, beatMs);
    }
    return () => {
      if (metronomeInterval) clearInterval(metronomeInterval);
    };
  }, [metronomeBpm, isStarted, audioMode, muteAudio]);

  const handleReset = () => {
    setInputVal("");
    setIsStarted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    setCombo(0);
    setWrongKeys([]);
    setIsCalibrationMode(false);
    setCalibrationText("");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    handleReset();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPracticeIdx, lesson]);

  // Keep focus on the typing input at all times.
  // Initial focus on mount:
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Global keydown rescue: if the user presses a key while focus has drifted
  // to somewhere else (nav, settings, keyboard guide, etc.), silently redirect
  // it back to the input so the drill never goes deaf.
  useEffect(() => {
    const rescue = (e: KeyboardEvent) => {
      if (!inputRef.current) return;
      if (inputVal.length >= (isCalibrationMode ? calibrationText : targetText).length) return; // drill finished
      const tag = (e.target as HTMLElement)?.tagName;
      // Don't steal focus from intentional form controls
      if (tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener("keydown", rescue, true);
    return () => document.removeEventListener("keydown", rescue, true);
  }, [inputVal.length, (isCalibrationMode ? calibrationText : targetText).length]);

  // Reset practice tracking when lesson changes
  useEffect(() => {
    setUsedPracticeIndices([]);
    usedPracticeIndicesRef.current = [];
    // Select a random practice to start with
    const randomIndex = Math.floor(Math.random() * practicePool.length);
    setCurrentPracticeIdx(randomIndex);
  }, [lesson]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Undo OS/browser smart punctuation (em-dash for "-", curly quotes) and
    // apply the lesson's key substitutions (e.g. 3 -> \u025b for Ghanaian
    // languages). Natively typed special characters pass through untouched.
    const value = normaliseTypedInput(e.target.value, lesson.inputMap);
    const currentText = isCalibrationMode ? calibrationText : targetText;
    
    // Lock length range
    if (value.length > currentText.length) return;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    // Play tactile mechanical / electronic clack feedback
    if (value.length > 0) {
      const latestCharTyped = value[value.length - 1];
      const targetChar = currentText[value.length - 1];
      if (latestCharTyped === targetChar) {
        if (audioMode === "synth-tick") {
          playFeedTone(800, "sine", 0.05);
        } else if (audioMode === "mechanical-clack") {
          playFeedTone(290, "triangle", 0.09);
        }
        setCombo((prev) => {
          const nextCombo = prev + 1;
          if (nextCombo > maxCombo) {
            setMaxCombo(nextCombo);
            setSessionMaxCombo((sm) => Math.max(sm, nextCombo));
          }
          return nextCombo;
        });
      } else {
        playErrorBuzz();
        setCombo(0);

        // Record invalid character mapping into calibration database logs
        const invalidChar = targetChar.toLowerCase();
        if (invalidChar !== " " && !wrongKeys.includes(invalidChar)) {
          setWrongKeys((prev) => [...prev, invalidChar]);
        }
      }
    }

    setInputVal(value);

    // Calculate Accuracy metrics
    let rightChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) rightChars++;
    }

    const currentAcc = value.length > 0 ? Math.round((rightChars / value.length) * 100) : 100;
    setAccuracy(currentAcc);

    const minutes = Math.max(0.1, elapsed / 60);
    const calculatedWpm = Math.round((value.length / 5) / minutes);
    setWpm(calculatedWpm);

    // Drill completion router logic
    if (value === currentText) {
      // If student is finishing regular exercise and accuracy < 90%, divert into R6 Calibration set
      if (!isCalibrationMode && wrongKeys.length > 0 && currentAcc < 90) {
        if (timerRef.current) clearInterval(timerRef.current);
        playFeedTone(440, "sine", 0.18);
        
        setTimeout(() => {
          setIsCalibrationMode(true);
          // Auto compile remedial drills repeating hard characters to sync muscles.
          // Cap to the 5 most recent wrong keys so the drill stays a short, focused fix-up
          // even when a long passage produced many distinct misses.
          const capKeys = wrongKeys.slice(-5);
          const repeats = capKeys.map(k => `${k}${k}${k}`).join(" ");
          const comboSet = capKeys.join("") + " " + capKeys.slice().reverse().join("");
          const remediationString = `${repeats} ${comboSet} ${capKeys.join("")}`;
          setCalibrationText(remediationString);
          setInputVal("");
          setIsStarted(false);
          setStartTime(null);
        }, 500);
      } else {
        // Safe clear run completed or remediation hurdle passed
        if (timerRef.current) clearInterval(timerRef.current);
        playSuccessChime();

        setTimeout(() => {
          // Streak bonus modifier
          const streakMultiplier = Math.min(250, maxCombo * 5);
          const pointsEarned = Math.round(currentAcc * 10 + calculatedWpm * 2) + streakMultiplier;
          const finalSessionMax = Math.max(sessionMaxCombo, maxCombo);

          // Mark current practice as used (read from ref to avoid stale closure
          // if a drill completes faster than this 600ms timeout)
          const newUsed = [...usedPracticeIndicesRef.current, currentPracticeIdx];
          usedPracticeIndicesRef.current = newUsed;
          setUsedPracticeIndices(newUsed);

          // Calculate available practice indices
          const allIndices = Array.from({ length: practicePool.length }, (_, i) => i);
          const availableIndices = allIndices.filter(i => !newUsed.includes(i));

          if (availableIndices.length === 0) {
            // All practices in this lesson completed — show results screen before returning to map
            setResults({ accuracy: currentAcc, wpm: calculatedWpm, points: pointsEarned, time: elapsed, combo: finalSessionMax });
            return;
          }

          const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

          setCurrentPracticeIdx(nextIndex);
          setWrongKeys([]);
          setCombo(0);
          setMaxCombo(0);
          setIsCalibrationMode(false);
          setCalibrationText("");
        }, 600);
      }
    }
  };

  // Trajectory mapping targets
  const currentSentence = isCalibrationMode ? calibrationText : targetText;
  const nextTargetChar = currentSentence[inputVal.length]?.toLowerCase();

  // Numpad lessons use the dedicated numeric-keypad finger guidance/diagram
  // instead of the QWERTY hand diagram and keyboard guide.
  const isNumpad = lesson.inputMode === "numpad";

  // For mapped lessons, hand/keyboard guidance points at the physical key that
  // produces the expected character ( ")" lives on the 0 key ).
  const guidanceChar = (() => {
    if (!nextTargetChar) return nextTargetChar;
    // Lesson input map first (e.g. Ghanaian characters back to their source key)...
    const source = lesson.inputMap
      ? Object.entries(lesson.inputMap).find(([, out]) => out === nextTargetChar)?.[0]
      : undefined;
    const char = source ?? nextTargetChar;
    // ...then shifted characters back to the physical key that produces them.
    return SHIFTED_TO_BASE[char] ?? char;
  })();
  const fingerGuidance = isNumpad ? getNumpadFingerGuidance(guidanceChar) : getFingerGuidance(guidanceChar || "");

  const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."]
  ];

  // Results screen: record progress and return to the lesson map
  const handleContinue = () => {
    if (!results) return;
    onFinish(results.accuracy, results.wpm, results.points, results.combo);
  };

  // Results screen: replay this lesson's practice set from the start
  const handleRetry = () => {
    setResults(null);
    setUsedPracticeIndices([]);
    usedPracticeIndicesRef.current = [];
    setWrongKeys([]);
    setCombo(0);
    setMaxCombo(0);
    setIsCalibrationMode(false);
    setCalibrationText("");
    const randomIndex = Math.floor(Math.random() * practicePool.length);
    setCurrentPracticeIdx(randomIndex);
    handleReset();
  };

  // Safety guard — prevents a white-screen crash if targetText is undefined
  // (e.g. a stale practice index during a React re-mount cycle). Without this,
  // currentSentence.split() throws and the whole tree unmounts.
  if (!currentSentence && !isCalibrationMode) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-400 font-mono text-sm">
        Loading exercise…
      </div>
    );
  }

  // R5 Regenerate: completion / results screen replaces the exercise once the lesson is finished
  if (results) {
    const grade = getGrade(results.accuracy, results.wpm);
    return (
      <div className="space-y-3">
        <div className="flex py-0.5">
          <button
            type="button"
            id="backToLessonsBtnResults"
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold cursor-pointer border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 min-h-[44px] rounded-lg bg-zinc-50 dark:bg-zinc-900 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Exit to Map</span>
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-10 text-center space-y-5 shadow-sm animate-fade-in">
          <div className="text-[10px] font-mono font-bold tracking-widest text-sky-600 dark:text-cyan-400 uppercase">
            Lesson complete
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight font-mono">
            {lesson.title}
          </h3>

          <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black border-4 ${GRADE_STYLES[grade]}`}>
            {grade}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
              <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">WPM</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">{results.wpm}</div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
              <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Accuracy</div>
              <div className="text-2xl font-bold text-sky-600 dark:text-cyan-400 mt-0.5 font-mono">{results.accuracy}%</div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
              <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Time</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">{results.time}s</div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-slate-400 font-mono">
            +{results.points} points · best streak {results.combo}x
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              id="retryLessonBtn"
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 px-4 py-2.5 min-h-[44px] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
            <button
              type="button"
              id="continueToMapBtn"
              onClick={handleContinue}
              className="inline-flex items-center space-x-2 px-4 py-2.5 min-h-[44px] bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 rounded-lg text-sm font-bold hover:bg-sky-700 dark:hover:bg-cyan-400 transition-all cursor-pointer shadow-sm"
            >
              <span>Next exercise</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">

      {/* Header and Control row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-0.5">
        <button
          type="button"
          id="backToLessonsBtn"
          onClick={onBack}
          className="inline-flex w-full sm:w-auto justify-center items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold cursor-pointer border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 min-h-[44px] rounded-lg bg-zinc-50 dark:bg-zinc-900 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Exit to Map</span>
        </button>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Audio volume toggler */}
          <button
            type="button"
            id="muteAudioBtn"
            onClick={() => setMuteAudio(!muteAudio)}
            className="p-2.5 min-h-[44px] border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer flex items-center justify-center"
            title={muteAudio ? "Unmute Audio" : "Mute Audio"}
          >
            {muteAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            type="button"
            id="restartExerciseBtn"
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-3 py-2 min-h-[44px] bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border dark:border-white/5"
          >
            <RefreshCw size={12} />
            <span>Restart Exercise</span>
          </button>
        </div>
      </div>

      {/* Live coaching strip — finger guidance, streak, and a settings popover for audio/metronome */}
      <div className="bg-slate-950 text-white rounded-2xl p-2.5 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.12)] relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,_rgba(6,182,212,0.08),transparent_40%)] pointer-events-none"></div>
        <div className="flex items-center justify-between gap-2 relative z-10 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {/* Live finger guidance — show target key in its finger colour, not prose */}
            <span className="text-slate-400">
              Next:{" "}
              {fingerGuidance && nextTargetChar ? (
                <span
                  className={`font-bold text-base tracking-widest uppercase ${FINGER_ACCENTS[fingerGuidance.finger]?.text ?? "text-cyan-400"}`}
                  title={fingerGuidance.path}
                >
                  {nextTargetChar === " " ? "⎵" : nextTargetChar}
                </span>
              ) : (
                <span className="font-bold text-cyan-400">—</span>
              )}
            </span>

            {/* Ghanaian character key map (mapped lessons only) */}
            {lesson.inputMap && (
              <span className="text-slate-400" id="ghanaianKeyMapHint">
                {Object.entries(lesson.inputMap).map(([key, out]) => (
                  <span key={key} className="mr-3">
                    <span className="font-bold text-amber-400">{out}</span>
                    {" = "}
                    <span className="font-bold text-cyan-300">{key === ")" ? "Shift+0" : key}</span>
                  </span>
                ))}
              </span>
            )}

            {/* Streak / combo */}
            <span className="text-slate-400">
              Streak: <span className={`font-bold ${combo >= 15 ? 'text-amber-400 animate-pulse' : combo >= 5 ? 'text-cyan-400' : combo > 0 ? 'text-cyan-300' : 'text-slate-300'}`}>{combo}</span>
              {(sessionMaxCombo > 0 || progress.bestCombo > 0) && (
                <span className="text-slate-500"> (best {Math.max(sessionMaxCombo, progress.bestCombo)})</span>
              )}
            </span>
          </div>

          {/* Settings popover toggle */}
          <div className="relative">
            <button
              type="button"
              id="exerciseSettingsToggle"
              onClick={() => setShowSettings((s) => !s)}
              className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center"
              title="Audio &amp; metronome settings"
            >
              <Settings size={14} />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl p-3 shadow-xl z-20 space-y-3">
                <div className="space-y-1">
                  <label htmlFor="metronomeBpmSelect" className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Metronome</label>
                  <select
                    id="metronomeBpmSelect"
                    value={metronomeBpm}
                    onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="0">Off</option>
                    <option value="40">40 BPM — Slow</option>
                    <option value="60">60 BPM — Steady</option>
                    <option value="80">80 BPM — Brisk</option>
                    <option value="100">100 BPM — Fast</option>
                    <option value="120">120 BPM — Sprint</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="audioModeSelect" className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Key sound</label>
                  <select
                    id="audioModeSelect"
                    value={audioMode}
                    onChange={(e) => setAudioMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="synth-tick">Synth tick</option>
                    <option value="mechanical-clack">Mechanical clack</option>
                    <option value="none">Silent</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise core dashboard */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2.5 sm:p-3 shadow-sm">

        {/* Lesson Badge + Title — consolidated into a single horizontal row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight font-mono">
            {lesson.title} {isCalibrationMode && "— fix-up drill"}
          </h3>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-sky-600 dark:text-cyan-400 uppercase">
            <span>{isCalibrationMode ? "Fix-up mode" : "Current Target Tiers"}</span>
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCalibrationMode ? 'bg-amber-500' : 'bg-cyan-400'}`}></span>
            <span>Set {currentPracticeIdx + 1} of {practicePool.length}</span>
          </div>
        </div>

        {/* Live Calibration Alert banner */}
        {isCalibrationMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl p-3 mb-2 mt-2 flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">
              ⚠️
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-black uppercase tracking-widest font-mono">
                Quick fix-up: drilling the keys you missed
              </h5>
              <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                You had trouble with:{' '}
                {wrongKeys.map((k, i) => (
                  <span key={i} className="inline-block font-mono bg-amber-500/20 dark:bg-amber-500/30 text-amber-500 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-black mr-1">{k === " " ? "space" : k}</span>
                ))}.
                Complete this short drill before moving on.
              </p>
            </div>
          </div>
        )}

        {/* Live Status indicator charts */}
        <div className="grid grid-cols-3 gap-1.5 my-1.5 text-center">
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Accuracy</div>
            <div className={`text-base font-bold mt-0.5 ${accuracy < 80 ? "text-rose-600 dark:text-rose-400" : "text-sky-600 dark:text-cyan-400"}`}>
              {accuracy}%
            </div>
          </div>
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">WPM Speed</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {wpm}
            </div>
          </div>
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Elapsed Time</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {elapsed}s
            </div>
          </div>
        </div>

        {/* Progress bar towards completion of practice set */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-slate-950/40 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-150 ${isCalibrationMode ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-sky-600 dark:bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}
            style={{ width: `${Math.round((inputVal.length / currentSentence.length) * 100)}%` }}
          ></div>
        </div>

        {/* Dynamic Highlight Text Box — clicking anywhere on it restores keyboard focus */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative border border-zinc-300 dark:border-white/5 bg-zinc-50 dark:bg-slate-950/40 p-3 sm:p-4 rounded-xl font-mono text-base sm:text-lg font-medium tracking-wide leading-relaxed text-center select-none block min-h-[56px] shadow-inner mb-2 cursor-text"
        >
          <div className="absolute top-2 left-3 text-[9px] font-mono text-zinc-400 dark:text-slate-500 tracking-widest uppercase font-bold">
            Type here {isCalibrationMode && "— fix-up drill"}
          </div>
          <div className="text-zinc-800 dark:text-zinc-200 break-words flex flex-wrap justify-center mt-2">
            {currentSentence.split("").map((char, index) => {
              const isCurrent = index === inputVal.length;
              let charStyle = "text-zinc-500 dark:text-slate-400"; // default unentered
              if (index < inputVal.length) {
                charStyle = inputVal[index] === char
                  ? "text-zinc-900 dark:text-zinc-300"
                  : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded font-bold underline decoration-wavy";
              }

              if (isCurrent) {
                return (
                  <span key={index} id={`exerciseChar-${index}`} className="relative text-zinc-950 dark:text-white mx-0.5 font-bold">
                    {char === " " ? "␣" : char}
                    <span className={`absolute bottom-[-2px] left-0 w-full h-[3px] shadow-[0_0_10px_#22d3ee] ${isCalibrationMode ? 'bg-amber-500' : 'bg-sky-500 dark:bg-cyan-400'}`}></span>
                  </span>
                );
              }

              return (
                <span key={index} className={`mx-0.5 inline-block ${charStyle}`}>
                  {char === " " ? "␣" : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Focused Native Input container */}
        <div className="mt-2 space-y-1.5">
          <input
            ref={inputRef}
            id="typingActiveInputElement"
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder={isStarted ? "" : "Click here and start practicing..."}
            className={`w-full text-center py-2.5 bg-zinc-50 dark:bg-slate-950/40 border-2 rounded-lg text-lg font-mono focus:outline-none focus:bg-white dark:focus:bg-[#050608] text-zinc-900 dark:text-white shadow-inner transition-all duration-200 ${metronomeTick && metronomeBpm > 0 ? 'border-cyan-400 dark:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]' : 'border-zinc-200 dark:border-white/5 focus:border-sky-500 dark:focus:border-cyan-500/40'}`}
            autoComplete="off"
            spellCheck="false"
            disabled={inputVal.length >= currentSentence.length}
          />
          {!isStarted && (
            <div className="text-center text-xs text-zinc-500 dark:text-slate-500 flex items-center justify-center space-x-1 uppercase tracking-wider font-mono animate-pulse">
              <Play size={10} fill="currentColor" />
              <span>Strike any key to begin countdown</span>
            </div>
          )}

          {/* R2: live metronome beat indicator, positioned at the typing field for visibility */}
          {metronomeBpm > 0 && (
            <div className="text-center flex items-center justify-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${metronomeTick ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]' : 'bg-zinc-300 dark:bg-slate-800'}`}></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500">
                {metronomeBpm} BPM Beat
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Visual Keyboard Guide */}
      <div className="bg-zinc-100 dark:bg-[#0a0d14]/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-2.5 sm:p-3 shadow-sm">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
          <Keyboard size={14} />
          <span>Tactile Guide: Strike the Highlighted Target Key</span>
        </div>

        {isNumpad ? (
          /* Numeric keypad guide: ghost-hand overlay + numpad grid (Right Hand only) */
          <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest text-center mb-1">
              🖩 Numeric Keypad — Right Hand Home Row (4 5 6)
            </div>
            <NumpadGuide activeKey={nextTargetChar} />
          </div>
        ) : (
          /* R1 · R2 · R3 — West African hands overlaid on keyboard */
          <KeyboardWithHands
            activeHand={fingerGuidance?.hand ?? ""}
            activeFinger={fingerGuidance?.finger ?? ""}
            isIdle={!isStarted}
            nextTargetChar={guidanceChar}
          />
        )}
      </div>

    </div>
  );
}
