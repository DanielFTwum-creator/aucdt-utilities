import React from 'react';
import { motion } from 'motion/react';

interface ModifierGroupProps {
  title: string;
  options: string[];
  selected: Set<string>;
  onToggle: (option: string) => void;
}

export function ModifierGroup({ title, options, selected, onToggle }: ModifierGroupProps) {
  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-label font-bold text-text-label uppercase tracking-[3px] mb-4 border-b border-border-card pb-1">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.has(option);
          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(option)}
              className={`
                group relative flex items-center gap-3 px-4 py-2 text-xs font-label font-medium uppercase tracking-widest transition-all duration-150
                border border-transparent
                ${
                  isSelected
                    ? 'bg-bg-primary text-text-primary border-bg-primary'
                    : 'bg-transparent border-border-card text-text-muted hover:border-accent-red hover:text-accent-red'
                }
              `}
            >
              <span className={`
                w-3 h-3 border transition-colors flex items-center justify-center
                ${isSelected ? 'bg-accent-red border-accent-red' : 'border-border-card group-hover:border-accent-red'}
              `}>
                 {isSelected && <span className="block w-1.5 h-1.5 bg-white" />}
              </span>
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
