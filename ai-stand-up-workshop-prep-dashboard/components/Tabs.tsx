import React from 'react';
import { Tab, TabId } from '../types';

interface TabsProps {
    tabs: Tab[];
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <nav role="tablist" aria-label="Main content" className="flex border-b border-[var(--color-border)] mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    aria-controls={`panel-${tab.id}`}
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[var(--color-text-muted)] border-b-2 border-transparent hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${activeTab === tab.id ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold' : ''}`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;