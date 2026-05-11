import React from 'react';
import DonutChart from './DonutChart';

const OverviewTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Meeting Overview</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                    This section summarizes the key discussion points and blockers identified during the stand-up meeting. The team covered technical hurdles in development and deployment, as well as a detailed plan for an upcoming AI presentation aimed at faculty.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-[var(--color-primary-dark)] mb-1">Main Topic: AI Workshop</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Daniel is preparing a crucial presentation for Monday at 8:00 AM to demonstrate the practical use of AI in digital media, targeting skeptical faculty members.</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-red-500 mb-1">Jerry's Blocker: Single Device</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Jerry's progress is slowed as he must use the same tablet for both taking student attendance and uploading results, creating a critical bottleneck.</p>
                    </div>
                    <div className="bg-[var(--color-surface)] p-5 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h3 className="font-medium text-[1.5rem] text-red-500 mb-1">Mandela's Blocker: `pnpm`</h3>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">Mandela is facing package compatibility issues between `pnpm` and older packages in the Angular UI project, preventing successful SQA deployment.</p>
                    </div>
                </div>
            </section>
            
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Daniel's AI App Generation (Last 3 Months)</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                    To illustrate his experience ahead of the workshop, Daniel mentioned the volume of AI applications he has generated. This chart visualizes the breakdown between the free Gemini model and the more advanced Gemini 2.5 Pro.
                </p>
                <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                    <DonutChart />
                </div>
            </section>
        </div>
    );
};

export default OverviewTab;