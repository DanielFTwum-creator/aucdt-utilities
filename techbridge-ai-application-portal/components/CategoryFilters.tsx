import React from 'react';
import { Category } from '../types';

interface CategoryFiltersProps {
  categories: Category[];
  activeCategory: Category | 'All Apps';
  setActiveCategory: (category: Category | 'All Apps') => void;
  categoryCounts: { [key in Category | 'All Apps']: number };
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, activeCategory, setActiveCategory, categoryCounts }) => {
  const allCategories = ['All Apps' as const, ...categories];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3" role="group" aria-label="Filter by category">
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-4 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 ease-in-out
              flex items-center space-x-2 min-h-[44px] min-w-[44px] justify-center
              focus:outline-none focus:ring-3 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
              ${isActive
                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                : 'bg-[var(--color-card-bg)] text-[var(--color-text)] hover:bg-[var(--color-card-border)] hover:shadow-md border border-[var(--color-card-border)]'
              }
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${category}`}
          >
            <span>{category}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[var(--color-card-border)]'}`}>
              {categoryCounts[category]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;