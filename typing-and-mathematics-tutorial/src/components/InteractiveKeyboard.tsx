import { useState, useEffect } from 'react';

interface InteractiveKeyboardProps {
  targetChar: string; // The character the child currently needs to type
  lastTypedChar?: string; // The last character typed (for instant key flashes)
  isError?: boolean; // If they just typed an incorrect key
}

export default function InteractiveKeyboard({
  targetChar,
  lastTypedChar,
  isError = false,
}: InteractiveKeyboardProps) {
  const [activeKey, setActiveKey] = useState<string>('');

  // Rows configuration
  const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const row2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  const row4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', '/', '*'];

  // Map target character to key code names or specific keys
  const getNormalizeChar = (char: string): string => {
    if (!char) return '';
    const c = char.toLowerCase();
    if (c === '·' || c === ' ') return 'space';
    if (c === '+') return '='; // Needs Shift + =
    if (c === '*') return '*'; // Back slash or shift+8
    return c;
  };

  const normTarget = getNormalizeChar(targetChar);

  // Determine if typing the target requires holding Shift
  const needsShift = ['+', '*', '=', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(targetChar);

  // Simple fingers map
  // Left: Pinky(A,1,Q,Z), Ring(S,2,W,X), Middle(D,3,E,C), Index(F,G,4,5,R,T,V,B)
  // Right: Index(H,J,6,7,Y,U,N,M), Middle(K,8,I), Ring(L,9,O), Pinky(;,0,P), Space(Thumbs)
  const getFingerForChar = (char: string): { hand: 'Left' | 'Right'; finger: string; color: string } => {
    const norm = getNormalizeChar(char);
    if (norm === 'space') return { hand: 'Right', finger: 'Thumb', color: 'bg-teal-400' };

    const leftPinky = ['1', 'q', 'a', 'z', 'q'];
    const leftRing = ['2', 'w', 's', 'x'];
    const leftMiddle = ['3', 'e', 'd', 'c'];
    const leftIndex = ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'];

    const rightIndex = ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'];
    const rightMiddle = ['8', 'i', 'k'];
    const rightRing = ['9', 'o', 'l'];
    const rightPinky = ['0', '-', '=', 'p', ';', '/'];

    if (leftPinky.includes(norm)) return { hand: 'Left', finger: 'Pinky Finger', color: 'bg-pink-400/80' };
    if (leftRing.includes(norm)) return { hand: 'Left', finger: 'Ring Finger', color: 'bg-orange-400/80' };
    if (leftMiddle.includes(norm)) return { hand: 'Left', finger: 'Middle Finger', color: 'bg-yellow-400/80' };
    if (leftIndex.includes(norm)) return { hand: 'Left', finger: 'Pointer Finger', color: 'bg-emerald-400/80' };

    if (rightIndex.includes(norm)) return { hand: 'Right', finger: 'Pointer Finger', color: 'bg-indigo-400/80' };
    if (rightMiddle.includes(norm)) return { hand: 'Right', finger: 'Middle Finger', color: 'bg-violet-400/80' };
    if (rightRing.includes(norm)) return { hand: 'Right', finger: 'Ring Finger', color: 'bg-fuchsia-400/80' };
    if (rightPinky.includes(norm)) return { hand: 'Right', finger: 'Pinky Finger', color: 'bg-blue-400/80' };

    return { hand: 'Left', finger: 'Index', color: 'bg-slate-400' };
  };

  const fingerGuide = targetChar ? getFingerForChar(targetChar) : null;

  const renderKey = (key: string) => {
    const isTarget = normTarget === key;
    const isLastTyped = lastTypedChar?.toLowerCase() === key;

    let keyStyle = 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700';

    if (isTarget) {
      keyStyle = 'bg-emerald-500 text-white border-emerald-400 font-bold shadow-lg shadow-emerald-500/30 scale-105 animate-pulse';
    } else if (isLastTyped) {
      keyStyle = isError
        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
        : 'bg-sky-500 text-white border-sky-400 scale-102';
    }

    // Specially highlight helper keys
    const displayLabel = key === ';' ? ';' : key.toUpperCase();

    return (
      <div
        key={key}
        className={`h-11 w-11 flex flex-col items-center justify-center rounded-lg border text-sm transition-all duration-100 uppercase select-none ${keyStyle}`}
      >
        <span>{displayLabel}</span>
        {key === '=' && <span className="text-[10px] text-slate-400">+</span>}
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 p-5 rounded-3xl border border-slate-800 shadow-inner flex flex-col items-center gap-4">
      {/* Target Key and Hands Helper */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 h-10 px-4 rounded-xl flex items-center justify-center border border-slate-700">
            <span className="text-slate-400 text-xs font-mono mr-2">Target Key:</span>
            <span className="font-bold text-lg text-emerald-400 px-2 bg-emerald-950/50 rounded border border-emerald-800/40">
              {targetChar === ' ' ? 'SPACE' : targetChar || 'NONE'}
            </span>
          </div>
          {needsShift && (
            <div className="bg-amber-950/40 text-amber-400 border border-amber-800/50 px-3 py-1.5 rounded-xl text-xs font-bold animate-bounce">
              ⚠️ HOLD SHIFT
            </div>
          )}
        </div>

        {fingerGuide && (
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs">
            <span className="text-slate-400">Finger Tip:</span>
            <span className={`w-3 h-3 rounded-full ${fingerGuide.color}`} />
            <span className="font-semibold text-white">
              {fingerGuide.hand} {fingerGuide.finger}
            </span>
          </div>
        )}
      </div>

      {/* On-screen Keyboard Rows */}
      <div className="flex flex-col gap-1.5 items-center w-full max-w-xl">
        {/* Row 1 */}
        <div className="flex gap-1 justify-center w-full">
          {row1.map((key) => renderKey(key))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-1 justify-center w-full pl-4">
          {row2.map((key) => renderKey(key))}
        </div>

        {/* Row 3 */}
        <div className="flex gap-1 justify-center w-full pl-6">
          {/* Shift Key and Home Indicators */}
          {row3.map((key) => renderKey(key))}
        </div>

        {/* Row 4 */}
        <div className="flex gap-1 justify-center w-full pl-8">
          {row4.map((key) => renderKey(key))}
        </div>

        {/* Row 5 - Thumbs / Space Bar */}
        <div className="flex gap-2 justify-center w-full mt-1.5">
          <div
            className={`h-11 px-3 flex items-center justify-center rounded-lg border text-xs text-slate-400 bg-slate-800 border-slate-700 select-none ${needsShift ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : ''}`}
          >
            SHIFT
          </div>
          <div
            className={`h-11 w-52 flex items-center justify-center rounded-lg border text-xs font-mono tracking-widest select-none transition-all duration-100 ${
              normTarget === 'space'
                ? 'bg-emerald-500 border-emerald-400 text-white font-bold animate-pulse scale-102 shadow-lg shadow-emerald-500/30'
                : lastTypedChar === ' '
                ? 'bg-sky-500 border-sky-400 text-white'
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
            }`}
          >
            SPACE BAR
          </div>
          <div className="h-11 px-3 flex items-center justify-center rounded-lg border text-xs text-slate-400 bg-slate-800 border-slate-700 select-none">
            ENTER
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center select-none font-mono">
        💡 Align indexes with bumps on <strong className="text-slate-400">F</strong> and <strong className="text-slate-400">J</strong> keys
      </div>
    </div>
  );
}
