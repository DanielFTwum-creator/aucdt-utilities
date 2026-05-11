import React from 'react';
import { TECH_CONCEPTS } from '../constants';

const ConceptsTab: React.FC = () => {
    return (
        <section className="space-y-4 animate-fade-in">
            <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Technical Concepts</h2>
            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                This section provides simple explanations for the technical terms and acronyms discussed during the meeting.
            </p>
            
            <div className="space-y-3">
                {TECH_CONCEPTS.map((concept, index) => (
                    <details key={index} className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
                        <summary className="p-4 font-medium text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-background)] flex justify-between items-center">
                            <span>{concept.title}</span>
                            <span className="details-arrow text-[var(--color-text-muted)]"></span>
                        </summary>
                        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{concept.description}</p>
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
};

export default ConceptsTab;