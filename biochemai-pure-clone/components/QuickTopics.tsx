import React from 'react';
import { ZapIcon, BeakerIcon, FlameIcon, DatabaseIcon } from './Icons';

interface QuickTopicsProps {
    onTopicSelect: (topic: string) => void;
}

const topics = [
    { label: 'Enzyme Kinetics', prompt: 'Explain Enzyme Kinetics', icon: ZapIcon },
    { label: 'Protein Structure', prompt: 'Explain Protein Structure', icon: BeakerIcon },
    { label: 'Metabolic Pathways', prompt: 'Explain Metabolic Pathways', icon: FlameIcon },
    { label: 'DNA Replication', prompt: 'Explain DNA Replication', icon: DatabaseIcon },
];

export const QuickTopics: React.FC<QuickTopicsProps> = ({ onTopicSelect }) => (
    <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">Popular Topics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topics.map((topic) => {
                const IconComponent = topic.icon;
                return (
                    <button
                        key={topic.label}
                        onClick={() => onTopicSelect(topic.prompt)}
                        className="p-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-focus)] transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(100,255,218,0.1)] group flex flex-col items-center gap-2 text-center"
                    >
                        <div className="p-2 rounded-lg bg-[var(--color-bg-secondary)] group-hover:bg-[var(--color-bg-tertiary)] transition-colors duration-200">
                            <IconComponent className="w-5 h-5 text-[var(--color-text-accent)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-text-accent)] transition-colors duration-200">
                            {topic.label}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);