import React from 'react';

interface QuickTopicsProps {
    onTopicSelect: (topic: string) => void;
}

const topics = [
    { label: 'Enzyme Kinetics', prompt: 'Explain Enzyme Kinetics' },
    { label: 'Protein Structure', prompt: 'Explain Protein Structure' },
    { label: 'Metabolic Pathways', prompt: 'Explain Metabolic Pathways' },
    { label: 'DNA Replication', prompt: 'Explain DNA Replication' },
    { label: 'Drug: Prozac', prompt: 'Tell me about the drug Prozac (Fluoxetine)' },
];

export const QuickTopics: React.FC<QuickTopicsProps> = ({ onTopicSelect }) => (
    <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
                <button
                    key={topic.label}
                    onClick={() => onTopicSelect(topic.prompt)}
                    className="bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] px-4 py-2 rounded-full text-sm transition-all duration-200 hover:border-[var(--color-border-focus)] hover:shadow-md transform hover:scale-105"
                >
                    {topic.label}
                </button>
            ))}
        </div>
    </div>
);