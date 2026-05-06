import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratedListProps {
  prompts: string[];
}

export function GeneratedList({ prompts }: GeneratedListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-muted p-8 text-center font-mono">
        <div className="text-4xl mb-4 opacity-20">⎙</div>
        <p className="text-sm uppercase tracking-widest">No prompts generated yet</p>
        <p className="text-xs mt-2 opacity-50">Enter a base prompt and select modifiers.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-4 pb-4">
        <AnimatePresence>
          {prompts.map((prompt, index) => (
            <motion.div
              key={`${prompt}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group relative bg-bg-card border-l-4 border-transparent hover:border-accent-red p-4 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-sm text-bg-primary leading-relaxed break-words flex-1">
                  {prompt}
                </p>
                <button
                  onClick={() => handleCopy(prompt, index)}
                  className={`
                    flex-shrink-0 p-2 transition-colors duration-200 uppercase text-[10px] font-label tracking-widest border border-transparent
                    ${
                      copiedIndex === index
                        ? 'text-accent-red border-accent-red'
                        : 'text-text-muted hover:text-bg-primary hover:border-bg-primary'
                    }
                  `}
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-text-muted opacity-30">
                SC. {String(index + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
