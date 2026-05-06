import React, { useState, useEffect, Suspense } from 'react';
import { Stage, StageProgress, PointProgress } from '../types';
import AI_3D_Generator from './AI_3D_Generator';
import ImageTo3DGenerator from './ImageTo3DGenerator';
import AI_Lifestyle_Generator from './AI_Lifestyle_Generator';
import AICritique from './AICritique';
import { ChevronDownIcon, CheckCircleIcon } from './icons';
import Tooltip from './Tooltip';

// Dynamically import the XRViewer to avoid errors in environments without 3D support
const XRViewer = React.lazy(() => import('./XRViewer'));

interface StageContentProps {
    stage: Stage;
    progress: StageProgress;
    onProgressChange: (stageId: number, pointIndex: number, newPointProgress: Partial<PointProgress>) => void;
    projectName: string;
}

const StageContent: React.FC<StageContentProps> = ({ stage, progress, onProgressChange, projectName }) => {
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

    // Reset accordion when the stage changes
    useEffect(() => {
        setActivePointIndex(null);
    }, [stage.id]);

    const handleToggle = (index: number) => {
        setActivePointIndex(activePointIndex === index ? null : index);
    };

    const isXRStage = stage.id === 7 || stage.id === 8;

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12" aria-labelledby="stage-title">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 rounded-xl overflow-hidden shadow-2xl shadow-slate-900/50 aspect-video bg-slate-200 dark:bg-slate-800 hc:bg-black hc:border hc:border-yellow-300">
                    <img src={stage.imageUrl} alt={stage.subtitle} className="w-full h-full object-cover" />
                </div>
                
                <header className="mb-8">
                    <h2 id="stage-title" className="text-4xl font-extrabold text-slate-900 dark:text-white hc:text-yellow-300 tracking-tight mb-2">{stage.title}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 hc:text-yellow-300/80">{stage.subtitle}</p>
                </header>
                
                <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300 hc:text-yellow-300/90">
                    <p>{stage.content.description}</p>
                </div>

                {isXRStage && (
                    <div className="mt-10">
                         <Suspense fallback={<div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />}>
                            <XRViewer mode={stage.id === 7 ? 'AR' : 'VR'} projectName={projectName} />
                        </Suspense>
                    </div>
                )}

                <div className="mt-10 space-y-4">
                    {stage.content.points.map((point, index) => {
                        const isActive = activePointIndex === index;
                        const pointProgress = progress[index] || { checked: false, notes: '' };
                        const isComplete = pointProgress.checked;

                        return (
                            <div key={index} className={`border rounded-lg overflow-hidden transition-all duration-300 ${isComplete ? 'border-green-500/30 bg-green-500/5' : 'border-slate-200 dark:border-slate-700/80 hc:border-yellow-300/50'}`}>
                                <button
                                    onClick={() => handleToggle(index)}
                                    className={`w-full flex justify-between items-start text-left p-4 md:p-5 transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-700/60 hc:bg-yellow-300/20' : 'bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-700/40 hc:hover:bg-yellow-300/10'}`}
                                    aria-expanded={isActive}
                                    aria-controls={`details-${stage.id}-${index}`}
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center font-bold ring-1 transition-colors ${isComplete ? 'bg-green-500/10 text-green-500 dark:text-green-400 ring-green-500/30' : 'bg-sky-500/10 text-sky-500 dark:text-sky-400 ring-sky-500/30 hc:bg-yellow-300/20 hc:text-yellow-300 hc:ring-yellow-300/50'}`}>
                                            {isComplete ? <CheckCircleIcon className="w-5 h-5"/> : index + 1}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <Tooltip content={point.details}>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white hc:text-yellow-300 text-lg">{point.title}</h4>
                                                    <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 text-sm mt-1">{point.description}</p>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <ChevronDownIcon className={`flex-shrink-0 ml-4 mt-1 w-5 h-5 text-slate-500 dark:text-slate-400 hc:text-yellow-300/70 transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                                </button>
                                <div
                                    id={`details-${stage.id}-${index}`}
                                    className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-4 md:px-5 pb-5 ml-12 border-t border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50 pt-4 space-y-6">
                                            <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/90 prose prose-lg">{point.details}</p>
                                            
                                            <div className="bg-slate-100 dark:bg-slate-800/50 hc:bg-black p-4 rounded-lg">
                                                <label htmlFor={`notes-${stage.id}-${index}`} className="block text-sm font-bold text-slate-700 dark:text-slate-300 hc:text-yellow-300/90 mb-2">Your Notes</label>
                                                <textarea
                                                    id={`notes-${stage.id}-${index}`}
                                                    value={pointProgress.notes}
                                                    onChange={(e) => onProgressChange(stage.id, index, { notes: e.target.value })}
                                                    placeholder={`Your thoughts on "${point.title}"...`}
                                                    className="w-full h-28 p-3 bg-white dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-800 dark:text-slate-300 hc:text-yellow-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                                                />
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`complete-${stage.id}-${index}`}
                                                    checked={isComplete}
                                                    onChange={(e) => onProgressChange(stage.id, index, { checked: e.target.checked })}
                                                    className="h-4 w-4 rounded border-slate-400 dark:border-slate-600 hc:border-yellow-300/60 text-sky-500 focus:ring-sky-500 hc:focus:ring-yellow-300 bg-slate-200 dark:bg-slate-700 hc:bg-black"
                                                />
                                                <label htmlFor={`complete-${stage.id}-${index}`} className="ml-3 block text-sm font-medium text-slate-800 dark:text-slate-200 hc:text-yellow-300">
                                                    Mark as Complete
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                <AICritique 
                    stage={stage}
                    progress={progress}
                    projectName={projectName}
                />

                {stage.id === 5 && (
                    <>
                        <AI_3D_Generator projectName={projectName} />
                        <ImageTo3DGenerator projectName={projectName} />
                    </>
                )}

                {stage.id === 6 && <AI_Lifestyle_Generator projectName={projectName} />}

            </div>
        </main>
    );
};

export default StageContent;