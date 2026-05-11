import { FORM_SECTIONS, MAX_TOTAL_SCORE } from '@/constants';
import { motion } from 'motion/react';

interface SummaryProps {
  scores: Record<string, Record<string, number>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export default function Summary({ scores, onSubmit, isSubmitting, message }: SummaryProps) {
  const currentTotal = Object.values(scores).reduce(
    (acc, section) => acc + Object.values(section).reduce((s, v) => s + (Number(v) || 0), 0),
    0
  );

  const progress = Math.min((currentTotal / MAX_TOTAL_SCORE) * 100, 100);
  
  // Calculate Grade
  const percentage = (currentTotal / MAX_TOTAL_SCORE) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-bg-elevated border border-border-subtle sticky top-32"
    >
      {/* Notification Message */}
      {message && (
        <div
          className={`p-3 font-mono text-xs font-bold uppercase tracking-wider text-center ${
            message.type === 'success' 
              ? 'bg-green-900/90 text-green-400 border-b border-green-500' 
              : 'bg-red-900/90 text-red-400 border-b border-accent-red'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-accent-red py-2 px-4">
        <h2 className="font-label text-white text-sm tracking-[3px] uppercase font-bold">
          THE VERDICT
        </h2>
      </div>

      <div className="p-6">
        {/* Score Display */}
        <div className="flex items-baseline gap-4 mb-8">
          <span className="font-display font-black text-8xl text-white leading-none">
            {currentTotal}
          </span>
          <div className="flex flex-col">
            <span className="font-display font-black text-6xl text-accent-red leading-none">
              {grade}
            </span>
            <span className="font-label text-text-muted text-xs tracking-widest uppercase mt-1">
              / {MAX_TOTAL_SCORE} POINTS
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-label text-text-label tracking-widest mb-2">
            <span>PROGRESS</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800">
            <div
              className="h-full bg-accent-red transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-3 mb-8 border-t border-border-subtle pt-6">
          {FORM_SECTIONS.map((section) => {
            const sectionScore = Object.values(scores[section.id] || {}).reduce((a, b) => a + b, 0);
            const sectionMax = section.criteria.reduce((a, b) => a + b.maxScore, 0);
            
            return (
              <div key={section.id} className="flex justify-between items-end">
                <span className="font-label text-[10px] tracking-[2px] text-text-muted uppercase">
                  {section.title}
                </span>
                <span className="font-mono text-sm text-accent-red font-bold">
                  {sectionScore} <span className="text-gray-600 font-normal">/ {sectionMax}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 px-4 font-label text-[10px] tracking-[2px] uppercase transition-all rounded-none
            ${isSubmitting 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-accent-red text-white hover:bg-red-700 active:scale-95'
            }`}
        >
          {isSubmitting ? 'PROCESSING...' : 'SUBMIT VERDICT'}
        </button>
      </div>
    </motion.div>
  );
}
