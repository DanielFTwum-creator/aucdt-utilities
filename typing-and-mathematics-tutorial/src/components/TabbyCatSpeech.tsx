import { motion } from 'motion/react';
import { getCompanion } from '../utils/companion';

interface TabbyCatSpeechProps {
  text: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'cheering' | 'helpful';
  isTypingCorrect?: boolean;
  companionEmoji?: string;
}

export default function TabbyCatSpeech({
  text,
  mood = 'helpful',
  isTypingCorrect = true,
  companionEmoji = '🐱',
}: TabbyCatSpeechProps) {

  const companion = getCompanion(companionEmoji);

  // Map mood to cute expressions and color states
  const getExpressionEmoji = () => {
    switch (mood) {
      case 'happy':
        return companionEmoji === '🐱' ? '😸' : companionEmoji;
      case 'excited':
        return companionEmoji === '🐱' ? '😻' : companionEmoji;
      case 'thinking':
        return companionEmoji === '🐱' ? '😼' : companionEmoji;
      case 'cheering':
        return companionEmoji === '🐱' ? '😺' : companionEmoji;
      case 'helpful':
      default:
        return companionEmoji;
    }
  };

  const activeEmoji = getExpressionEmoji();

  return (
    <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl max-w-2xl w-full self-center">
      {/* Animated Companion Avatar */}
      <motion.div
        className="relative flex-shrink-0"
        animate={{
          y: isTypingCorrect ? [0, -4, 0] : [0, 2, -2, 0],
          scale: isTypingCorrect ? [1, 1.05, 1] : [1, 0.95, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: isTypingCorrect ? 2.5 : 0.4,
        }}
      >
        <div className={`w-14 h-14 bg-gradient-to-tr ${companion.themeColor} rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10 select-none`}>
          {activeEmoji}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-[9px] font-bold text-slate-950 px-1.5 py-0.5 rounded-full border border-teal-300 uppercase">
          COACH
        </div>
      </motion.div>

      {/* Speech bubble */}
      <div className="relative flex-1 bg-slate-850 p-3.5 rounded-2xl border border-slate-700/60 shadow-md">
        {/* Tail */}
        <div className="absolute top-5 -left-2 w-3.5 h-3.5 bg-slate-850 border-l border-b border-slate-700/60 rotate-45" />

        <div className="text-slate-200 text-sm font-sans leading-relaxed">
          <span className="font-bold text-teal-400 mr-1 select-none">{companion.name}:</span>
          "{text}"
        </div>
      </div>
    </div>
  );
}
