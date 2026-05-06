import React from 'react';

export const HeroStats: React.FC = () => (
    <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-[var(--color-text-accent)]">10,000+</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Questions Answered</div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-[var(--color-text-accent)]">98%</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Accuracy Rate</div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-[var(--color-text-accent)]">24/7</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Always Available</div>
                </div>
            </div>
        </div>
    </div>
);