import React from 'react';
import { TrendingUpIcon, CheckCircleIcon, ClockIcon } from './Icons';

export const HeroStats: React.FC = () => (
  <aside
    className="flex flex-col gap-4 w-[180px] flex-shrink-0 pt-1"
    aria-label="Platform statistics"
  >
    {[
      { Icon: TrendingUpIcon, value: '10,000+', label: 'Questions Answered' },
      { Icon: CheckCircleIcon, value: '98%',     label: 'Accuracy Rate'      },
      { Icon: ClockIcon,       value: '24/7',    label: 'Always Available'   },
    ].map(({ Icon, value, label }) => (
      <div
        key={label}
        className="group p-4 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.08)] flex flex-col items-center text-center"
      >
        <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] mb-3">
          <Icon className="w-5 h-5 text-[var(--color-text-accent)]" />
        </div>
        <div className="text-xl font-bold text-[var(--color-text-accent)] mb-0.5">{value}</div>
        <div className="text-[10px] font-medium text-[var(--color-text-secondary)] leading-tight">{label}</div>
      </div>
    ))}
  </aside>
);
