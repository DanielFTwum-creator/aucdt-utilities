import React from 'react';
import { Icons } from './Icons';
import { PHASES } from '../constants';

interface SRSModalProps {
    isOpen: boolean;
    onClose: () => void;
    completedPhases: number[];
}

export const SRSModal: React.FC<SRSModalProps> = ({ isOpen, onClose, completedPhases }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-bg-tertiary/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                            <Icons.Copy className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-mono text-xl font-bold text-text-primary">SRS Document</h2>
                            <p className="text-xs text-text-muted uppercase tracking-wider">IEEE Std 830-1998 Format</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                        <Icons.Minimize className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 font-serif text-text-secondary leading-relaxed space-y-8">
                    
                    <div className="border-b border-border/50 pb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Software Requirements Specification</h1>
                        <p className="font-mono text-sm text-accent-primary">for Bulletproof Directive v1.0</p>
                    </div>

                    <section>
                        <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">1. Introduction</h3>
                        <div className="pl-4 border-l-2 border-border space-y-4">
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">1.1 Purpose</h4>
                                <p>The purpose of this document is to define the software requirements for the "Bulletproof Directive" system. This application serves as a universal quality assurance framework and directive generator for AI-generated applications.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">1.2 Scope</h4>
                                <p>The software is a single-page web application designed to guide developers through a rigorous 5-phase quality assurance lifecycle: Foundation, Security, Testing, Documentation, and Finalization. It facilitates process tracking and prompt engineering via directive generation.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">2. Overall Description</h3>
                        <div className="pl-4 border-l-2 border-border space-y-4">
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">2.1 Product Perspective</h4>
                                <p>This is a standalone client-side application utilizing React, TypeScript, and Tailwind CSS. It operates independently of backend services, ensuring offline availability and zero-latency state management.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-primary mb-1">2.2 User Characteristics</h4>
                                <p>The primary users are Software Engineers, AI Prompt Engineers, and QA Specialists requiring a standardized deployment checklist.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">3. System Features</h3>
                        <div className="space-y-6">
                            <div className="bg-bg-tertiary/30 p-4 rounded-xl border border-border/50">
                                <h4 className="font-mono font-bold text-accent-primary mb-2">3.1 Phase Management</h4>
                                <p className="mb-2">Users must be able to view details of 5 distinct development phases.</p>
                                <ul className="list-disc list-inside text-sm space-y-1 opacity-80">
                                    <li>Expand/Collapse phase details</li>
                                    <li>View specific tasks and deliverables per phase</li>
                                    <li>Visual distinction between active/inactive phases</li>
                                </ul>
                            </div>

                            {/* New Section 3.1.1 */}
                            <div className="bg-bg-tertiary/30 p-5 rounded-xl border border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-px bg-border/50 flex-1"></div>
                                    <h4 className="font-mono font-bold text-accent-primary text-sm uppercase tracking-widest">3.1.1 Task Details</h4>
                                    <div className="h-px bg-border/50 flex-1"></div>
                                </div>
                                <p className="mb-4 text-sm text-center">Detailed breakdown of requirements and current implementation status.</p>
                                <div className="space-y-6">
                                    {PHASES.map(phase => {
                                        const isPhaseComplete = completedPhases.includes(phase.id);
                                        return (
                                            <div key={phase.id} className="space-y-2">
                                                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                                                    <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider">Phase {phase.id}: {phase.title}</span>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isPhaseComplete ? 'bg-green-500/10 text-green-400' : 'bg-bg-secondary border border-border text-text-muted'}`}>
                                                        {isPhaseComplete ? 'COMPLETE' : 'PENDING'}
                                                    </span>
                                                </div>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                                    {phase.tasks.map((task, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-xs">
                                                            <span className={`mt-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-full border shrink-0 transition-colors ${isPhaseComplete ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'border-border text-transparent bg-bg-secondary'}`}>
                                                                {isPhaseComplete && <Icons.Check className="w-2.5 h-2.5" />}
                                                            </span>
                                                            <span className={`${isPhaseComplete ? 'text-text-muted line-through' : 'text-text-secondary'}`}>{task}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            
                            <div className="bg-bg-tertiary/30 p-4 rounded-xl border border-border/50">
                                <h4 className="font-mono font-bold text-accent-primary mb-2">3.2 Directive Generation</h4>
                                <p className="mb-2">The system shall provide one-click access to AI-optimized prompt directives.</p>
                                <ul className="list-disc list-inside text-sm space-y-1 opacity-80">
                                    <li>Auto-copy directive to clipboard on expansion</li>
                                    <li>Manual "Copy Directive" action button</li>
                                    <li>Toast notification confirmation upon success</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">4. Non-Functional Requirements</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-bg-primary border border-border">
                                <h4 className="font-bold text-text-primary mb-1">Performance</h4>
                                <p className="text-sm">Time to Interactive (TTI) under 500ms. Zero layout shift (CLS 0).</p>
                            </div>
                            <div className="p-4 rounded-lg bg-bg-primary border border-border">
                                <h4 className="font-bold text-text-primary mb-1">Accessibility</h4>
                                <p className="text-sm">WCAG 2.1 AA Compliant. Full keyboard navigation and screen reader support.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-bg-tertiary/30 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-text-primary text-bg-primary font-bold hover:bg-white transition-colors"
                    >
                        Close Specification
                    </button>
                </div>
            </div>
        </div>
    );
};