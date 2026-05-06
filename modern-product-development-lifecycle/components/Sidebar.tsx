import React from 'react';
import { Stage, ProjectProgress, PointProgress } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import { Cog6ToothIcon } from './icons';

interface SidebarProps {
    stages: Stage[];
    currentStageId: number;
    onSelectStage: (id: number) => void;
    progress: ProjectProgress;
    onAdminClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ stages, currentStageId, onSelectStage, progress, onAdminClick }) => {
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-slate-100/50 dark:bg-slate-800/50 hc:bg-black hc:border-r hc:border-yellow-300/50 backdrop-blur-sm p-4 md:p-6 md:h-screen md:sticky md:top-0 flex flex-col">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white hc:text-yellow-300 mb-2">Product Lifecycle</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-8">Your interactive product development workbook.</p>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {stages.map((stage) => {
                        const stageProgress = progress[stage.id] || {};
                        const completedPoints = Object.values(stageProgress).filter(p => (p as PointProgress).checked).length;
                        const totalPoints = stage.content.points.length;
                        const isComplete = totalPoints > 0 && completedPoints === totalPoints;

                        return (
                            <li key={stage.id} className="mb-2">
                                <button
                                    onClick={() => onSelectStage(stage.id)}
                                    className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                        currentStageId === stage.id
                                            ? 'bg-sky-500 text-white shadow-lg hc:bg-yellow-300 hc:text-black'
                                            : 'text-slate-600 dark:text-slate-300 hc:text-yellow-300/80 hover:bg-slate-200 dark:hover:bg-slate-700 hc:hover:bg-yellow-300/20'
                                    }`}
                                >
                                    <stage.icon className="w-5 h-5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-sm font-semibold">{stage.title.split(':')[0]}</span>
                                        {totalPoints > 0 && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <div className="w-full bg-slate-300 dark:bg-slate-600/50 hc:bg-yellow-300/20 rounded-full h-1.5">
                                                    <div 
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-400' : 'bg-sky-400 hc:bg-yellow-300'}`} 
                                                        style={{ width: `${(completedPoints / totalPoints) * 100}%` }}>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-mono ${isComplete ? 'text-green-500 dark:text-green-400' : 'text-slate-500 dark:text-slate-400 hc:text-yellow-300/70'}`}>{completedPoints}/{totalPoints}</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50">
                <ThemeSwitcher />
                 <button 
                    onClick={onAdminClick}
                    className="w-full mt-4 p-2 rounded-md flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hc:text-yellow-300/70 hover:bg-slate-200 dark:hover:bg-slate-700 hc:hover:bg-yellow-300/20 transition-colors"
                    aria-label="Open Admin Panel"
                >
                    <Cog6ToothIcon className="w-5 h-5" />
                    Admin
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;