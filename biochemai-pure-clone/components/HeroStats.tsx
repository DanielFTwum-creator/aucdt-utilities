import React from 'react';
import { TrendingUpIcon, CheckCircleIcon, ClockIcon } from './Icons';

export const HeroStats: React.FC = () => (
    <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="group p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.1)]">
                    <div className="flex justify-center mb-3">
                        <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)]">
                            <TrendingUpIcon className="w-5 h-5 text-[var(--color-text-accent)]" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text-accent)] mb-1">10,000+</div>
                    <div className="text-xs font-medium text-[var(--color-text-secondary)]">Questions Answered</div>
                </div>

                <div className="group p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.1)]">
                    <div className="flex justify-center mb-3">
                        <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)]">
                            <CheckCircleIcon className="w-5 h-5 text-[var(--color-text-accent)]" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text-accent)] mb-1">98%</div>
                    <div className="text-xs font-medium text-[var(--color-text-secondary)]">Accuracy Rate</div>
                </div>

                <div className="group p-4 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.1)]">
                    <div className="flex justify-center mb-3">
                        <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)]">
                            <ClockIcon className="w-5 h-5 text-[var(--color-text-accent)]" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text-accent)] mb-1">24/7</div>
                    <div className="text-xs font-medium text-[var(--color-text-secondary)]">Always Available</div>
                </div>
            </div>
        </div>
    </div>
);