import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      handleTabChange(nextTab.id);
      setTimeout(() => {
        const nextButton = document.getElementById(`tab-${nextTab.id}`);
        nextButton?.focus();
      }, 0);
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div
        className={`
          flex items-center gap-1 flex-wrap
          ${
            variant === 'default'
              ? 'border-b border-slate-200 dark:border-slate-800'
              : 'bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit'
          }
        `}
        role="tablist"
        onKeyDown={handleKeyDown}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 font-medium text-sm
              transition-all rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              dark:focus:ring-offset-slate-900
              ${
                variant === 'default'
                  ? activeTab === tab.id
                    ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  : activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            {tab.icon && <span className="inline-flex flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      {activeTabData && (
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="mt-6 animate-fade-in"
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
}
