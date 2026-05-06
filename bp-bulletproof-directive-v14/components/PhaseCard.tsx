import React, { useState, useEffect } from 'react';
import { Phase } from '../types';
import { Icons } from './Icons';
import { Tooltip } from './Tooltip';

interface PhaseCardProps {
    phase: Phase;
    isExpanded: boolean;
    isCompleted: boolean;
    onToggleExpand: () => void;
    onToggleComplete: () => void;
    onCopyDirective: () => void;
    onRefineDirective: (text: string) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
    phase,
    isExpanded,
    isCompleted,
    onToggleExpand,
    onToggleComplete,
    onCopyDirective,
    onRefineDirective
}) => {
    // Local state for tracking individual task completion
    const [checkedTasks, setCheckedTasks] = useState<number[]>([]);

    // Sync local state with global completion status
    useEffect(() => {
        if (isCompleted) {
            // If phase is marked complete, all tasks are checked
            setCheckedTasks(phase.tasks.map((_, i) => i));
        } else if (checkedTasks.length === phase.tasks.length && phase.tasks.length > 0) {
            // If phase is marked incomplete but all tasks were checked (e.g. user clicked "Mark Incomplete"),
            // reset the local tasks
            setCheckedTasks([]);
        }
    }, [isCompleted, phase.tasks]);

    const handleTaskToggle = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (isCompleted) {
            // If currently complete, unchecking one triggers incomplete status
            onToggleComplete();
            setCheckedTasks(phase.tasks.map((_, i) => i).filter(i => i !== index));
        } else {
            const newChecked = checkedTasks.includes(index)
                ? checkedTasks.filter(i => i !== index)
                : [...checkedTasks, index];
            
            setCheckedTasks(newChecked);

            // If all tasks are now checked, trigger complete status
            if (newChecked.length === phase.tasks.length) {
                onToggleComplete();
            }
        }
    };

    const isTaskChecked = (index: number) => checkedTasks.includes(index);
    const progress = Math.round((checkedTasks.length / Math.max(phase.tasks.length, 1)) * 100);

    // Dynamic color for the phase number
    const getPhaseColor = (id: number) => {
        const colors = {
            1: 'bg-phase-1',
            2: 'bg-phase-2',
            3: 'bg-phase-3',
            4: 'bg-phase-4',
            5: 'bg-phase-5'
        };
        return (colors as any)[id] || 'bg-accent-primary';
    };

    // Dynamic gradient and border for the header
    const getHeaderClasses = (id: number) => {
         const baseClasses = "w-full text-left p-6 flex items-center justify-between gap-4 select-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary rounded-t-2xl border-l-4";
         
         const colorClasses = {
            1: 'bg-gradient-to-r from-phase-1/10 via-phase-1/5 to-transparent border-phase-1 hover:from-phase-1/20',
            2: 'bg-gradient-to-r from-phase-2/10 via-phase-2/5 to-transparent border-phase-2 hover:from-phase-2/20',
            3: 'bg-gradient-to-r from-phase-3/10 via-phase-3/5 to-transparent border-phase-3 hover:from-phase-3/20',
            4: 'bg-gradient-to-r from-phase-4/10 via-phase-4/5 to-transparent border-phase-4 hover:from-phase-4/20',
            5: 'bg-gradient-to-r from-phase-5/10 via-phase-5/5 to-transparent border-phase-5 hover:from-phase-5/20',
         };

         const specificColor = (colorClasses as any)[id] || 'bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 border-transparent';
         
         return `${baseClasses} ${specificColor}`;
    };

    return (
        <div 
            className={`
                group rounded-2xl border transition-all duration-300 overflow-hidden
                ${isCompleted 
                    ? 'bg-bg-secondary/60 border-green-500/30' 
                    : 'bg-bg-secondary border-border hover:border-accent-primary hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                }
            `}
        >
            {/* Header */}
            <button
                type="button"
                onClick={onToggleExpand}
                aria-expanded={isExpanded}
                className={getHeaderClasses(phase.id)}
            >
                <div className="flex items-center gap-6">
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xl shadow-lg shrink-0
                        ${getPhaseColor(phase.id)} transition-all duration-300
                        ${isCompleted ? 'opacity-70 grayscale-[0.3]' : 'group-hover:scale-110'}
                    `}>
                        {phase.id}
                    </div>
                    <div>
                        <h3 className={`
                            font-mono text-xl font-bold tracking-tight transition-all duration-300
                            ${isCompleted 
                                ? 'text-text-muted line-through decoration-2 decoration-green-500/40' 
                                : 'text-text-primary'
                            }
                        `}>
                            {phase.title}
                        </h3>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${isCompleted ? 'text-text-muted/60' : 'text-text-muted'}`}>
                            {phase.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className={`
                        px-3 py-1 rounded-lg font-mono text-xs font-medium uppercase tracking-wider
                        ${isCompleted 
                            ? 'bg-green-500/10 text-green-500/80' 
                            : 'bg-text-muted/20 text-text-muted'
                        }
                    `}>
                        {isCompleted ? '✓ Done' : 'Pending'}
                    </span>
                    <div className={`transform transition-transform duration-300 text-text-muted ${isExpanded ? 'rotate-180' : ''}`}>
                        <Icons.ChevronDown />
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            <div 
                id={`phase-content-${phase.id}`}
                role="region"
                aria-labelledby={`phase-header-${phase.id}`}
                className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="p-6 pt-0 border-t border-border/50">
                    {/* Two Column Layout for Tasks and Deliverables */}
                    <div className="mt-6 grid md:grid-cols-2 gap-8 relative">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

                        {/* Left Column: Tasks */}
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2 pb-2 border-b border-border/50">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded bg-accent-primary/10 text-accent-primary">
                                            <Icons.Check className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-mono text-xs font-bold text-accent-primary uppercase tracking-widest">
                                            Action Items
                                        </h4>
                                    </div>
                                    <span className="font-mono text-[10px] text-text-muted">
                                        {checkedTasks.length}/{phase.tasks.length}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-bg-tertiary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-accent-primary transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            
                            <ul className="space-y-3">
                                {phase.tasks.map((task, i) => {
                                    const checked = isTaskChecked(i);
                                    return (
                                        <li 
                                            key={task.id} 
                                            onClick={(e) => handleTaskToggle(i, e)}
                                            className="group/item flex items-start gap-3 p-3 rounded-xl bg-bg-tertiary/30 border border-transparent hover:border-border hover:bg-bg-tertiary transition-all duration-200 cursor-pointer select-none"
                                        >
                                            <div className={`
                                                mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0
                                                ${checked 
                                                    ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                                                    : 'border-border group-hover/item:border-accent-primary/50'
                                                }
                                            `}>
                                                {checked && <Icons.Check className="w-3 h-3 text-white" strokeWidth="4" />}
                                            </div>
                                            <span className={`text-sm leading-relaxed transition-colors ${checked ? 'text-text-muted line-through' : 'text-text-secondary group-hover/item:text-text-primary'}`}>
                                                {task.title}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Right Column: Deliverables */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50 min-h-[50px]">
                                <div className="p-1.5 rounded bg-accent-secondary/10 text-accent-secondary">
                                    <Icons.Copy className="w-4 h-4" />
                                </div>
                                <h4 className="font-mono text-xs font-bold text-accent-secondary uppercase tracking-widest">
                                    Artifacts
                                </h4>
                            </div>
                            <ul className="space-y-3">
                                {phase.deliverables.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/30 border border-border/50 hover:border-accent-secondary/50 transition-colors group/item">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary shrink-0" />
                                        <span className="text-sm text-text-secondary font-mono break-all">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Phase Directive Section */}
                    <div className="mt-8 p-4 rounded-xl bg-bg-tertiary/50 border border-border/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-accent-tertiary/10 text-accent-tertiary">
                                    <Icons.Bot className="w-4 h-4" />
                                </div>
                                <h4 className="font-mono text-xs font-bold text-text-primary uppercase tracking-widest">
                                    Phase Directive
                                </h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tooltip content="Copy Directive to Clipboard">
                                    <button 
                                        onClick={onCopyDirective}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border hover:border-accent-primary text-text-secondary hover:text-text-primary transition-all active:scale-95 text-xs font-mono font-bold"
                                    >
                                        <Icons.Copy className="w-3.5 h-3.5" />
                                        <span>Copy</span>
                                    </button>
                                </Tooltip>
                                <Tooltip content="Refine this directive with AI Assistant">
                                    <button 
                                        onClick={() => onRefineDirective(phase.directive)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 hover:bg-accent-primary/20 text-accent-primary transition-all active:scale-95 text-xs font-mono font-bold"
                                    >
                                        <Icons.Bot className="w-3.5 h-3.5" />
                                        <span>Refine with AI</span>
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="bg-bg-primary/50 rounded-lg p-4 font-mono text-xs text-text-muted leading-relaxed whitespace-pre-wrap border border-border/20 max-h-48 overflow-y-auto">
                            {phase.directive}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
